import { Carousel, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import carousal1 from "../assets/carousal-1.PNG";

const Carousal = () => {
	const images = [carousal1];
	return (
		<Carousel pause="hover" className="bg-primary">
			{images.map((image, index) => (
				<Carousel.Item key={index}>
					<Link to={`/`}>
						<Image
							src={image}
							fluid
							style={{ width: "100%", height: "1000px", borderRadius: "10px" }}
						/>
						<Carousel.Caption>
							<h3>Transform</h3>
							<p>
								Each transformation story is unique, marked by personal
								challenges, triumphs, setbacks, and moments of inspiration.
							</p>
						</Carousel.Caption>
					</Link>
				</Carousel.Item>
			))}
		</Carousel>
	);
};

export default Carousal;
