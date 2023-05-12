import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
export const NewAnswer = () => {
	var nav = useNavigate();
	var [issues, set_issues] = useState();
	var [selectbox_value, set_selectbox_value] = useState({
		value: undefined,
		label: "please choose an option ",
	});
	async function submit_answer() {
		if (selectbox_value.value === undefined) {
			alert("you must select assosiated issue.");
			return;
		}
		var files = document.getElementById("answer_file_input").files;
		if (files.length !== 1) {
			alert("exactly one file must be choosen");
			return;
		}
		var form = new FormData();
		form.append("file", files[0]);
		var new_answer_file_id = (
			await axios({
				baseURL: window.API_ENDPOINT,
				method: "post",
				url: "/resources",
				data: form,

				headers: {
					jwt: window.localStorage.getItem("jwt"),
				},
			})
		).data.new_resource_id;
		var new_answer_id = (
			await axios({
				baseURL: window.API_ENDPOINT,
				url: "/answers",
				method: "post",
				headers: {
					jwt: window.localStorage.getItem("jwt"),
				},
				data: {
					file_id: new_answer_file_id,
					issue_id: selectbox_value.value,
				},
			})
		).data.id;
		alert("all done!");
		nav(`/answers/${new_answer_id}`);
	}
	async function fetch_issues() {
		set_issues(
			(
				await axios({
					baseURL: window.API_ENDPOINT,
					url: "/issues",
					method: "get",

					headers: {
						jwt: window.localStorage.getItem("jwt"),
					},
				})
			).data
		);
	}
	useEffect(() => {
		fetch_issues();
	}, []);
	if (issues === undefined) return "issues are still being loaded ...";
	if (window.localStorage.getItem("jwt") === null) {
		//i know its better to verify jwt here instead of just checking whether it exists or not
		//but it doesnt seem nessesaty to me right now !
		return <h1>you have to be loged-in in order to use this route </h1>;
	}
	return (
		<>
			<h1>NewAnswer</h1>
			<p>
				you must select and upload a .py file which contains a "main" function. it will be
				used by unit_test.
			</p>
			<input type="file" id="answer_file_input" />
			<h3>select assosiated issue : </h3>
			<Select
				isSearchable
				options={issues.map((issue) => ({
					value: issue.id,
					label: `#${issue.id} : ${issue.question}`,
				}))}
				isMulti={false}
				value={selectbox_value}
				onChange={(newValue) => set_selectbox_value(newValue)}
			/>
			<button onClick={submit_answer}>submit this answer </button>
		</>
	);
};
