import * as ActionTypes from '../actions/actionTypes'
import _ from 'lodash'


const whitelist = [
  ActionTypes.SIGN_IN,
  ActionTypes.REGISTER_INSTALLATION,
  ActionTypes.REGISTER_SESSION,
  ActionTypes.ADD_TEAM,
  ActionTypes.LEAVE_TEAM,
  ActionTypes.CART.ADD_TO_CART,
  ActionTypes.CART.DELETE_FROM_CART,
  ActionTypes.CREATE_MESSAGE,
  ActionTypes.CREATE_ERROR,
  ActionTypes.RECEIVE_ERRORS,
  ActionTypes.ERROR_MESSAGES,
  ActionTypes.ORDER_SENT,
  ActionTypes.ADD_PRODUCT,
  ActionTypes.UPDATE_PRODUCT,
  ActionTypes.DELETE_PRODUCT,
]

// define a blacklist to be used in the ignoreAction filter
const blacklist = []
_.each(Object.keys(ActionTypes), function(type){
  const actionType = ActionTypes[type]
  if(typeof(actionType) === 'object'){
    _.each(Object.keys(actionType), function(subType){
      if(whitelist.indexOf(subType) === -1){
        blacklist.push(subType)
      }
    })
  } else {
    if(whitelist.indexOf(type) === -1){
      blacklist.push(type)
    }
  }
})

blacklist.push('persist/REHYDRATE')
blacklist.push('persist/COMPLETE')

export default blacklist
