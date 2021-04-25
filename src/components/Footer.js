import { Container, Row, Col } from 'react-bootstrap'
import React from 'react'

function Footer() {
    return (
        <div>
            <Container>
                <Row>
                    <Col className='text-center py-3'>Copyright &copy; Ecommerce</Col>
                </Row>
            </Container>
        </div>
    )
}

export default Footer
