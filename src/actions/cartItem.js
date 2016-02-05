import { generateId } from '../utilities/utils';
import {
  CART,
  ORDER_SENT,
  RESET_CART_ITEMS,
  RECEIVE_CART_ITEM,
  REQUEST_CART_ITEMS,
  NO_CART_ITEMS,
  ADD_CART_ITEM,
  DELETE_CART_ITEM,
} from './actionTypes';

export default function CartItemActions(allActions) {
  const {
    connectActions,
  } = allActions

  function noCartItemsReceived() {
    return {
      type: NO_CART_ITEMS
    }
  }

  function resetCartItems(teamId = null) {
    return (dispatch) => {
      return dispatch({
        teamId: teamId,
        type: RESET_CART_ITEMS,
      })
    }
  }

  function addCartItem(cartItemAttributes) {
    return (dispatch, getState) => {
      const {session} = getState()
      const cartItemId = generateId()
      cartItemAttributes._id = cartItemId
      cartItemAttributes.userId = session.userId
      cartItemAttributes.teamId = session.teamId
      cartItemAttributes.status = 'NEW'
      cartItemAttributes.orderId = null
      cartItemAttributes.createdAt = (new Date()).toISOString()
      cartItemAttributes.updatedAt = (new Date()).toISOString()

      dispatch(connectActions.ddpCall('addCartItem', [session.userId, session.teamId, cartItemAttributes]))
      return dispatch({
        type: ADD_CART_ITEM,
        cartItemId: cartItemId,
        cartItem: cartItemAttributes,
      })
    }
  }

  function updateCartItem(cartItem) {
    return (dispatch, getState) => {
      const {session} = getState()
      dispatch(connectActions.ddpCall('updateCartItem', [session.userId, session.teamId, cartItem.id, cartItem]))
      return dispatch(receiveCartItems(cartItem))
    }
  }

  function deleteCartItem(cartItem) {
    return (dispatch, getState) => {
      const {session} = getState()
      dispatch(connectActions.ddpCall('deleteCartItem', [session.userId, session.teamId, cartItem.id]))
      return dispatch({
        type: DELETE_CART_ITEM,
        teamId: session.teamId,
        cartItem: cartItem,
      })
    }
  }

  function receiveCartItems(cartItem) {
    return (dispatch) => {
      return dispatch({
        type: RECEIVE_CART_ITEM,
        cartItem: cartItem
      })
    }
  }

  function getTeamOrderItems(teamId, orderIds) {
    return (dispatch, getState) => {
      const {session} = getState()
      const getTeamOrderItemsCb = (err, result) => {
        // console.log('called function, result: ', result);
        if(result.length > 0){
          result.forEach((cartItem) => {
            cartItem.id = cartItem._id
            delete cartItem._id
            dispatch(receiveCartItems(cartItem))
          })
        } else {
          dispatch(noCartItemsReceived())
        }
      }
      dispatch(connectActions.ddpCall('getTeamOrderItems', [teamId, orderIds], getTeamOrderItemsCb))
      return dispatch({
        type: REQUEST_CART_ITEMS,
      })
    }
  }

  function getTeamCartItems(teamId) {
    return (dispatch, getState) => {
      const {session} = getState()
      const getTeamCartItemsCb = (err, result) => {
        // console.log('called function, result: ', result);
        if(result.length > 0){
          result.forEach((cartItem) => {
            cartItem.id = cartItem._id
            delete cartItem._id
            dispatch(receiveCartItems(cartItem))
          })
        } else {
          dispatch(noCartItemsReceived())
        }
      }
      dispatch(connectActions.ddpCall('getTeamCartItems', [teamId], getTeamCartItemsCb))
      return dispatch({
        type: REQUEST_CART_ITEMS,
      })
    }
  }

  function sendCart(purveyorIds) {
    return (dispatch, getState) => {
      const {session} = getState()
      let orderPkg = {}
      purveyorIds.forEach((purveyorId) => {
        orderPkg[purveyorId] = generateId()
      })
      dispatch(connectActions.ddpCall('sendCartItems', [session.userId, session.teamId, orderPkg]))
      return dispatch({
        type: ORDER_SENT,
        teamId: session.teamId,
        orderPkg: orderPkg,
      })
    }
  }


  return {
    ADD_CART_ITEM,
    CART,
    DELETE_CART_ITEM,
    NO_CART_ITEMS,
    ORDER_SENT,
    RECEIVE_CART_ITEM,
    REQUEST_CART_ITEMS,
    RESET_CART_ITEMS,
    addCartItem,
    deleteCartItem,
    getTeamCartItems,
    getTeamOrderItems,
    receiveCartItems,
    resetCartItems,
    sendCart,
    updateCartItem,
  }
}
