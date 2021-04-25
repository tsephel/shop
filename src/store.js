import { createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { productListReducers, productDetailsReducers, productDeleteReducers, productCreateReducers, productUpdateReducers, productReviewReducers, productFeatureReducers } from './reducers/productReducers'
import { cartReducer } from './reducers/cartReducers'
import { userLoginReducers, userRegisterReducers, userDetailReducers, userUpdateProfileReducers, 
   userListReducers, userDeleteReducers, userUpdateReducers} from './reducers/userReducers'
import { orderCreateReducer, orderDetailsReducer, orderPayReducer, orderListMyReducer, orderListReducer, orderDeliverReducer } from './reducers/orderReducer'


const reducer = combineReducers({
   productList: productListReducers,
   productDetails: productDetailsReducers,
   productDelete: productDeleteReducers,
   productCreate: productCreateReducers,
   productUpdate: productUpdateReducers,
   productReview: productReviewReducers, 
   productFeature: productFeatureReducers,

   cart: cartReducer,

   userLogin: userLoginReducers,
   userRegister: userRegisterReducers,
   userDetail: userDetailReducers,
   userUpdateProfile: userUpdateProfileReducers,
   userList: userListReducers,
   userUpdate: userUpdateReducers,
   
   userDelete: userDeleteReducers,

   orderCreate: orderCreateReducer,
   orderDetail: orderDetailsReducer,
   orderPay: orderPayReducer,
   orderListMy: orderListMyReducer,
   orderList: orderListReducer,
   orderDeliver: orderDeliverReducer,
  

})

const cartItemsFromStorage = localStorage.getItem('cartItems') ?
         JSON.parse(localStorage.getItem('cartItems')) : []


const userInfoFromStorage = localStorage.getItem('userInfo') ?
         JSON.parse(localStorage.getItem('userInfo')) : null

const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ?
         JSON.parse(localStorage.getItem('shippingAddress')) : {}

const initialState = {
   cart:{
      cartItems: cartItemsFromStorage, 
      shippingAddress: shippingAddressFromStorage
      },
   userLogin:{userInfo: userInfoFromStorage}
}

const middleware = [thunk]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store