import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const Issue = () => {
	var nav = useNavigate();
	var issue_id = Number(useParams().issue_id);
	var [issue, set_issue] = useState();
	var [answers, set_answers] = useState();
	async function fetch_data() {
		let tmp = (
			await axios({
				baseURL: window.API_ENDPOINT,
				url: "/issues",
				method: "get",
				headers: {
					jwt : window.localStorage.getItem('jwt')
				}
			})
		).data;
		set_issue(tmp.find((i) => i.id === issue_id));
		set_answers(
			(
				await axios({
					baseURL: window.API_ENDPOINT,
					url: "/answers",
					method: "get",
					headers: {
						jwt : window.localStorage.getItem('jwt')
					}
				})
			).data
		);
	}
	useEffect(() => {
		fetch_data();
	}, []);
	console.log({ issue, answers });
	if (issue === undefined || answers === undefined) return <h1>still loading data ... </h1>;
	return (
		<>
			<h1>Issue #{issue_id}</h1>
			<h3>question : {issue.question}</h3>
			<button onClick={() => nav("/answers/new")}>add an answer </button>
			<h1>answers of this issue :</h1>
			<table>
				<thead>
					<tr>
						<th>answer id</th>
						<th>answer result</th>
						<th>answer submitter</th>
					</tr>
				</thead>
				<tbody>
					{answers
						.filter((i) => i.issue_id === issue_id)
						.map((i) => (
							<tr>
								<td>{i.id}</td>
								<td>{i.result}</td>
								<td>{i.username}</td>
							</tr>
						))}
				</tbody>
			</table>
		</>
	);
};
