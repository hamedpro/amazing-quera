import axios from "axios";
import { useNavigate } from "react-router-dom";

export const NewIssue = () => {
	if (window.localStorage.getItem("jwt") === null) {
		return <h1>you must login first in order to submit a new issue</h1>;
	}
	var nav = useNavigate();
	async function submit_new_issue() {
		var files = document.getElementById("issue_uint_test_file_input").files;
		if (files.length !== 1) {
			alert("exatly one file must be choosen as unit_test_file");
			return;
		}
		var form = new FormData();
		form.append("file", files[0]);

		var { new_resource_id } = (
			await axios({
				baseURL: window.API_ENDPOINT,
				url: "/resources",
				method: "post",
				data: form,

				headers: {
					jwt: window.localStorage.getItem("jwt"),
				},
			})
		).data;

		var response = (
			await axios({
				baseURL: window.API_ENDPOINT,
				url: "/issues",
				method: "post",
				data: {
					unit_test_file_id: new_resource_id,
					question: document.getElementById("question_input").value,
				},

				headers: {
					jwt: window.localStorage.getItem("jwt"),
				},
			})
		).data;
		alert("all done !");
		nav("/issues");
	}
	return (
		<>
			<h1>NewIssue</h1>
			<h3>select unit test file : </h3>
			<p>
				a .py file which has a function defined in itself : "unit_test" this function gets
				the answer function as its first para and can test it however it likes it must
				return a number from 0 to 100 also any exeption can be raised
			</p>
			<input id="issue_uint_test_file_input" type="file" />
			<h3>enter a question and explain what this issue wants the students to do :</h3>
			<input type="text" id="question_input" />
			<button onClick={submit_new_issue}>submit new issue</button>
		</>
	);
};
