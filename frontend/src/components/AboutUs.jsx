import "../App.css";
import { Row, Col, CardGroup, Card, Image } from "react-bootstrap";

const AboutUs = () => {
	return (
		<section id="about-us">
			<h1 className="text-center mt-4">ABCD THE SCHOOL OF FITNESS</h1>
			<Row>
				<Col md={2}></Col>
				<Col md={8}>
					<h2 className="text-center">Motto</h2>
					<p>
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
					<p>
						Hi, I am Adarsh. I am a Fitness coach, Educator & the Founder of
						Adarsh Barbell Club Dharwad (ABCD) – The School of Fitness. Adarsh
						Barbell Club Dharwad, was born out of my passion towards Barbell
						based Strength Training as an approach towards Fitness.
					</p>
				</Col>
				<Col md={2}></Col>
			</Row>
		</section>
	);
};

export default AboutUs;
