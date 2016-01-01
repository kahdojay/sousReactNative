import { cleanupAttributes } from '../utilities/reducer'
import {
  RESET_CART_ITEMS,
  RECEIVE_CART_ITEM,
  REQUEST_CART_ITEMS,
  NO_CART_ITEMS,
  ADD_CART_ITEM,
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
  let cartItemGroup = 'cart'
  if(cartItem.orderId !== null){
    cartItemLocator = cartItem.orderId
    cartItemGroup = 'orders'
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
  if(newCartItemTeamState[cartItem.teamId][cartItemGroup][cartItemLocator].hasOwnProperty(cartItemId) === true){
    originalTeamCartItem = newCartItemTeamState[cartItem.teamId][cartItemGroup][cartItemLocator][cartItemId]
  } else if(
    cartItem.orderId !== null &&
    newCartItemTeamState[cartItem.teamId]['cart'].hasOwnProperty(cartItem.purveyorId) === true &&
    newCartItemTeamState[cartItem.teamId]['cart'][cartItem.purveyorId].hasOwnProperty(cartItemId) === true
  ){
    originalTeamCartItem = newCartItemTeamState[cartItem.teamId]['cart'][cartItem.purveyorId][cartItemId]
    delete newCartItemTeamState[cartItem.teamId]['cart'][cartItem.purveyorId][cartItemId]
  }
  newCartItemTeamState[cartItem.teamId][cartItemGroup][cartItemLocator][cartItemId] = Object.assign(originalTeamCartItem, cartItem)
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

  case DELETE_CART_ITEM:
    const newDeletedTeamsCartItemsState = Object.assign({}, state.teams);
    if(newDeletedTeamsCartItemsState.hasOwnProperty(action.teamId) === true){
      if(newDeletedTeamsCartItemsState[action.teamId]['cart'].hasOwnProperty(action.cartItem.purveyorId) === true){
        if(newDeletedTeamsCartItemsState[action.teamId]['cart'][action.cartItem.purveyorId].hasOwnProperty(action.cartItem.id) === true){
          delete newDeletedTeamsCartItemsState[action.teamId]['cart'][action.cartItem.purveyorId][action.cartItem.id]
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
