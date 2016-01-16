import { cleanupAttributes } from '../utilities/reducer'
import {
  ADD_CART_ITEM,
  DELETE_CART_ITEM,
  NO_CART_ITEMS,
  ORDER_SENT,
  RECEIVE_CART_ITEM,
  REQUEST_CART_ITEMS,
  RESET_CART_ITEMS,
} from '../actions';

const initialState = {
  cartItems: {
    errors: null,
    isFetching: false,
    teams: {},
    lastUpdated: null
  }
};

function processCartItem(newCartItemTeamState, cartItem, cartItemIdRef){
  cartItem = cleanupAttributes(cartItem)
  let cartItemLocator = cartItem.purveyorId
  let cartItemGroup = 'cart'
  let cartItemId = cartItem.productId
  if(cartItem.orderId !== null){
    cartItemLocator = cartItem.orderId
    cartItemGroup = 'orders'
    cartItemId = cartItem.id
  }
  if(newCartItemTeamState.hasOwnProperty(cartItem.teamId) === false){
    newCartItemTeamState[cartItem.teamId] = {
      cart: {},
      orders: {},
    };
  }
  let originalTeamOrder = {}
  if(newCartItemTeamState[cartItem.teamId][cartItemGroup].hasOwnProperty(cartItemLocator) === true){
    originalTeamOrder = newCartItemTeamState[cartItem.teamId][cartItemGroup][cartItemLocator]
  }
  newCartItemTeamState[cartItem.teamId][cartItemGroup][cartItemLocator] = originalTeamOrder

  let originalTeamCartItem = {}
  if(
    cartItem.orderId !== null &&
    newCartItemTeamState[cartItem.teamId]['cart'].hasOwnProperty(cartItem.purveyorId) === true &&
    newCartItemTeamState[cartItem.teamId]['cart'][cartItem.purveyorId].hasOwnProperty(cartItem.productId) === true
  ){
    originalTeamCartItem = Object.assign({}, newCartItemTeamState[cartItem.teamId]['cart'][cartItem.purveyorId][cartItem.productId])
    delete newCartItemTeamState[cartItem.teamId]['cart'][cartItem.purveyorId][cartItem.productId]
    if(Object.keys(newCartItemTeamState[cartItem.teamId]['cart'][cartItem.purveyorId]).length === 0){
      delete newCartItemTeamState[cartItem.teamId]['cart'][cartItem.purveyorId]
    }
  } else if(newCartItemTeamState[cartItem.teamId][cartItemGroup][cartItemLocator].hasOwnProperty(cartItemId) === true){
    originalTeamCartItem = newCartItemTeamState[cartItem.teamId][cartItemGroup][cartItemLocator][cartItemId]
  }
  newCartItemTeamState[cartItem.teamId][cartItemGroup][cartItemLocator][cartItemId] = Object.assign(originalTeamCartItem, cartItem)
  return newCartItemTeamState
}

function cartItems(state = initialState.cartItems, action) {
  switch (action.type) {
  case ORDER_SENT:
    let orderSentCartItemTeamState = Object.assign({}, state.teams);
    if(orderSentCartItemTeamState.hasOwnProperty(action.teamId) === true){
      action.purveyorIds.forEach((purveyorId) => {
        if(orderSentCartItemTeamState[action.teamId].cart.hasOwnProperty(purveyorId) === true){
          delete orderSentCartItemTeamState[action.teamId].cart[purveyorId]
        }
      })
    }
    return Object.assign({}, state, {
      teams: orderSentCartItemTeamState,
      isFetching: false,
      errors: null,
      lastUpdated: (new Date()).toISOString(),
    });

  // reset the cartItems
  case RESET_CART_ITEMS:
    let resetCartItemState = Object.assign({}, initialState.cartItems);
    if(action.hasOwnProperty('teamId') === true && action.teamId !== null){
      resetCartItemState = Object.assign({}, state);
      if(resetCartItemState.teams.hasOwnProperty(action.teamId) === true){
        delete resetCartItemState.teams[action.teamId];
      }
    }
    return resetCartItemState;

  case REQUEST_CART_ITEMS:
    return Object.assign({}, state, {
      isFetching: true,
      errors: null,
      lastUpdated: (new Date()).toISOString(),
    });

  case RECEIVE_CART_ITEM:
    const newReceivedTeamsCartItemsState = processCartItem(Object.assign({}, state.teams), action.cartItem, action.cartItem.id);
    return Object.assign({}, state, {
      teams: newReceivedTeamsCartItemsState,
      isFetching: false,
      errors: null,
      lastUpdated: (new Date()).toISOString(),
    });

  case ADD_CART_ITEM:
    const newCreatedTeamsCartItemsState = processCartItem(Object.assign({}, state.teams), action.cartItem, action.cartItemId);
    return Object.assign({}, state, {
      teams: newCreatedTeamsCartItemsState,
      isFetching: false,
      errors: null,
      lastUpdated: (new Date()).toISOString(),
    });

  case DELETE_CART_ITEM:
    const newDeletedTeamsCartItemsState = Object.assign({}, state.teams);
    if(newDeletedTeamsCartItemsState.hasOwnProperty(action.teamId) === true){
      if(newDeletedTeamsCartItemsState[action.teamId]['cart'].hasOwnProperty(action.cartItem.purveyorId) === true){
        if(newDeletedTeamsCartItemsState[action.teamId]['cart'][action.cartItem.purveyorId].hasOwnProperty(action.cartItem.productId) === true){
          delete newDeletedTeamsCartItemsState[action.teamId]['cart'][action.cartItem.purveyorId][action.cartItem.productId]
        }
        if(Object.keys(newDeletedTeamsCartItemsState[action.teamId]['cart'][action.cartItem.purveyorId]).length === 0){
          delete newDeletedTeamsCartItemsState[action.teamId]['cart'][action.cartItem.purveyorId]
        }
      }
    }
    return Object.assign({}, state, {
      teams: newDeletedTeamsCartItemsState,
      isFetching: false,
      errors: null,
      lastUpdated: (new Date()).toISOString(),
    });

  case NO_CART_ITEMS:
  default:
    return state;
  }
}

const cartItemReducers = {
  'cartItems': cartItems
}

export default cartItemReducers
