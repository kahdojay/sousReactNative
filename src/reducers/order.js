import {
  RESET_ORDERS,
  GET_ORDERS,
  RECEIVE_ORDERS,
  UPDATE_ORDER,
} from '../actions';

const initialState = {
  orders: {
    errors: null,
    teams: {},
    isFetching: false,
    lastUpdated: null
  }
};

function getTeamOrder(orderTeamState, teamId, orderId) {
  let originalTeamOrder = null
  if(orderTeamState.hasOwnProperty(teamId) !== false){
    originalTeamOrder = {}
    if(orderTeamState[teamId].hasOwnProperty(orderId)){
      originalTeamOrder = orderTeamState[teamId][orderId]
    }
  }
  return originalTeamOrder
}

function orders(state = initialState.orders, action) {
  switch (action.type) {
  // reset the orders
  case RESET_ORDERS:
    let resetOrderState = Object.assign({}, initialState.orders);
    if(action.hasOwnProperty('teamId') === true && action.teamId !== null){
      resetOrderState = Object.assign({}, state);
      if(resetOrderState.teams.hasOwnProperty(action.teamId) === true){
        delete resetOrderState.teams[action.teamId];
      }
    }
    return resetOrderState;

  case GET_ORDERS:
    return Object.assign({}, state, {
      isFetching: action.isFetching,
      lastUpdated: (new Date()).toISOString(),
    });

  // receive the orders
  case RECEIVE_ORDERS:
    var newOrderTeamState = Object.assign({}, state.teams);
    if(newOrderTeamState.hasOwnProperty(action.order.teamId) === false){
      newOrderTeamState[action.order.teamId] = {};
    }
    const originalTeamOrder = getTeamOrder(newOrderTeamState, action.order.teamId, action.order.id)
    // console.log('PRE RECEIVE_ORDERS ', originalTeamOrder.confirm)
    newOrderTeamState[action.order.teamId][action.order.id] = Object.assign({}, originalTeamOrder, action.order)
    // console.log('RECEIVE_ORDERS ', newOrderTeamState[action.order.teamId][action.order.id].confirm)
    return Object.assign({}, state, {
      errors: null,
      teams: newOrderTeamState,
      lastUpdated: (new Date()).toISOString(),
    });

  // update order
  case UPDATE_ORDER:
    var updateOrderTeamState = Object.assign({}, state.teams);
    const updateOriginalTeamOrder = getTeamOrder(updateOrderTeamState, action.teamId, action.orderId)
    updateOrderTeamState[action.teamId][action.orderId] = Object.assign({}, updateOriginalTeamOrder, action.order, {
      updatedAt: (new Date()).toISOString()
    })
    // console.log('UPDATE_ORDER ', updateOrderTeamState[action.order.teamId][action.orderId].confirm)
    return Object.assign({}, state, {
      errors: null,
      teams: updateOrderTeamState,
      lastUpdated: (new Date()).toISOString(),
    });

  // everything else
  default:
    return state;
  }
}

const orderReducers = {
  'orders': orders
}

export default orderReducers
