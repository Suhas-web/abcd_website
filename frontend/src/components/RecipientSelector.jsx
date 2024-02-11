import React, { useState } from "react";
import { Form } from "react-bootstrap";

function RecipientSelector({ userEmail, recipientEmails, onChange }) {
	const [selectedEmails, setSelectedEmails] = useState([]);

	const handleCheckboxChange = (e) => {
		const email = e.target.value;
		let updatedSelectedEmails;

		if (e.target.checked) {
			updatedSelectedEmails = [...selectedEmails, email];
		} else {
			updatedSelectedEmails = selectedEmails.filter(
				(selectedEmail) => selectedEmail !== email
			);
		}

		setSelectedEmails(updatedSelectedEmails);
		onChange(updatedSelectedEmails);
	};

	return (
		<div>
			<h3>Your Email: {userEmail}</h3>
			<Form.Group>
				{recipientEmails.map((email) => (
					<Form.Check
						key={email}
						type="checkbox"
						label={email}
						value={email}
						checked={selectedEmails.includes(email)}
						onChange={handleCheckboxChange}
					/>
				))}
			</Form.Group>
		</div>
	);
}

export default RecipientSelector;
