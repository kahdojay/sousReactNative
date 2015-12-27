import { generateId } from '../utilities/utils'
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

export default function ProductActions(allActions){

  const {
    connectActions,
    categoryActions,
  } = allActions

  function resetProducts(){
    return {
      type: RESET_PRODUCTS
    }
  }

  function addProduct(productAttributes) {
    return (dispatch, getState) => {
      const { session, teams } = getState();
      const { currentTeam } = teams;
      var newProductAttributes = {
        _id: generateId(),
        teamId: session.teamId,
        teamCode: currentTeam.teamCode,
        name: productAttributes.name,
        description: productAttributes.description || '',
        price: productAttributes.price || '',
        purveyors: productAttributes.purveyors,
        amount: productAttributes.amount,
        unit: productAttributes.unit,
        deleted: false,
      }

      dispatch(() => {
        connectActions.ddpCall('createProduct', [newProductAttributes]);
      })
      dispatch({
        type: ADD_PRODUCT,
        teamId: currentTeam.id,
        product: newProductAttributes,
      });

      return dispatch(categoryActions.addProductToCategory(productAttributes.categoryId,newProductAttributes._id))
    }
  }

  function updateProduct(productId, productAttributes){
    return (dispatch, getState) => {
      const {session, teams } = getState();
      const { currentTeam } = teams;
      dispatch(() => {
        connectActions.ddpCall('updateProduct', [productId, productAttributes, session.userId]);
      })
      return dispatch({
        type: UPDATE_PRODUCT,
        teamId: currentTeam.id,
        productId: productId,
        product: productAttributes
      })
    }
  }

  function deleteProduct(productId) {
    return (dispatch, getState) => {
      const {session, teams } = getState();
      const { currentTeam } = teams;
      const productAttributes = {deleted: true};
      dispatch(() => {
        connectActions.ddpCall('updateProduct', [productId, productAttributes, session.userId])
      })
      return dispatch({
        type: DELETE_PRODUCT,
        teamId: currentTeam.id,
        productId: productId,
        product: productAttributes
      })
    }
  }

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
    addProduct,
    updateProduct,
    deleteProduct,
    receiveProducts,
    resetProducts,
  }
}
