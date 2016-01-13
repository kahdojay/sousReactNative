import { generateId } from '../utilities/utils';
import {
  CART,
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

  function getTeamCartItems() {
    return (dispatch, getState) => {
      const {session} = getState()
      const getTeamCartItemsCallback = (err, result) => {
        // console.log('called function, result: ', result);
        if(result.length > 0){
          result.forEach((cartItem) => {
            cartItem.id = cartItem._id
            delete cartItem._id
            dispatch(receiveCartItems(cartItem));
          })
        } else {
          dispatch(noCartItemsReceived())
        }
      }
      dispatch(connectActions.ddpCall('getTeamCartItems', [session.teamId], getTeamCartItemsCallback))
      return dispatch({
        type: REQUEST_CART_ITEMS,
      })
    }
  }


  return {
    CART,
    RESET_CART_ITEMS,
    RECEIVE_CART_ITEM,
    REQUEST_CART_ITEMS,
    NO_CART_ITEMS,
    ADD_CART_ITEM,
    DELETE_CART_ITEM,
    addCartItem,
    updateCartItem,
    deleteCartItem,
    resetCartItems,
    receiveCartItems,
    getTeamCartItems,
  }
}
