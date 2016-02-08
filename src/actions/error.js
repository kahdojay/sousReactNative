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

  // function createError(errorText) {
  //   console.log('errorText', errorText)
  //   return (dispatch, getState) => {
  //     var newError = {
  //       _id: generateId(),
  //       error: errorText,
  //       createdAt: (new Date()).getTime(),
  //     };
  //     console.log('newError', newError);
  //     dispatch(connectActions.ddpCall('createError', [newError]))
  //     return dispatch({
  //       type: CREATE_ERROR,
  //       error: Object.assign({}, newError)
  //     });
  //   }
  // }

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
    // createError,
    deleteErrors,
    resetErrors,
    receiveErrors
  }
}
