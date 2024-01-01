import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Container } from 'react-bootstrap'

const MembershipScreen = () => {
    const {userInfo} = useSelector(state => state.auth)
    const [membershipPlan, setMembershipPlan] = useState('')
    const [validTill, setValidTill] = useState('')
    useEffect(()=> {
        if(userInfo){
            setMembershipPlan(userInfo.membershipPlan);
            setValidTill(userInfo.validTill);
        }
    }, [userInfo.setValidTill, userInfo.membershipPlan, userInfo])
  return (
    <Container>
    <h3 className='mt-2'>Membership details</h3>
    {membershipPlan && <p>Active Plan: {membershipPlan}</p>}
    {validTill && <p>Plan expiry: {validTill}</p>}
    </Container>
  )
}

export default MembershipScreen