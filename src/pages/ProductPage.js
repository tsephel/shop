import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Button, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'

import { listProductDetails, reviewProduct } from '../actions/productActions'
import { PRODUCT_REVIEW_RESET } from '../constants/productConstants'

function ProductPage({ match, history }) {
    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const dispatch = useDispatch()

    //getting data from store.js before rendering 
    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin

    //getting data from store.js before rendering 
    const productReview = useSelector(state => state.productReview)
    const {error: errorReview, loading: loadingReview, success: successReview} = productReview

    //getting data from store.js before rendering 
    const productDetails = useSelector(state => state.productDetails)
    const {error, loading, product} = productDetails

    useEffect(()=>{
        if(successReview){
            setRating(0)
            setComment('')
            dispatch({
                type: PRODUCT_REVIEW_RESET
            })
        }

        dispatch(listProductDetails(match.params.id))
           
    }, [dispatch, match, successReview])

    const addToCartHandler = () => {
        history.push(`/cart/${match.params.id}?qty=${qty}`)
    }

    const submitHandler = (e) =>{
        e.preventDefault()
        dispatch(reviewProduct(
            match.params.id, {
                rating,
                comment
            }
        ))
    }


    return (
        <div>
           <Link to='/' className='btn btn-light my-3'>Back to Shopping</Link>

            {loading ?
                <Loader />
                :error
                    ?<Message variant='danger'>{error}</Message>
                    : (
                        
                        <div>

                            <Row>
                            <Col md={6}>
                                <Image src={product.image} alt={product.name} fluid />
                        </Col>
            
                        <Col md={3}>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h3>{product.name}</h3>
                                </ListGroup.Item>
            
                                <ListGroup.Item>
                                    <Rating value={product.rating} text={`${product.numReview} reviews`} color={'#f8e825'} />
                                </ListGroup.Item> 
            
                                <ListGroup.Item>
                                    Price: ${product.price}
                                </ListGroup.Item>
            
            
                            </ListGroup>
                        </Col>
            
                        <Col md={3}>
                            <ListGroup variant='flush'>
            
                                <ListGroup.Item>
                                    <Row>
                                            <Col>Price:</Col>
                                            <Col>
                                                <strong>${product.price}</strong>
                                            </Col>
                                        </Row>
                                </ListGroup.Item>
            
                                <ListGroup.Item>
                                    <Row>
                                            <Col>Status:</Col>
                                            <Col>
                                                {product.inStock > 0 ? 'In Stock' : 'Out of Stock'}
                                            </Col>
                                        </Row>
                                </ListGroup.Item>

                                {product.inStock > 0 && (
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Qty</Col>
                                                <Col xs='auto' className='my-1'>
                                                    <Form.Control as='select'
                                                        value={qty} onChange={(e) => setQty(e.target.value)}>
                                                        {
                                                            //created an array out of our stock and map through our array and created out option with key and value
                                                            [...Array(product.inStock).keys()].map((x) => (
                                                                <option key={x+1} value={x+1}>
                                                                    {x + 1}
                                                                </option>
                                                            ))
                                                        }
                                                    </Form.Control>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                )}
            
                                <ListGroup.Item>
                                    <Button onClick={addToCartHandler} className='btn-block' disabled={product.inStock === 0} type='button'>Add to Cart</Button>
                                </ListGroup.Item>

                                
                                    
                            </ListGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <h4>Reviews</h4>
                            {product.reviews.length === 0 && <Message variant='info'>No Reviews</Message>}
                            
                            <ListGroup variant='flush'>
                                {product.reviews.map((review) => (
                                    <ListGroup.Item key={review._id}>
                                        <strong> {review.name} </strong>
                                        <Rating value={review.rating} color='#f8e825' />
                                        <p>{review.createdAt.substring(0, 10)}</p>
                                        <p>{review.comment}</p>

                                    </ListGroup.Item>
                                ))}

                                <ListGroup.Item>
                                    <h4>Comment Your Review</h4>

                                    {loadingReview && <Loader />}
                                    {successReview && <Message variant='success'> Review Submitted </Message>}
                                    {errorReview && <Message variant='danger'> {errorReview} </Message>}

                                    {userInfo ? (
                                        <Form onSubmit={submitHandler}>
                                            <Form.Group controlId='rating'>
                                                <Form.Label>Rating</Form.Label>
                                                <Form.Control as='select' value={rating}
                                                onChange={(e) => setRating(e.target.value)}>
                                                    <option value =''>Select...</option>
                                                    <option value='1'>Poor</option>
                                                    <option value='2'>Fair</option>
                                                    <option value='3'>Good</option>
                                                    <option value='4'>Very Good</option>
                                                    <option value='5'>Excellent</option>

                                                </Form.Control>

                                            </Form.Group>

                                            <Form.Group controlId='comment'>
                                                <Form.Label>Review</Form.Label>
                                                <Form.Control as='textarea' row='5' value={comment}
                                                onChange={(e) => setComment(e.target.value)}>

                                                </Form.Control>

                                            </Form.Group>

                                            <Button disabled={loadingReview} type='submit'
                                            variant='primary'>
                                                Submit
                                            </Button>

                                        </Form>
                                    ) : (
                                        <Message variant='info'> Please <Link to='/login'>Login</Link> to write a review..</Message>
                                    )}
                                </ListGroup.Item>

                            </ListGroup>
                       
                        </Col>
                    </Row>
                
                </div>
                        
                    )    
        }
          
        </div>
    )
}

export default ProductPage
