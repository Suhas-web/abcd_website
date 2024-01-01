import { useEffect, useState } from "react"
import { Button, Col, Form, Row } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { useUpdateProfileMutation } from "../slices/usersApiSlice"
import { setCredentials } from "../slices/authSlice"
import FormContainer from "../components/FormContainer"
import MembershipScreen from './MembershipScreen'

const UserProfileScreen = () => {
    
    const {userInfo} = useSelector(state => state.auth)
    const [name, setName] = useState("")
    const [contact, setContact] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [updateProfile] = useUpdateProfileMutation();
    const dispatch = useDispatch();

    const submitHandler = async (e) => {
        e.preventDefault();
        if(password !== confirmPassword){
            toast.error("Passwords do not match")
        } else {
            try {
                const res = await updateProfile({_id: userInfo._id, name, contact, password}).unwrap();
                dispatch(setCredentials(res));
                toast.success("Profile updated successfully.")
            } catch (err) {
                console.log(err);
                toast.error(err?.data?.message || err?.error);
            }
        }
    }

    useEffect(()=> {
        if(userInfo){
            setName(userInfo.name);
            setContact(userInfo.contact);
        }
    }, [userInfo.name, userInfo.contact, userInfo, setName, setContact])

  return (
    <div className='mt-3'>
    <FormContainer>
    <Row>
        <Col md={8}>
            <Form onSubmit={submitHandler}>
                <Form.Group name='name' className="my-2">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group name='contact' className="my-2"> 
                    <Form.Label>Contact</Form.Label>
                    <Form.Control type="text" value={contact} onChange={(e) => setContact(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group name='password' className="my-2">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="text" value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group name='confirmPassword' className="my-2">
                    <Form.Label>ConfirmPassword</Form.Label>
                    <Form.Control type="text" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control>
                </Form.Group>
                <Button type="submit" className="my-2" variant="primary">Submit</Button> 
            </Form>
        </Col>
        {userInfo && !userInfo.isAdmin &&
        <Col md={4}>
            <MembershipScreen/>
        </Col>}
    </Row>
    </FormContainer>
    </div>
  )
}

export default UserProfileScreen