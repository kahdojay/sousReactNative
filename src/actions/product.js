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

  function resetProducts(teamId = null){
    return {
      teamId: teamId,
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

      const productId = newProductAttributes._id

      dispatch({
        type: ADD_PRODUCT,
        teamId: currentTeam.id,
        productId: productId,
        product: newProductAttributes,
      });

      dispatch(connectActions.ddpCall('createProduct', [newProductAttributes]))

      return dispatch(categoryActions.addProductCategory(productAttributes.categoryId,productId))
    }
  }

  function updateProduct(productId, productAttributes){
    return (dispatch, getState) => {
      const {session, teams } = getState();
      const { currentTeam } = teams;

      dispatch(categoryActions.updateProductCategory(productAttributes.previousCategoryId, productAttributes.categoryId,productId))

      dispatch({
        type: UPDATE_PRODUCT,
        teamId: currentTeam.id,
        productId: productId,
        product: productAttributes
      })

      return dispatch(connectActions.ddpCall('updateProduct', [productId, productAttributes, session.userId]))
    }
  }

  function deleteProduct(productId) {
    return (dispatch, getState) => {
      const {session, teams} = getState();
      const { currentTeam } = teams;
      const productAttributes = {deleted: true};
      dispatch(connectActions.ddpCall('updateProduct', [productId, productAttributes, session.userId]))
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
      product: product,
    }
  }

  function getProducts(productsTeamId) {
    return (dispatch, getState) => {
      const {session} = getState();
      let teamId = session.teamId
      if(productsTeamId) {
        teamId = productsTeamId
      }

      const getProductsCb = (err, result) => {
        dispatch({
          type: GET_PRODUCTS,
          isFetching: false,
        })
        // console.log('called function, result: ', result);
        if(result.length > 0){
          result.forEach((product) => {
            product.id = product._id
            delete product._id
            dispatch(receiveProducts(product));
          })
        }
      }
      dispatch(connectActions.ddpCall('getProducts', [teamId], getProductsCb))
      return dispatch({
        type: GET_PRODUCTS,
        isFetching: true,
      })
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
    getProducts,
    deleteProduct,
    receiveProducts,
    resetProducts,
    updateProduct,
  }
}
