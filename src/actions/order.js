import { generateId } from '../utilities/utils';
import moment from 'moment';
import {
  RESET_ORDERS,
  GET_ORDERS,
  RECEIVE_ORDERS,
  UPDATE_ORDER,
} from './actionTypes'

export default function OrderActions(allActions){

  const {
    connectActions,
    cartItemActions,
  } = allActions

  function resetOrders(teamId = null){
    return {
      teamId: teamId,
      type: RESET_ORDERS,
    }
  }

  function updateOrderInvoices(orderId, orderAttributes) {
    return (dispatch, getState) => {
      const {session, orders} = getState()
      if(orderAttributes.hasOwnProperty('invoiceImages') === true){
        let invoiceImages = []
        let invoices = []
        if(
          orders.teams.hasOwnProperty(session.teamId) === true
          && orders.teams[session.teamId].hasOwnProperty(orderId) === true
          && orders.teams[session.teamId][orderId].hasOwnProperty('invoices') === true
        ){
          invoices = orders.teams[session.teamId][orderId].invoices
        }
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
        orderAttributes.updatedAt = (new Date()).toISOString()
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
        order: order,
      })
    }
  }

  function getOrders(orderIds) {
    return (dispatch, getState) => {
      const {session} = getState()
      const getOrdersCb = (err, result) => {
        dispatch({
          type: GET_ORDERS,
          isFetching: false,
        })
        // console.log('called function, result: ', result);
        if(result.length > 0){
          result.forEach((order) => {
            order.id = order._id
            delete order._id
            dispatch(receiveOrders(order));
          })
        }
      }
      dispatch(cartItemActions.getTeamOrderItems(session.teamId, orderIds))
      dispatch(connectActions.ddpCall('getOrders', [session.teamId, orderIds], getOrdersCb))
      return dispatch({
        type: GET_ORDERS,
        isFetching: true,
      })
    }
  }

  function getTeamOrders(teamId, beforeOrderedAtDate) {
    return (dispatch, getState) => {
      const {session} = getState()
      const getOrdersCb = (err, result) => {
        dispatch({
          type: GET_ORDERS,
          isFetching: false,
        })
        // console.log('called function, result: ', result);
        if(result.length > 0){
          let orderIds = []
          result.forEach((order) => {
            order.id = order._id
            delete order._id
            orderIds.push(order.id)
            dispatch(receiveOrders(order))
          })
          dispatch(cartItemActions.getTeamOrderItems(teamId, orderIds))
        }
      }
      dispatch(connectActions.ddpCall('getTeamOrders', [teamId, beforeOrderedAtDate], getOrdersCb))
      return dispatch({
        type: GET_ORDERS,
        isFetching: true,
      })
    }
  }

  function getMoreTeamOrders(orderTeamId) {
    return (dispatch, getState) => {
      const {session, orders} = getState()
      let teamId = session.teamId
      let beforeOrderedAtDate = (new Date()).toISOString()
      if(orderTeamId){
        teamId = orderTeamId
      }

      const teamOrders = orders.teams[teamId] || {}
      let orderKeys = Object.keys(teamOrders)
      if(orderKeys.length > 0){
        orderKeys.sort((a, b) => {
          return moment(teamOrders[a].orderedAt).isBefore(teamOrders[b].orderedAt) ? 1 : -1;
        })
        beforeOrderedAtDate = teamOrders[orderKeys[orderKeys.length - 1]].orderedAt;
      }

      return dispatch(getTeamOrders(teamId, beforeOrderedAtDate))
    }
  }

  return {
    RESET_ORDERS,
    GET_ORDERS,
    RECEIVE_ORDERS,
    UPDATE_ORDER,
    getOrders,
    getMoreTeamOrders,
    getTeamOrders,
    resetOrders,
    receiveOrders,
    updateOrder,
    updateOrderInvoices,
  }
}
