import { Carousel, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import carousal_1 from "../assets/carousal-1.PNG";

const CarouselPage = () => {
	return (
		<Carousel pause="hover" className="bg-primary">
			<Carousel.Item>
				<Link to={`/`}>
					<Image src={carousal_1} fluid="true" />
					<Carousel.Caption>
						<h3>Insert caption</h3>
						<p>Insert description</p>
					</Carousel.Caption>
				</Link>
			</Carousel.Item>
		</Carousel>
	);
};

export default CarouselPage;
