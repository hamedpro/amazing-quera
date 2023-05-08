import express from "express";
import cors from "cors";
import formidable from "formidable";
import path from "path";
import fs from "fs";
import { exit } from "process";
import { sign } from "jsonwebtoken";
var app = express();
app.use(cors());
app.use(express.json());
var root_absolute_path = "~/amazing_quera";
var resources_dir_absolute_path = path.resolve(root_absolute_path, "resources");
var json_store_absolute_path = path.resolve(root_absolute_path, "store.json");

if (fs.existsSync(root_absolute_path) !== true) {
	fs.mkdirSync(root_absolute_path);
}
if (fs.existsSync(resources_dir_absolute_path) !== true) {
	fs.mkdirSync(resources_dir_absolute_path);
}
if (fs.existsSync(json_store_absolute_path) !== true) {
	fs.writeFileSync(
		json_store_absolute_path,
		JSON.stringify({ issues: [], answers: [], resources: [], users: [] })
	);
}
if (fs.existsSync(path.join(root_absolute_path, "env.json")) !== true) {
	console.log(
		"env.json file doesnt exist. please create it in this format : {jwt_secret : string}"
	);
	exit();
} else {
	var { jwt_secret } = JSON.parse(
		fs.readFileSync(path.join(root_absolute_path, "env.json"), "utf-8")
	);
}
class store {
	constructor() {
		this.current = JSON.parse(fs.readFileSync(json_store_absolute_path, "utf-8"));
	}
	set current(new_current) {
		this.current = new_current;
		fs.writeFileSync(json_store_absolute_path, JSON.stringify(this.current));
	}
	get current() {
		return JSON.parse(JSON.stringify(this.current));
		// this is because when i want to make modifications on it and rewrite back modified verison
		// the value itself must not change during this job
	}
}
var local_store = new store();
app.post("/resources", (request, response) => {
	var form = formidable({ uploadDir: resources_dir_absolute_path });
	form.parse(request, (error, fields, files) => {
		if (error) {
			response.status(400).json("there was an error");
		} else {
			//there will always just a single file uploaded with
			//label = "file"
			var new_resource_id =
				local_store.current.resources.length === 0
					? 1
					: Math.max(local_store.current_store.resources.map((resource) => resource.id)) +
					  1;
			fs.renameSync(
				files[0].filepath,
				path.resolve(
					resources_dir_absolute_path,
					`${new_resource_id}-${files[0].originalFilename}`
				)
			);
			response.json({ new_resource_id });
		}
	});
});
app.get("/resources/:resource_id", (request, response) => {
	var file_name = fs
		.readdirSync(resources_dir_absolute_path)
		.find((i) => i.startsWith(request.params.resource_id));
	if (file_name === undefined) {
		response.status(400).json("requested resource doesnt exist here");
	} else {
		response.sendFile(path.resolve(resources_dir_absolute_path, file_name));
	}
});
app.post("/issues", (request, response) => {
	try {
		var clone = JSON.parse(JSON.stringify(local_store.current));
		clone.issues.push({
			unit_test_file_id: request.params.unit_test_file_id,
			question: request.params.question,
		});
		local_store.current = clone;
		response.json("all done ");
	} catch (error) {
		response.status(500).json(error);
	}
});
app.post("/answers", (request, response) => {
	var clone = JSON.parse(JSON.stringify(local_store.current));
	var result = {};
	/* it must be {type : "error", value : that error as stirng } 
    (for when there is a runtime error or something )
    or
    {type : "done" , value : boolean}
    (when there is not any runtime error or like that )
    */
	/* here we must try to import "main" function
     from a file with id = request.params.file_id 
     and unit_test_file_id of assosiated issue will use this func and 
     either returns true or false
     (all in try except to catch possible erros)
     and result var will be filled according to its result
    */

	clone.answers.push({
		file_id: request.params.file_id,
		/* username: request.params.username, */ /* todo username must be obtained from jwt which is sent in http request headers */
		result,
	});
	// user only have username and its also their identifier
});
app.get("/:requested_part", (request, response) => {
	//todo i know they must not be visible to everyone but
	//auth system not what im gonna focus on implemeting
	if (["issues", "resources", "answers"].includes(request.params.requested_part) !== true) {
		response.status(400).json("requested data is not available to serve");
		return;
	}
	response.json(local_store.current[request.params.requested_part]);
});
app.post("/is_username_available", (request, response) => {
	//get request can not have body so i changed the method
	response.json(
		!local_store.current.users.map((user) => user.username).includes(request.body.username)
	);
});
app.post("/login", (request, response) => {
	var { username, password } = request.body;
	var user = local_store.current.users.find((user) => user.username === username);
	if (user === undefined) {
		response.status(400).json(`there is not any user with username = ${username}`);
		return;
	}
	response.json({
		jwt: sign(
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

	if (local_store.current.users.map((user) => user.username).includes(username)) {
		response.status(400).json("selected username is already taken !. please try another one ");
		return;
	}
	var tmp = local_store.current;
	tmp.users.push({ username, password });
	local_store.current = tmp;

	response.json({
		jwt: sign({ username, exp: new Date().getTime() + 3600 * 24 * 7 * 1000 }, jwt_secret),
	});
});
app.listen(4000);
