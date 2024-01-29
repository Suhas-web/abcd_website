import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const SearchBox = ({ url }) => {
	const { keyword: searchBy } = useParams();
	const [name, setName] = useState(searchBy ? searchBy.trim() : "");
	const navigate = useNavigate();
	const submitHandler = (e) => {
		e.preventDefault();
		if (name) {
			navigate(`${url}/search/${name.trim()}`);
		} else {
			setName("");
			navigate(`${url}`);
		}
	};

	return (
		<Form onSubmit={submitHandler} className="d-flex mt-3 mb-3">
			<Form.Control
				type="text"
				name="search"
				value={name}
				placeholder="Search User Name"
				onChange={(e) => setName(e.target.value)}
				className="pl-2"
			></Form.Control>
			<Button variant="success" type="submit" className="ml-3">
				Search
			</Button>
		</Form>
	);
};

export default SearchBox;
