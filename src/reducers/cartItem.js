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
    items: {},
    lastUpdated: null
  }
};

function processCartItem(newCartItemState, cartItem, cartItemIdRef){
  cartItem = cleanupAttributes(cartItem)
  let originalTeamCartItem = {}
  if(newCartItemState.hasOwnProperty(cartItem.id) === true){
    originalTeamCartItem = newCartItemState[cartItem.id]
    // console.log('originalTeamCartItem: ', originalTeamCartItem)
  }
  newCartItemState[cartItem.id] = Object.assign({}, originalTeamCartItem, cartItem)

  return newCartItemState
}

function processCartAndOrders(newCartItemState, newCartItemTeamState, cartItemIdRef){
  const cartItem = newCartItemState[cartItemIdRef]
  // console.log('cartItem: ', cartItem.teamId, cartItem.productId);
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

  // organize the cart by purveyorId, and orders by orderId
  if(newCartItemTeamState[cartItem.teamId][cartItemGroup].hasOwnProperty(cartItemLocator) === false){
    newCartItemTeamState[cartItem.teamId][cartItemGroup][cartItemLocator] = {}
  }

  if(cartItem.status === 'DELETED'){
    if(newCartItemTeamState[cartItem.teamId]['cart'].hasOwnProperty(cartItem.purveyorId) === true){
      // console.log('DELETING: ', cartItem, newCartItemTeamState[cartItem.teamId]['cart'][cartItem.purveyorId])
      if(
        newCartItemTeamState[cartItem.teamId]['cart'][cartItem.purveyorId].hasOwnProperty(cartItem.productId) === true
        && newCartItemTeamState[cartItem.teamId]['cart'][cartItem.purveyorId][cartItem.productId] === cartItem.id
      ){
        // console.log('Deleting from cart...')
        delete newCartItemTeamState[cartItem.teamId]['cart'][cartItem.purveyorId][cartItem.productId]
      }
    }
    if(
      cartItem.orderId !== null
      && newCartItemTeamState[cartItem.teamId]['orders'].hasOwnProperty(cartItem.orderId) === true
    ){
      if(newCartItemTeamState[cartItem.teamId]['orders'][cartItem.orderId].hasOwnProperty(cartItem.id) === true){
        // console.log('Deleting from order...')
        delete newCartItemTeamState[cartItem.teamId]['orders'][cartItem.orderId][cartItem.id]
      }
    }
  } else {
    // console.log(cartItem.id, cartItemGroup, cartItemLocator, cartItemId)
    newCartItemTeamState[cartItem.teamId][cartItemGroup][cartItemLocator][cartItemId] = cartItem.id
    // console.log('updated...')
  }

  return newCartItemTeamState
}

function cartItems(state = initialState.cartItems, action) {
  // console.log(action, state.teams)
  switch (action.type) {
  case ORDER_SENT:
    let orderSentCartItemState = Object.assign({}, state.items)
    let orderSentCartItemTeamState = Object.assign({}, state.teams)
    if(orderSentCartItemTeamState.hasOwnProperty(action.teamId) === true){
      Object.keys(action.orderPkg).forEach((purveyorId) => {
        if(orderSentCartItemTeamState[action.teamId].cart.hasOwnProperty(purveyorId) === true){
          const orderId = action.orderPkg[purveyorId]
          const purveyorCartItems = Object.assign({}, orderSentCartItemTeamState[action.teamId].cart[purveyorId])
          orderSentCartItemTeamState[action.teamId].orders[orderId] = {}
          Object.keys(purveyorCartItems).forEach((productId) => {
            const cartItemId = purveyorCartItems[productId]
            orderSentCartItemState[cartItemId].status = 'ORDERED'
            orderSentCartItemTeamState[action.teamId].orders[orderId][cartItemId] = cartItemId
          })
          delete orderSentCartItemTeamState[action.teamId].cart[purveyorId]
        }
      })
    }
    return Object.assign({}, state, {
      items: orderSentCartItemState,
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
    const newReceivedCartItemsState = processCartItem(Object.assign({}, state.items), action.cartItem, action.cartItem.id)
    const newReceivedTeamsCartItemsState = processCartAndOrders(newReceivedCartItemsState, Object.assign({}, state.teams), action.cartItem.id)

    const cartItem = newReceivedCartItemsState[action.cartItem.id]
    const cartPurveyorIds = Object.keys(newReceivedTeamsCartItemsState[cartItem.teamId]['cart'])
    cartPurveyorIds.forEach((purveyorId) => {
      if(Object.keys(newReceivedTeamsCartItemsState[cartItem.teamId]['cart'][purveyorId]).length === 0){
        delete newReceivedTeamsCartItemsState[cartItem.teamId]['cart'][purveyorId]
      }
    })

    return Object.assign({}, state, {
      items: newReceivedCartItemsState,
      teams: newReceivedTeamsCartItemsState,
      isFetching: false,
      errors: null,
      lastUpdated: (new Date()).toISOString(),
    });

  case ADD_CART_ITEM:
    const newCreatedCartItemsState = processCartItem(Object.assign({}, state.items), action.cartItem, action.cartItemId)
    const newCreatedTeamsCartItemsState = processCartAndOrders(newCreatedCartItemsState, Object.assign({}, state.teams), action.cartItemId);
    return Object.assign({}, state, {
      items: newCreatedCartItemsState,
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
      items: state.items,
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
