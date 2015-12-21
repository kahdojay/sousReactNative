import { generateId } from '../utilities/utils'
import {
  RESET_ORDERS,
  RECEIVE_ORDERS,
  UPDATE_ORDER,
} from './actionTypes'

export default function OrderActions(ddpClient) {

  function resetOrders(){
    return {
      type: RESET_ORDERS
    }
  }

  function updateOrder(orderId, orderAttributes) {
    return {
      type: UPDATE_ORDER,
      order: order
    }
  }

  function receiveOrders(order) {
    return {
      type: RECEIVE_ORDERS,
      order: order
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
