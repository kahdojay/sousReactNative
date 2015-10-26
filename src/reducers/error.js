import { getIdx, updateDataState } from '../utilities/reducer'
import {
  RESET_ERRORS,
  RECEIVE_ERRORS,
  CREATE_ERROR,
  DELETE_ERRORS
} from '../actions';

const initialState = {
  errors: {
    data: [],
    lastUpdated: null
  }
};

function errors(state = initialState.errors, action) {
  switch (action.type) {
  // reset the errors
  case RESET_ERRORS:
    return Object.assign({}, initialState.errors);

  // receive the errors
  case RECEIVE_ERRORS:
    var newErrorState = Object.assign({}, state);
    // console.log('receive errors', newErrorState)
    var currentErrorsDataState = updateDataState(newErrorState.data, action.error)
    return Object.assign({}, state, {
      data: currentErrorsDataState,
      lastUpdated: (new Date()).getTime()
    });

  // create error
  // case CREATE_ERROR:
  //   var newErrorState = Object.assign({}, state);
  //   var currentErrorsDataState = updateDataState(newErrorState.data, action.error)
  //   // console.log(action.type, action.error.id)
  //   return Object.assign({}, state, {
  //     data: currentErrorsDataState,
  //     lastUpdated: (new Date()).getTime()
  //   });

  // delete error
  case DELETE_ERRORS:
    var newErrorState = Object.assign({}, state);
    action.errorIdList.forEach(function(errorId) {
      // console.log('errorId: ', errorId)
      var errorIdx = getIdx(newErrorState.data, errorId);
      newErrorState.data = [
        ...newErrorState.data.slice(0, errorIdx),
        ...newErrorState.data.slice(errorIdx + 1)
      ]
      // delete newErrorState.data[errorIdx]
    })
    if (newErrorState.data === null)
        newErrorState.data = []
    return Object.assign({}, state, {
      data: newErrorState.data,
      lastUpdated: (new Date()).getTime()
    });

  // everything else
  default:
    return state;
  }
}

const errorReducers = {
  'errors': errors
}

export default errorReducers
