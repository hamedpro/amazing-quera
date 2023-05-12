import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const Answer = () => {
	var answer_id = Number(useParams().answer_id);
	var [answer, set_answer] = useState();
	async function fetch_data() {
		set_answer(
			(
				await axios({
					baseURL: window.API_ENDPOINT,
					url: "answers",
					method: "get",
					headers: {
						jwt: window.localStorage.getItem("jwt"),
					},
				})
			).data.find((i) => i.id === answer_id)
		);
	}
	useEffect(() => {
		fetch_data();
	}, []);
	if (answer === undefined) return <h1>still loading answer ...</h1>;
	return (
		<>
			<h1>Answer</h1>
			<pre>{JSON.stringify(answer, undefined, 4)}</pre>
		</>
	);
};
