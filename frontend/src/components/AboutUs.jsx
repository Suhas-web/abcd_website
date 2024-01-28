import "../App.css";
import { Row, Col, CardGroup, Card, Image } from "react-bootstrap";
import maruti from "../assets/maruti.webp";

const AboutUs = () => {
	return (
		<section id="about-us">
			<h1 className="text-center mt-4">ABCD THE SCHOOL OF FITNESS</h1>
			<Row>
				<Col md={2}></Col>
				<Col md={8}>
					<h2 className="text-center">Motto</h2>
					<p className="quotes">
						We at abcd impart the most appropriate & scientific way of exercise
						and training for strength. Get the right fitness education to
						understand all that goes into a healthy fitness lifestyle.
						Understand the basics of nutrition and practical ways to implement
						it. Get the best results out of your efforts at the gym. Adopt an
						effective way to keep track of your exercise and food intake along
						with the results you expect. Be in control!
					</p>
				</Col>
				<Col md={2}></Col>
			</Row>
			<Row>
				<Col md={2}></Col>
				<Col md={8}>
					<h2 className="text-center">My Story</h2>
					<p className="quotes">
						Hi, I am Adarsh. I am a Fitness coach, Educator & the Founder of
						Adarsh Barbell Club Dharwad (ABCD) – The School of Fitness. Adarsh
						Barbell Club Dharwad, was born out of my passion towards Barbell
						based Strength Training as an approach towards Fitness.
					</p>
				</Col>
				<Col md={2}></Col>
			</Row>
			<Row>
				<Col md={2}></Col>
				<CardGroup>
					<Col md={8}>
						<Card>
							<Card.Img
								variant="top"
								src={maruti}
								height="5%"
								width="30%"
								fluid
							/>
							<Card.Body>
								<Card.Title>Maruti</Card.Title>
								<Card.Text>
									Maruti has been taking care of himself when he was 13yr old.
									He has tried his hand at Wrestling, Football, Gardening,
									Photography, Videography, Modeling & Competitive Bodybuilding.
									A man of several interests & talents has always had the gym
									and training close to his heart.
								</Card.Text>
							</Card.Body>
							<Card.Footer>
								<small className="text-muted">Last updated 3 mins ago</small>
							</Card.Footer>
						</Card>
					</Col>
				</CardGroup>
				<CardGroup>
					<Col md={8}>
						<Card>
							<Card.Img
								variant="top"
								src={maruti}
								height="5%"
								width="30%"
								fluid
							/>
							<Card.Body>
								<Card.Title>Maruti</Card.Title>
								<Card.Text>
									Maruti has been taking care of himself when he was 13yr old.
									He has tried his hand at Wrestling, Football, Gardening,
									Photography, Videography, Modeling & Competitive Bodybuilding.
									A man of several interests & talents has always had the gym
									and training close to his heart.
								</Card.Text>
							</Card.Body>
							<Card.Footer>
								<small className="text-muted">Last updated 3 mins ago</small>
							</Card.Footer>
						</Card>
					</Col>
				</CardGroup>
				<Col md={2}></Col>
			</Row>
		</section>
	);
};

export default AboutUs;
