import express from "express";
import cors from "cors";
import formidable from "formidable";
import path from "path";
import fs from "fs";
import { exit } from "process";
import jwt from "jsonwebtoken";
import { exec, execSync } from "child_process";
import { start_test } from "../answer_tester_part1";

var app = express();
app.use(cors());
app.use(express.json());
var home_path = execSync("echo $HOME ; ").toString().replace("\n", "");
var root_absolute_path = path.join(home_path, "amazing_quera");
var resources_dir_absolute_path = path.join(home_path, "amazing_quera/resources");
var json_store_absolute_path = `${root_absolute_path}/store.json`;
execSync("./first-setup.bash;");
var { jwt_secret } = JSON.parse(execSync(`cat ${root_absolute_path}/env.json;`).toString());
var jwt_check_middleware = (request, response, next) => {
	try {
		jwt.verify(request.headers.jwt, jwt_secret);
		next();
	} catch (error) {
		request.status(403).json(error);
		return;
	}
};
function get_store() {
	return JSON.parse(fs.readFileSync(json_store_absolute_path, "utf-8"));
}
if (fs.existsSync("./uploads") !== true) {
	fs.mkdirSync("./uploads");
}
function set_store(new_object) {
	fs.writeFileSync(json_store_absolute_path, JSON.stringify(new_object));
}
app.post("/resources", async (request, response) => {
	var form = formidable({ uploadDir: "./uploads" });
	var parsing_result = await new Promise((resolve, reject) => {
		form.parse(request, (error, fields, files) => {
			if (error) {
				reject("there is at least an error inside formidable parse");
				return;
			} else {
				//there will always just a single file uploaded with
				//label = "file"
				var new_resource_id = get_store().resources.length + 1;
				set_store({
					...get_store(),
					resources: get_store().resources.concat({ id: new_resource_id }),
				});
				var mv_from = files["file"].filepath;
				var mv_dest = resources_dir_absolute_path + `/file_${new_resource_id}.py`;
				fs.renameSync(mv_from, mv_dest);
				resolve({ new_resource_id });
				return; //it seems to be usefull i know
			}
		});
		//todo catch rejection of that promise
	});
	response.json(parsing_result);
});

app.get("/resources/:resource_id", (request, response) => {
	var file_name = fs
		.readdirSync(resources_dir_absolute_path)
		.find((i) => i === `file_${request.params.resource_id}.py`);
	if (file_name === undefined) {
		response.status(400).json("requested resource doesnt exist here");
	} else {
		response.sendFile(path.resolve(resources_dir_absolute_path, file_name));
	}
});
app.post("/issues", jwt_check_middleware, (request, response) => {
	try {
		var clone = get_store();
		clone.issues.push({
			unit_test_file_id: request.body.unit_test_file_id,
			question: request.body.question,
			id: clone.issues.length + 1,
		});

		//values were undefined so during convertion to json even their properties are gone

		set_store(clone);
		response.json("all done ");
	} catch (error) {
		response.status(500).json(error);
	}
});
app.post("/answers", jwt_check_middleware, (request, response) => {
	var clone = get_store();
	var file_id_of_assosiated_issue = get_store().issues.find(
		(i) => i.id === request.body.issue_id
	).unit_test_file_id;
	var result = start_test(`file_${request.body.file_id}`, `file_${file_id_of_assosiated_issue}`);

	var new_answer = {
		file_id: request.body.file_id,
		username: jwt.decode(request.headers["jwt"]).username,
		result,
		issue_id: request.body.issue_id,
		id: clone.answers.length + 1,
	};
	clone.answers.push(new_answer);
	set_store(clone);
	response.json(new_answer);
	// users only have username and its also their identifier
});
app.get("/:requested_part", (request, response) => {
	//todo i know they must not be visible to everyone but
	//auth system not what im gonna focus on implemeting
	if (["issues", "resources", "answers"].includes(request.params.requested_part) !== true) {
		response.status(400).json("requested data is not available to serve");
		return;
	}
	response.json(get_store()[request.params.requested_part]);
});
app.post("/is_username_available", (request, response) => {
	//get request can not have body so i changed the method
	response.json(
		!get_store()
			.users.map((user) => user.username)
			.includes(request.body.username)
	);
});
app.post("/login", (request, response) => {
	var { username, password } = request.body;
	var user = get_store().users.find((user) => user.username === username);
	if (user === undefined) {
		response.status(400).json(`there is not any user with username = ${username}`);
		return;
	}
	response.json({
		jwt: jwt.sign(
			{
				username,
				exp: new Date().getTime() + 3600 * 24 * 7 * 1000,
			},
			jwt_secret
		),
	});
});
app.post("/register", (request, response) => {
	var { username, password } = request.body;

	if (
		get_store()
			.users.map((user) => user.username)
			.includes(username)
	) {
		response.status(400).json("selected username is already taken !. please try another one ");
		return;
	}
	var tmp = get_store();
	tmp.users.push({ username, password });
	set_store(tmp);

	response.json({
		jwt: jwt.sign({ username, exp: new Date().getTime() + 3600 * 24 * 7 * 1000 }, jwt_secret),
	});
});
app.listen(4000);
