import React from "react";
import "../App.css";
import person_working_out from "../assets/person_working_out.jpg";
import equipments from "../assets/equipments.jpg";
import dumbbells from "../assets/dumbbells.jpg";

import { Row, Col } from "react-bootstrap";

function Features() {
	return (
		<>
			<h1 className="text-center mt-4">SERVICES</h1>
			<div className="text-center mt-4" height="50%">
				<Row height="30%">
					<Col>
						<div>
							<h2>COUNSELING ON NUTRITION CHANGES</h2>
							<p className="text-left">
								Nutrition is the most important part of a fitness lifestyle.
								Most people, if at all, fail to get results out of exercise due
								to not making appropriate changes or giving importance to
								nutrition. We will help you and give tips to improve your
								nutrition right at your registration. After all your success is
								hugely dependent on your nutrition.
							</p>
						</div>
					</Col>
					<Col md={6}>
						<img
							width="250px"
							height="250px"
							src={equipments}
							alt="Group of people lifting weights"
						/>
					</Col>
				</Row>
				<Row>
					<Col md={6}>
						<img
							width="250px"
							height="250px"
							fluid="true"
							src={person_working_out}
							alt="Person working out"
						/>
					</Col>
					<Col md={6} className="mt-2">
						<div>
							<h2>PERSONALIZED TRAINING PLAN</h2>
							<p className="text-left">
								Depending On Your Assessment & Personal Information We Will
								Design An Appropriate Training Plan For Your Exercise. Once you
								have a training plan, our qualified trainers will be help you
								learn the exercise properly & move closely with you for the
								first couple of weeks till you learn the exercises with proper
								technique. After that, we always watch you and correct you if
								you make mistakes in performing the exercise. In short, we will
								not let you go without mastering the exercise technique.
							</p>
						</div>
					</Col>
				</Row>
				<Row>
					<Col md={6} className="mt-2">
						<div>
							<h2>FUNDAMENTALS OF FITNESS LIFESTYLE</h2>
							<p className="text-left">
								We do it through 4 hours of classroom sessions. These classes
								covering the most fundamental and important topics you need to
								understand to lead a fitness lifestyle. It will be divided into
								4 sessions of 1hr each covering the following topics- Mindset to
								success, Fitness Nutrition, Fundamentals of Strength Training,
								Tracking for progress.
							</p>
						</div>
					</Col>
					<Col md={6}>
						<img
							width="250px"
							height="250px"
							fluid="true"
							src={dumbbells}
							alt="dumbbells"
						/>
					</Col>
				</Row>
			</div>
		</>
	);
}

export default Features;
