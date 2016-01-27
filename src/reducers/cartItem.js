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
      cartItems: {},
    };
  }

  // organize the cart by purveyorId, and orders by orderId
  let originalTeamOrder = {}
  if(newCartItemTeamState[cartItem.teamId][cartItemGroup].hasOwnProperty(cartItemLocator) === true){
    originalTeamOrder = newCartItemTeamState[cartItem.teamId][cartItemGroup][cartItemLocator]
  }
  newCartItemTeamState[cartItem.teamId][cartItemGroup][cartItemLocator] = originalTeamOrder

  let originalTeamCartItem = {}
  if(newCartItemTeamState[cartItem.teamId].cartItems.hasOwnProperty(cartItem.id) === true){
    originalTeamCartItem = Object.assign({}, newCartItemTeamState[cartItem.teamId].cartItems[cartItem.id])
  }
  newCartItemTeamState[cartItem.teamId].cartItems[cartItem.id] = Object.assign(originalTeamCartItem, cartItem)


  if(cartItem.status === 'DELETED'){
    if(newCartItemTeamState[cartItem.teamId][cartItemGroup][cartItemLocator].hasOwnProperty(cartItemId) === true){
      delete newCartItemTeamState[cartItem.teamId][cartItemGroup][cartItemLocator][cartItemId]
    }
  } else {
    newCartItemTeamState[cartItem.teamId][cartItemGroup][cartItemLocator][cartItemId] = true
  }

  return newCartItemTeamState
}

function cartItems(state = initialState.cartItems, action) {
  // console.log(action, state.teams)
  switch (action.type) {
  case ORDER_SENT:
    let orderSentCartItemTeamState = Object.assign({}, state.teams);
    if(orderSentCartItemTeamState.hasOwnProperty(action.teamId) === true){
      Object.keys(action.orderPkg).forEach((purveyorId) => {
        if(orderSentCartItemTeamState[action.teamId].cart.hasOwnProperty(purveyorId) === true){
          const orderId = action.orderPkg[purveyorId]
          const purveyorCartItems = Object.assign({}, orderSentCartItemTeamState[action.teamId].cart[purveyorId])
          orderSentCartItemTeamState[action.teamId].orders[orderId] = purveyorCartItems
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

    const cartPurveyorIds = Object.keys(newReceivedTeamsCartItemsState[action.cartItem.teamId]['cart'])
    cartPurveyorIds.forEach((purveyorId) => {
      if(Object.keys(newReceivedTeamsCartItemsState[action.cartItem.teamId]['cart'][purveyorId]).length === 0){
        delete newReceivedTeamsCartItemsState[action.cartItem.teamId]['cart'][purveyorId]
      }
    })

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
