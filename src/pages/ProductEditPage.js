import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button} from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listProductDetails, updateProduct } from '../actions/productActions'
import FormContainer from '../components/FormContainer'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'

function ProductEditPage({match, history}) {

    const productId = match.params.id

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [inStock, setInStock] = useState(0)
    const [description, setDescription] = useState('')
   

    const dispatch = useDispatch()


    const productDetails = useSelector(state => state.productDetails)
    const {error, loading, product} = productDetails

    const productUpdate = useSelector(state => state.productUpdate)
    const {error: errorUpdate, loading: loadingUpdate, success: successUpdate} = productUpdate

    useEffect(() =>{
            if(successUpdate){
                dispatch({
                    type: PRODUCT_UPDATE_RESET,    
                })
                history.push('/admin/productlist')
            }else{

                if(!product.name || product._id !== Number(productId)){
                    dispatch(listProductDetails(productId))
               }else{
                   setName(product.name)
                   setPrice(product.price)
                   setImage(product.image)
                   setBrand(product.brand)
                   setInStock(product.inStock)
                   setCategory(product.category)
                   setDescription(product.description)   
                  
               }

            }      
    
    }, [dispatch, product, productId, successUpdate, history])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateProduct({  
            _id: product.id,
            name,
            price,
            image,
            brand,
            category,
            inStock,
            description
        }))
        
    }

    return (
        <div>

            <Link to='/admin/productlist'>
                Go Back
            </Link>

            <FormContainer>
                    <h1>Edit Product</h1>

                    {loadingUpdate && <Loader />}
                    {errorUpdate && <Message variant='danger'> {errorUpdate} </Message>}

                    {loading ? <Loader/> : error ? <Message variant='danger'> {error} </Message> 
                    
                    : (

                            <Form onSubmit={submitHandler}>

                                    <Form.Group controlId='name'>
                                        <Form.Label>Name</Form.Label>

                                        <Form.Control type='name' placeholder='Enter Name' 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)}>
                                        
                                        </Form.Control>

                                    </Form.Group>

                                    <Form.Group controlId='price'>
                                        <Form.Label>Price</Form.Label>

                                        <Form.Control type='number' placeholder='Enter Price' 
                                        value={price} 
                                        onChange={(e) => setPrice(e.target.value)}>
                                        
                                        </Form.Control>

                                    </Form.Group>

                                    <Form.Group controlId='image'>
                                        <Form.Label>Image</Form.Label>

                                        <Form.Control type='text' placeholder='Choose Image' 
                                        value={image} 
                                        onChange={(e) => setImage(e.target.value)}>
                                        
                                        </Form.Control>

                                    </Form.Group>

                                    <Form.Group controlId='brand'>
                                        <Form.Label>Brand</Form.Label>

                                        <Form.Control type='text' placeholder='Enter Brand' 
                                        value={brand} 
                                        onChange={(e) => setBrand(e.target.value)}>
                                        
                                        </Form.Control>

                                    </Form.Group>

                                    <Form.Group controlId='inStock'>
                                        <Form.Label>Stock</Form.Label>

                                        <Form.Control type='number' placeholder='Enter Stock' 
                                        value={inStock} 
                                        onChange={(e) => setInStock(e.target.value)}>
                                        
                                        </Form.Control>

                                    </Form.Group>

                                    <Form.Group controlId='category'>
                                        <Form.Label>Category</Form.Label>

                                        <Form.Control type='text' placeholder='Enter Category' 
                                        value={category} 
                                        onChange={(e) => setCategory(e.target.value)}>
                                        
                                        </Form.Control>

                                    </Form.Group>

                                    <Form.Group controlId='description'>
                                        <Form.Label>Description</Form.Label>

                                        <Form.Control type='text' placeholder='Enter Description' 
                                        value={description} 
                                        onChange={(e) => setDescription(e.target.value)}>
                                        
                                        </Form.Control>

                                    </Form.Group>


                                    <Button type='submit' variant='primary'>Update</Button>

                            </Form>

                    )}
                       
                    
                </FormContainer>

        </div>

       
    )
}

export default ProductEditPage

