import { updateDataState } from '../utilities/reducer'
import {
  RESET_ERRORS,
  RECEIVE_ERRORS,
  CREATE_ERROR,
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
    var currentErrorsDataState = updateDataState(newErrorState.data, action.error)
    return Object.assign({}, state, {
      data: newErrorState,
      lastUpdated: (new Date()).getTime()
    });

  // create error
  case CREATE_ERROR:
    var newErrorState = Object.assign({}, state);
    var currentErrorsDataState = updateDataState(newErrorState.data, action.error)
    // console.log(action.type, action.error.id)
    return Object.assign({}, state, {
      data: newErrorState,
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