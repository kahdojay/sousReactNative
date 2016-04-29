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
    cartItemActions,
  } = allActions

  function resetProducts(teamId = null){
    return {
      teamId: teamId,
      type: RESET_PRODUCTS
    }
  }

  // This will go away post minimongo refactor
  // function addCategory(categoryAttributes) {
  //   return (dispatch, getState) => {
  //     const { session, teams } = getState();
  //     const { currentTeam } = teams;
  //     const categoryId = generateId()
  //     var newCategoryAttributes = {
  //       _id: categoryId,
  //       teamid: session.teamId,
  //       teamCode: currentTeam.teamCode,
  //       name: categoryAttributes.name,
  //     }
  //     dispatch({
  //       type: ADD_CATEGORY,
  //       teamid: currentTeam.id,
  //       categoryId: categoryId,
  //       category: Object.assign({}, newCategoryAttributes, {
  //         id: categoryId,
  //       })
  //     })
  //   }
  // }

  function addProduct(productAttributes) {
    return (dispatch, getState) => {
      const { session, teams } = getState();
      const sessionTeamId = session.teamId
      const { currentTeam } = teams;
      const productId = generateId()
      var newProductAttributes = {
        _id: productId,
        teamId: sessionTeamId,
        teamCode: currentTeam.teamCode,
        name: productAttributes.name,
        description: productAttributes.description || '',
        packSize: productAttributes.packSize,
        par: productAttributes.par,
        price: productAttributes.price || '',
        purveyors: productAttributes.purveyors,
        amount: productAttributes.amount,
        sku: productAttributes.sku,
        unit: productAttributes.unit,
        deleted: false,
      }

      dispatch({
        type: ADD_PRODUCT,
        teamId: currentTeam.id,
        productId: productId,
        product: Object.assign({}, newProductAttributes, {
          id: productId,
        }),
      });

      dispatch(connectActions.ddpCall('createProduct', [Object.assign({}, newProductAttributes)]))

      return dispatch(categoryActions.addProductCategory(productAttributes.categoryId, productId))
    }
  }

  function updateProduct(productId, productAttributes){
    return (dispatch, getState) => {
      const { cartItems, session, teams } = getState();
      const { currentTeam } = teams;

      if(productAttributes.previousCategoryId !== productAttributes.categoryId){
        dispatch(categoryActions.updateProductCategory(
          productAttributes.previousCategoryId,
          productAttributes.categoryId,
          productId
        ))
      }

      dispatch({
        type: UPDATE_PRODUCT,
        teamId: currentTeam.id,
        productId: productId,
        product: productAttributes
      })

      dispatch(connectActions.ddpCall('updateProduct', [productId, productAttributes, session.userId]))

      if(cartItems.teams.hasOwnProperty(session.teamId) === true){
        const cartPurveyorIds = Object.keys(cartItems.teams[session.teamId].cart)
        if(cartPurveyorIds.length > 0){
          const allowOptimisticUpdates = true
          productAttributes.purveyors.forEach(function(purveyorId) {
            if(cartPurveyorIds.indexOf(purveyorId) !== -1 && cartItems.teams[session.teamId].cart[purveyorId].hasOwnProperty(productId) === true){
              const cartItemId = cartItems.teams[session.teamId].cart[purveyorId][productId]
              const updatedCartItem = Object.assign({}, cartItems.items[cartItemId], {
                productName: productAttributes.name
              })
              dispatch(cartItemActions.updateCartItem(updatedCartItem, allowOptimisticUpdates))
            }
          })
        }
      }
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
    // console.log('Getting products for: ', productsTeamId)
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
