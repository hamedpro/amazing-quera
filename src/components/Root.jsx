import { Link } from "react-router-dom";

export const Root = () => {
	return (
		<>
			<h1>Root page </h1>
			<Link to="/register">registering new account </Link>
			<br />
			<Link to="/login">login page</Link>
			<br />
			<Link to="/issues">all issues</Link>
			<br />
			<Link to="/answers/new">new answer </Link>
			<br />
			<Link to="/issues/new">new issue </Link>
		</>
	);
};
