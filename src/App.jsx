import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Issues } from "./components/Issues";
import { NewIssue } from "./components/NewIssue";
import { NewAnswer } from "./components/NewAnswer";
import { Root } from "./components/Root";
import { Register } from "./components/Register";
import { Login } from "./components/Login";
import { Issue } from "./components/Issue";
import { Answer } from "./components/Answer";
export const App = () => {
	window.API_ENDPOINT = "http://localhost:4000";
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Root />} />
				<Route path="/issues/:issue_id" element={<Issue />} />
				<Route path="/answers/:answer_id" element={<Answer />} />
				<Route path="/issues" element={<Issues />} />
				<Route path="/issues/new" element={<NewIssue />} />
				<Route path="/answers/new" element={<NewAnswer />} />
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</BrowserRouter>
	);
};
