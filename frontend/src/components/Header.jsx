import React from 'react'
import {Navbar, Container, NavDropdown, Nav} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import abcd_logo from '../assets/abcd-logo.png'

const Header = () => {
    return (<header>
        <Navbar bg='black' variant='dark' expand='md' collapseOnSelect>
            <Container>
                <LinkContainer to='/'>
                <Navbar.Brand> <img src={abcd_logo} alt="abcd_gym"></img></Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls='basic-nabar-nav'/>
                <Navbar.Collapse id='basic-nabar-nav'>
                    <Nav className='ms-auto'>
                        <NavDropdown title='Admin' username="AdminMenu">
                            <LinkContainer to='/admin/productList'>
                                <NavDropdown.Item>Membership Plans</NavDropdown.Item>
                            </LinkContainer>
                            <LinkContainer to='/admin/userList'>
                                <NavDropdown.Item>Users</NavDropdown.Item>
                            </LinkContainer>
                        </NavDropdown>
                        <NavDropdown title="User" id='username'>
                            <LinkContainer  to='/users/profile'>
                                <NavDropdown.Item>Profile</NavDropdown.Item>
                            </LinkContainer>
                            <NavDropdown.Item>Logout</NavDropdown.Item>
                        </NavDropdown>
                        <LinkContainer to='/login'><Nav.Link>Login</Nav.Link></LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>)
}

export default Header;