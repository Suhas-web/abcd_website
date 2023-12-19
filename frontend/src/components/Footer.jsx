import {Container, Row, Col} from "react-bootstrap"

const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="footer-main">
            <p className='text-center my-0 py-0'>Copyright &copy; {currentYear} Adarsh Barbell Club - Dharwad</p>
        </footer>
    )
}

export default Footer;