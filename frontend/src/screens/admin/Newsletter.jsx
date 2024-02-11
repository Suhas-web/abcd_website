import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import FormContainer from "../../components/FormContainer";
import { useSendPromotionMutation } from "../../slices/promotionSlice";

function Newsletter() {
	const [subject, setSubject] = useState("");
	const [messageBody, setMessageBody] = useState("");
	const [attachments, setAttachments] = useState([]);

	const [sendPromotion, { isLoading, isError }] = useSendPromotionMutation();
	const handleBodyChange = (e) => {
		setMessageBody(e.target.value);
	};

	const handleAttachmentChange = (e) => {
		setAttachments([...e.target.files]);
	};

	const handleSubmit = async () => {
		const formData = new FormData();
		formData.append("subject", subject);
		formData.append("messageBody", messageBody);
		attachments.forEach((file) => {
			formData.append("attachments", file);
		});

		try {
			const res = await sendPromotion(formData).unwrap();
			if (res) {
				toast.success("Send success");
			} else {
				toast.error("Server error");
			}
		} catch (error) {
			console.error("Error sending data:", error);
			toast.error(error);
		}
	};

	return (
		<FormContainer>
			<h1 className="mb-4">Newsletter</h1>
			<Form.Group controlId="subject" className="mb-3">
				<Form.Label>Subject: </Form.Label>
				<Form.Control
					type="text"
					placeholder="Enter subject"
					value={subject}
					onChange={(e) => setSubject(e.target.value)}
					required
				></Form.Control>
			</Form.Group>
			<Form.Group controlId="messageBody" className="mb-3">
				<Form.Label>Message Body:</Form.Label>
				<Form.Control
					as="textarea"
					value={messageBody}
					onChange={handleBodyChange}
					placeholder="Enter message body..."
					rows={6}
				/>
			</Form.Group>
			<Form.Group controlId="attachments" className="mb-3">
				<Form.Label>Attachments:</Form.Label>
				<Form.Control type="file" onChange={handleAttachmentChange} multiple />
			</Form.Group>
			<Button variant="primary" onClick={handleSubmit}>
				Send Newsletter
			</Button>
		</FormContainer>
	);
}

export default Newsletter;
