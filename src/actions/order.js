import { generateId } from '../utilities/utils'
import {
  RESET_ORDERS,
  RECEIVE_ORDERS,
  UPDATE_ORDER,
} from './actionTypes'

export default function OrderActions(allActions){

  const {
    connectActions,
  } = allActions

  function resetOrders(){
    return {
      type: RESET_ORDERS
    }
  }

  function updateOrder(orderId, orderAttributes) {
    return (dispatch, getState) => {
      const {session} = getState()
      dispatch(connectActions.ddpCall('updateOrder', [session.userId, orderId, orderAttributes]))
      return dispatch({
        type: UPDATE_ORDER,
        teamId: session.teamId,
        orderId: orderId,
        order: orderAttributes
      })
    }
  }

  function receiveOrders(order) {
    return (dispatch) => {
      return dispatch({
        type: RECEIVE_ORDERS,
        order: order
      })
    }
  }

  return {
    RESET_ORDERS,
    RECEIVE_ORDERS,
    UPDATE_ORDER,
    resetOrders,
    receiveOrders,
    updateOrder,
  }
}
