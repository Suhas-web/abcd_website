import React from "react";

import "./AboutSection.css";
import { Container } from "react-bootstrap";
const AboutSection = () => {
	return (
		<Container>
			<div className="about-section">
				<h2>Vision</h2>
				<p>
					<strong>Adarsh Barbell Club Dharwad (ABCD)</strong> - The School of
					Fitness, is a one of a kind Strength Training centre with Conventional
					Gym, Fitness Coaching & Nutrition Education centre
					instituted/established with a clear and genuine vision to infuse
					Fitness into the lifestyles and cultures of our society.
				</p>
				<h2>Mission</h2>
				<p>
					<strong>We at ABCD</strong>, are working towards accomplishing our
					vision through our gym - a well-equipped, thoroughly ventilated and a
					hygienic training facility, through which we offer personalised
					Coaching on Strength Training and Nutrition Education to our
					Clientele. We provide appropriate support and guidance to our Clients
					to achieve their Personal Fitness Goals. Our approach is backed by the
					latest scientific methods in the fitness industry. We have helped over
					700 people to become Stronger & Fitter, lose excess Body Fat and build
					a better Physique through Healthy Lifestyle changes which basically
					includes Regular Exercise and Proper Nutrition. Our Mission at ABCD is
					to Influence, Educate and Inspire more and more people to adopt a Fit
					and Healthy Lifestyle, through Fitness Coaching & Nutrition Education.
					Starting locally and spreading globally.
				</p>
				<h2>Core Values</h2>
				<ul>
					<li>Always serve the customers</li>
					<li>Go extra mile to help customers achieve their goals</li>
					<li>Always be completely present with the customers</li>
					<li>Always be friendly</li>
					<li>Always be respectful</li>
					<li>Always respect privacy of customers</li>
					<li>Do not gossip</li>
					<li>Do not get involved personally</li>
				</ul>
				<h2>Contact Information</h2>
				<div className="contact">
					<p>Email: aadarshdesai@gmail.com</p>
					<p>
						<a href="tel:+91 9972958000">9972958000</a>
					</p>
				</div>
			</div>
		</Container>
	);
};

export default AboutSection;
