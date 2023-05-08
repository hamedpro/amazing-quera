import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const Issue = () => {
	var { issue_id } = useParams();
	var [issue, set_issue] = useState();
	async function fetch_data() {
		set_issue(
			(
				await axios({
					baseURL: window.API_ENDPOINT,
					url: "/issues",
					method: "get",
				})
			).data.issues.find((i) => i.id === issue_id)
		);
	}
	useEffect(() => {
		fetch_data();
	});
	return (
		<>
			<h1>Issue #{issue_id}</h1>
			<h3>question : {issue.question}</h3>
			{/* todo also show answers of this issues here */}
		</>
	);
};
