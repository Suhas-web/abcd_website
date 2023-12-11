import {Container, Row} from 'react-bootstrap'

import React from 'react'

const FormContainer = ({children}) => {
  return (
    <Container>
        <Row className='justify-content-md-center'>
            {children}
        </Row>
    </Container>
  )
}

export default FormContainer