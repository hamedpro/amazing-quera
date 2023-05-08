import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Issues = () => {
	var [issues, set_issues] = useState();
	async function fetch_data() {
		set_issues(
			(
				await axios({
					baseURL: window.API_ENDPOINT,
					url: "/issues",
					method: "get",
				})
			).data.issues
		);
	}
	useEffect(() => {
		fetch_data();
	});
	if (issues === undefined) return <h1>still loading issues...</h1>;
	return (
		<>
			<h1>Issues</h1>
			<table>
				<thead>
					<tr>
						<th>id</th>
						<th>question</th>
						<th>options</th>
					</tr>
				</thead>
				<tbody>
					{issues.map((issue) => (
						<tr key={issue.id}>
							<td>{issue.id}</td>
							<td>{issue.question}</td>
							<td>
								<Link to={`/issues/${issue.id}`} />{" "}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
};
