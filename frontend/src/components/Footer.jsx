import {Container, Row, Col} from "react-bootstrap"

const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="footer-main">
            <Container>
                <Row>
                    <Col className='text-center py-3'>
                        <p>Copyright &copy; {currentYear} Adarsh Barbell Club - Dharwad</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}

export default Footer;