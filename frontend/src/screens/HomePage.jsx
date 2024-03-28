import React from "react";
import CarouselPage from "../components/Carousal";
import Features from "../components/Features";
import AboutUs from "../components/AboutUs";
import WelcomeToGym from "../components/WelcomeToGym";
import AboutSection from "../components/AboutSection";
const HomePage = () => {
	return (
		<>
			<WelcomeToGym />
			<CarouselPage />
			<Features />
			<AboutUs />
			<AboutSection />
		</>
	);
};

export default HomePage;
