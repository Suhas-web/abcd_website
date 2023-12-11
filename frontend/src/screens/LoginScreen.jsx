import React from 'react'
import { useState } from 'react'
import { Row, Col, Button, Form } from 'react-bootstrap';
import { Link, useLocation, useNavigate} from 'react-router-dom'
import FormContainer from '../components/FormContainer';

const LoginScreen = () => {

    const [contact, setContact] = useState("");
    const [password, setPassword] = useState("");
    // const dispatch = useDispatch();
    // const navigate = useNavigate();

    // const {search} = useLocation();
    // const sp = new URLSearchParams(search);
    // const redirect = sp.get('redirect') || '/';

    // useEffect(() => {
    //     if(userInfo){
    //         navigate(redirect)
    //     }
    // }, [userInfo, redirect, navigate])

    // const [login, {isLoading}] = useLoginMutation();
    const submitHandler = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const res = await login({contact, password}).unwrap();
    //         dispatch(setCredentials({...res}))
    //     } catch (err) {
    //         console.log(err?.data);
    //         if(err?.data?.stack?.includes("Invalid contact")){
    //             toast.error("Invalid contact or password. Please try again")
    //         } else {
    //             toast.error(err?.data?.message || err.error)
    //         }
    //     }  
    }

  return (
    <>
    <FormContainer className='mb-3 mt-3'>
        <Col md={8} xs={12}>
            <h1>Login</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='contact' className='my-3'>
                    <Form.Label>Email/Phone Number</Form.Label>
                    <Form.Control type="text" placeholder="Enter contact" 
                    value={contact} 
                    onChange={(e) => setContact(e.target.value)} required>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='password' className='mt-2'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="text" placeholder="Enter password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} required>
                    </Form.Control>
                </Form.Group>
                <Button type='submit' variant='primary' className='mt-2 align-items-center' 
                // disabled={isLoading}
                >
                    Sign In
                </Button>
                {/* {isLoading && <Loader />} */}
            </Form>
            <Row className='py-3 text-center'>
                <Col>
                    New User? <Link to='/register'>Register</Link>
                </Col>
            </Row>
        </Col>
    </FormContainer>
    </>
  )
}

export default LoginScreen