import { cleanupAttributes } from '../utilities/reducer'
import {
  RESET_CART_ITEMS,
  RECEIVE_CART_ITEM,
  REQUEST_CART_ITEMS,
  NO_CART_ITEMS,
  ADD_CART_ITEM,
  UPDATE_CART_ITEM,
  DELETE_CART_ITEM,
} from '../actions';

const initialState = {
  cartItems: {
    errors: null,
    isFetching: false,
    teams: {},
    lastUpdated: null
  }
};

function processCartItem(newCartItemTeamState, cartItem, cartItemId){
  cartItem = cleanupAttributes(cartItem)
  let cartItemLocator = cartItem.purveyorId
  if(cartItem.orderId !== null){
    cartItemLocator = cartItem.orderId
  }
  if(newCartItemTeamState.hasOwnProperty(cartItem.teamId) === false){
    newCartItemTeamState[cartItem.teamId] = {};
  }
  let originalTeamOrder = {}
  if(newCartItemTeamState[cartItem.teamId].hasOwnProperty(cartItemLocator) === true){
    originalTeamOrder = newCartItemTeamState[cartItem.teamId][cartItemLocator]
  }
  newCartItemTeamState[cartItem.teamId][cartItemLocator] = originalTeamOrder

  let originalTeamCartItem = {}
  if(newCartItemTeamState[cartItem.teamId][cartItemLocator].hasOwnProperty(cartItemId) === true){
    originalTeamCartItem = newCartItemTeamState[cartItem.teamId][cartItemLocator][cartItemId]
  }
  newCartItemTeamState[cartItem.teamId][cartItemLocator][cartItemId] = Object.assign(originalTeamCartItem, cartItem)
  return newCartItemTeamState
}

function cartItems(state = initialState.cartItems, action) {
  switch (action.type) {
  // reset the cartItems
  case RESET_CART_ITEMS:
    return Object.assign({}, initialState.cartItems);

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

  case UPDATE_CART_ITEM:
    const newUpdateTeamsCartItemsState = processCartItem(Object.assign({}, state.teams), action.cartItem, ation.cartItem.id);
    return Object.assign({}, state, {
      teams: newUpdateTeamsCartItemsState,
      isFetching: false,
      errors: null,
      lastUpdated: (new Date()).toISOString(),
    });

  case DELETE_CART_ITEM:
    const newDeletedTeamsCartItemsState = Object.assign({}, state.teams);
    if(newDeletedTeamsCartItemsState.hasOwnProperty(action.teamId) === true){
      if(newDeletedTeamsCartItemsState[action.teamId].hasOwnProperty(action.cartItem.purveyorId) === true){
        if(newDeletedTeamsCartItemsState[action.teamId][action.cartItem.purveyorId].hasOwnProperty(action.cartItem.id) === true){
          delete newDeletedTeamsCartItemsState[action.teamId][action.cartItem.purveyorId][action.cartItem.id]
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
