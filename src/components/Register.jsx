import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Register = () => {
	var nav = useNavigate();
	async function submit_data() {
		var { jwt } = (
			await axios({
				baseURL: window.API_ENDPOINT,
				url: "/users",
				method: "post",
				data: {
					username: document.getElementById("username_input").value,
					password: document.getElementById("password_input").value,
				},
			})
		).data;
		window.localStorage.setItem("jwt", jwt);
		alert("all done successfuly!");
		nav("/");
		//todo : before submitting form availability
		//of username must be checked
	}
	return (
		<>
			<h1>Register</h1>
			<h3>choose a username</h3>
			<input id="username_input" type="text" />

			<h3>choose a password</h3>
			<input id="password_input" type="text" />

			<button onClick={submit_data}>submit data </button>
		</>
	);
};
