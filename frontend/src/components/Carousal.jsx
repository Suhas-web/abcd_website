import { Carousel, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import carousal_1 from "../assets/carousal-1.PNG";
import adarsh from "../assets/Adarsh.jpg";
import boris from "../assets/Boris.jpg";
import pooja from "../assets/Pooja Y_A.jpg";
import adeep from "../assets/Adeep.JPG";
import vaibhav from "../assets/Vaibhav.jpg";
import ravikumar from "../assets/Ravikumar.JPG";
import rahmat from "../assets/Rahmat.jpg";
import prajval from "../assets/Prajval.jpg";

import { useState,useEffect } from "react";

const Carousal = () => {

const images = [adarsh,boris,pooja,adeep,vaibhav,ravikumar,rahmat,prajval]
	return (
	  <Carousel pause="hover" className="bg-primary">
		{images.map((image, index) => (
		  <Carousel.Item key={index}>
			<Link to={`/`}>
			  <Image src={image} fluid style={{ width: '100%', height: '1000px', borderRadius: '10px' }} />
			  <Carousel.Caption>
				<h3>Transformation and Testimonials</h3>
				<p>Each transformation story is unique, marked by personal challenges, triumphs, setbacks, and moments of inspiration. From weight loss goals to muscle gain aspirations, every journey begins with a single step towards a healthier lifestyle.</p>
			  </Carousel.Caption>
			</Link>
		  </Carousel.Item>
		))}
	  </Carousel>
	);
  };

export default Carousal;
