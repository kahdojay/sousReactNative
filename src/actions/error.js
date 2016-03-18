import { generateId } from '../utilities/utils'
import {
  RESET_ERRORS,
  RECEIVE_ERRORS,
  CREATE_ERROR,
  DELETE_ERRORS
} from './actionTypes'

export default function ErrorActions(allActions){

  const {
    connectActions,
  } = allActions

  function resetErrors(teamId = null){
    return {
      teamId: teamId,
      type: RESET_ERRORS,
    }
  }

  function createError(machineKey, msg, data) {
    return (dispatch, getState) => {
      const {session} = getState()
      const errorId = generateId()
      var newError = {
        _id: errorId,
        userId: session.userId,
        machineKey: machineKey,
        message: msg,
        author: 'Sous',
        imageUrl: 'https://sous-assets-production.s3.amazonaws.com/uploads/89b217dc-4ec5-43e8-9569-8fc85e6fdd52/New+Sous+Logo+Circle+Small.png',
        createdAt: (new Date()).toISOString(),
      }

      dispatch({
        type: CREATE_ERROR,
        errorId: errorId,
        error: Object.assign({}, newError, {
          id: errorId,
        })
      })
      dispatch(connectActions.ddpCall('triggerError', [machineKey, msg, session.userId, errorId, data]))
    }
  }

  function receiveErrors(error) {
    return {
      type: RECEIVE_ERRORS,
      error: error
    }
  }

  function deleteErrors(errorIdList) {
    return (dispatch) => {
      dispatch(connectActions.ddpCall('deleteErrors', [errorIdList]))
      return dispatch({
        type: DELETE_ERRORS,
        errorIdList: errorIdList
      })
    }
  }

  return {
    RESET_ERRORS,
    RECEIVE_ERRORS,
    CREATE_ERROR,
    DELETE_ERRORS,
    createError,
    deleteErrors,
    resetErrors,
    receiveErrors
  }
}
