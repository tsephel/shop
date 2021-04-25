import React, { useState } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { savePaymentMethod } from '../actions/cartActions'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'

function PaymentPage({history}) {
    const cart = useSelector(state => state.cart)
    const {shippingAddress} = cart

    const dispatch = useDispatch()

    const [paymentMethod, setPaymentMethod] = useState('Paypal')

    if(!shippingAddress.address) {
        history.push('/shipping')
    }

    const submitHandler = (e) =>{
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        history.push('/placeorder')
    }

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />

            <Form onSubmit={submitHandler}>

                <Form.Group>
                    <Form.Label as='legend'>Select Method</Form.Label>
                    <Col>
                        <Form.Check type='radio' label='Paypal' id='paypal' 
                        name='paymentMethod' 
                        checked 
                        onChange={(e) => setPaymentMethod(e.target.value)}>

                        </Form.Check>
                    </Col>
                </Form.Group>

                <Button type='submit' variant='primary'> 
                    Continue
                </Button>
            </Form>
            
        </FormContainer>
    )
}

export default PaymentPage
