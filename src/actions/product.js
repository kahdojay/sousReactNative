import shortid from 'shortid'
import MessageActions from './message'
import {
  RESET_PRODUCTS,
  GET_PRODUCTS,
  RECEIVE_PRODUCTS,
  ERROR_PRODUCTS,
  ADD_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  ORDER_PRODUCT_PRODUCT
} from './actionTypes'

export default function ProductActions(ddpClient){

  function resetProducts(){
    return {
      type: RESET_PRODUCTS
    }
  }

  // function addProduct(name) {
  //   return (dispatch, getState) => {
  //     const { session } = getState();
  //     var newProductAttributes = {
  //       _id: shortid.generate(),
  //       teamId: session.teamId,
  //       name: productRow.name,
  //       description: productRow.description,
  //       price: productRow.price,
  //       purveyors: purveyors,
  //       amount: productRow.amount,
  //       unit: productRow.unit,
  //       deleted: false,
  //     }
  //     ddpClient.call('createProduct', [newProductAttributes]);
  //     return dispatch({
  //       type: ADD_PRODUCT,
  //       product: newProductAttributes
  //     });
  //   }
  // }
  //
  // function updateProduct(productId, productAttributes){
  //   ddpClient.call('updateProduct', [productId, productAttributes]);
  //   return {
  //     type: UPDATE_PRODUCT,
  //     productId: productId,
  //     product: productAttributes
  //   }
  // }
  // 
  // function deleteProduct(productId) {
  //   return (dispatch, getState) => {
  //     const {session} = getState()
  //     ddpClient.call('deleteProduct', [productId, session.userId])
  //     return {
  //       type: DELETE_PRODUCT,
  //       productId: productId
  //     }
  //   }
  // }

  function requestProducts() {
    return {
      type: REQUEST_PRODUCTS
    }
  }

  function errorProducts(errors){
    return {
      type: ERROR_PRODUCTS,
      errors: errors
    }
  }

  function receiveProducts(product) {
    return {
      type: RECEIVE_PRODUCTS,
      product: product
    }
  }

  return {
    RESET_PRODUCTS,
    GET_PRODUCTS,
    RECEIVE_PRODUCTS,
    ERROR_PRODUCTS,
    ADD_PRODUCT,
    UPDATE_PRODUCT,
    DELETE_PRODUCT,
    // addProduct,
    // updateProduct,
    // deleteProduct,
    receiveProducts,
    resetProducts,
  }
}
