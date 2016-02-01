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

  function resetOrders(teamId = null){
    return {
      teamId: teamId,
      type: RESET_ORDERS,
    }
  }

  function updateOrderInvoices(orderId, orderAttributes) {
    return (dispatch, getState) => {
      const {session} = getState()
      if(orderAttributes.hasOwnProperty('invoiceImages') === true){
        let invoiceImages = []
        let invoices = []
        _.each(orderAttributes.invoiceImages, (source, idx) => {
          const invoiceId = generateId()
          const invoiceUri = source.uri
          invoiceImages.push({
            id: invoiceId,
            orderId: orderId,
            userId: session.userId,
            type: "image/jpeg",
            name: `invoices/${session.teamId}/OrderId-${orderId}-InvoiceId-${invoiceId}.jpeg`,
            data: source.data,
            createdAt: (new Date()).toISOString(),
          })
          invoices.push({
            id: invoiceId,
            userId: session.userId,
            imageUrl: invoiceUri,
            location: 'local',
            updatedAt: (new Date()).toISOString(),
          })
        })

        const ddpCallArguments = [
          orderId,
          invoiceImages,
          session.userId
        ]
        dispatch(connectActions.ddpCall('streamS3InvoiceImages', ddpCallArguments))
        delete orderAttributes.invoiceImages
        orderAttributes.invoices = invoices
      }
      return dispatch({
        type: UPDATE_ORDER,
        teamId: session.teamId,
        orderId: orderId,
        order: orderAttributes
      })
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
    updateOrderInvoices,
  }
}
