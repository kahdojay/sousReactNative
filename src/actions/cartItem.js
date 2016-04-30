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
    errorActions,
  } = allActions
  let verifyCartAttempt = 0

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

  function addCartItem(cartItemAttributes, allowOptimisticUpdates = false) {
    return (dispatch, getState) => {
      const {session} = getState()
      const cartItemId = generateId()

      const sessionTeamId = session.teamId
      cartItemAttributes._id = cartItemId
      cartItemAttributes.userId = session.userId
      cartItemAttributes.teamId = sessionTeamId
      cartItemAttributes.status = 'NEW'
      cartItemAttributes.orderId = null
      cartItemAttributes.createdAt = (new Date()).toISOString()
      cartItemAttributes.updatedAt = (new Date()).toISOString()

      if(
        cartItemAttributes.purveyorId
        && cartItemAttributes.productId
      ){
        if(allowOptimisticUpdates === true){
          dispatch({
            type: ADD_CART_ITEM,
            cartItemId: cartItemId,
            cartItem: Object.assign({}, cartItemAttributes, {
              id: cartItemId,
            }),
          })
        }
        dispatch(connectActions.ddpCall('addCartItem', [session.userId, sessionTeamId, Object.assign({}, cartItemAttributes)]))
      } else {
        dispatch(errorActions.createError('add-cart-item', 'Please check product details and try again', Object.assign({}, cartItemAttributes)))
      }
    }
  }

  function updateCartItem(cartItem, allowOptimisticUpdates = false) {
    return (dispatch, getState) => {
      const {session} = getState()
      const sessionTeamId = session.teamId
      if(allowOptimisticUpdates === true){
        dispatch(receiveCartItems(cartItem))
      }
      dispatch(connectActions.ddpCall('updateCartItem', [session.userId, sessionTeamId, cartItem.id, cartItem]))
    }
  }

  function deleteCartItem(cartItem, allowOptimisticUpdates = false) {
    return (dispatch, getState) => {
      const {session} = getState()
      const sessionTeamId = session.teamId
      if(allowOptimisticUpdates === true){
        dispatch({
          type: DELETE_CART_ITEM,
          teamId: sessionTeamId,
          cartItem: cartItem,
        })
      }
      dispatch(connectActions.ddpCall('deleteCartItem', [session.userId, sessionTeamId, cartItem.id]))
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

  function verifyCart(cartInfo) {
    return (dispatch, getState) => {
      const {session} = getState()
      const sessionTeamId = session.teamId
      let orderPkg = cartInfo
      if(cartInfo.hasOwnProperty('purveyorIds') === true){
        verifyCartAttempt = 0
        orderPkg = {}
        cartInfo.purveyorIds.forEach((purveyorId) => {
          let deliveryDate = null
          if(cartInfo.purveyorDeliveryDates.hasOwnProperty(purveyorId) === true){
            deliveryDate = cartInfo.purveyorDeliveryDates[purveyorId]
          }
          orderPkg[purveyorId] = {
            orderId: generateId(),
            cartItemIds: cartInfo.cartItemIds[purveyorId],
            deliveryDate: deliveryDate,
          }
        })
      }

      const verifyCartItemsCb = (err, results) => {
        // console.log('Verification results: ', results)
        if(results.verified === true){
          dispatch(sendCart(orderPkg))
        } else {
          verifyCartAttempt = verifyCartAttempt + 1
          dispatch(syncCart(orderPkg, results.missingCartItems))
        }
      }
      dispatch(connectActions.ddpCall('verifyCartItems', [session.userId, sessionTeamId, orderPkg], verifyCartItemsCb))
    }
  }

  function syncCart(orderPkg, missingCartItems) {
    return (dispatch, getState) => {
      const {session, cartItems} = getState()
      const sessionTeamId = session.teamId
      const syncPurveyorIds = Object.keys(missingCartItems)
      syncPurveyorIds.forEach(function(purveyorId) {
        const syncMissingCartItems = missingCartItems[purveyorId]
        syncMissingCartItems.forEach(function(cartItemId){
          const addCartItem = Object.assign({}, cartItems.items[cartItemId])
          addCartItem._id = cartItems.items[cartItemId].id
          delete addCartItem.id
          dispatch(connectActions.ddpCall('addCartItem', [session.userId, sessionTeamId, addCartItem]))
        })
      })
      // console.log('Processing attempt: ', verifyCartAttempt)
      if(verifyCartAttempt < 5){
        setTimeout(() => {
          dispatch(verifyCart(orderPkg))
        }, 1000)
      } else {
        dispatch(errorActions.createError('sync-cart-item', 'Internet Connection Error - please try submitting the order again.'))
      }
    }
  }

  function sendCart(orderPkg) {
    return (dispatch, getState) => {
      const {session, cartItems} = getState()
      const sessionTeamId = session.teamId
      dispatch(connectActions.ddpCall('sendCartItems', [session.userId, sessionTeamId, orderPkg]))
      return dispatch({
        type: ORDER_SENT,
        teamId: sessionTeamId,
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
    verifyCart,
    updateCartItem,
  }
}
