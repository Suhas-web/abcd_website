import React from 'react'
import {Navbar, Container, NavDropdown, Nav, NavLink} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import abcd_logo from '../assets/abcd-logo.png'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../slices/authSlice'
import { toast } from 'react-toastify'
import {FaUser} from 'react-icons/fa'
import { useLogoutMutation } from '../slices/usersApiSlice'

const Header = () => {
    const {userInfo} = useSelector(state => state.auth)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutApi] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            await logoutApi().unwrap();
            dispatch(logout());
            navigate('/login')
        } catch (err) {
            console.log(err);
            toast.error(err);
        }
    }
    
    return <header>
        <Navbar bg='black' variant='dark' expand='md' collapseOnSelect>
            <Container>
                <LinkContainer to='/'>
                <Navbar.Brand> <img src={abcd_logo} alt="abcd_gym"></img></Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls='basic-nabar-nav'/>
                <Navbar.Collapse id='basic-nabar-nav'>
                    <Nav className='ms-auto'>
                        {userInfo && !userInfo.isAdmin &&
                        <LinkContainer to="/users/trainingPlan">
                            <Nav.Link>Training Plan</Nav.Link>
                        </LinkContainer>} 

                        {userInfo && userInfo.isAdmin && 
                        <NavDropdown title='Admin' username="AdminMenu">
                            <LinkContainer to='/admin/userList'>
                                <NavDropdown.Item>Users</NavDropdown.Item>
                            </LinkContainer>
                            <LinkContainer to='/admin/uploadFiles'>
                                <NavDropdown.Item>Upload Plan</NavDropdown.Item>
                            </LinkContainer>
                        </NavDropdown>}

                        {userInfo ? <NavDropdown title={userInfo.name} id='username'>
                            <LinkContainer to='/users/profile'>
                                <NavDropdown.Item>Profile</NavDropdown.Item>
                            </LinkContainer>
                            <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                        </NavDropdown>
                        :
                        <LinkContainer to='/login'>
                            <Nav.Link><FaUser/> Login</Nav.Link>
                        </LinkContainer>}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>
}

export default Header;