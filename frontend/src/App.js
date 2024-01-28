import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function App() {
	const { userInfo } = useSelector((state) => state.auth);
	return (
		<>
			{!userInfo && <Navigate to="/" replace />}
			<Header />
			<main>
				<Outlet />
			</main>
			<Footer />
			<ToastContainer />
		</>
	);
}

export default App;
