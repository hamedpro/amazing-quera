import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Issues } from "./components/Issues";
import { NewIssue } from "./components/NewIssue";
import { NewAnswer } from "./components/NewAnswer";
export const App = () => {
	window.API_ENDPOINT = "http://localhost:4000";
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Root />} />
				<Route path="/issues" element={<Issues />} />
				<Route path="/issues/new" element={<NewIssue />} />
				<Route path="/answers/new" element={<NewAnswer />} />
			</Routes>
		</BrowserRouter>
	);
};
