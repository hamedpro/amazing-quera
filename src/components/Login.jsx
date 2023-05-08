import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Login = () => {
	var nav = useNavigate();
	async function try_login() {
		var password = document.getElementById("password_input").value;
		var username = document.getElementById("username_input").value;
		var response = (
			await axios({
				baseURL: window.API_ENDPOINT,
				url: "/login",
				method: "post",
				data: {
					password,
					username,
				},
			})
		).data;
		/* 
        response is in this format :  {jwt : string | undefined }
        jwt == undefined means that auth failed.
         */
		if (response.jwt !== undefined) {
			localStorage.setItem("jwt", response.jwt);
			alert("all done!");
			nav("/");
		} else {
			alert("auth failed. please try again ");
		}
	}
	return (
		<>
			<h1>Login</h1>
			<h3>username :</h3>
			<input id="username_input" />
			<h3>password :</h3>
			<input id="password_input" />
			<button onClick={try_login}>login </button>
		</>
	);
};
