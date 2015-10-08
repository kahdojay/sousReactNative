import {
  RESET_PURVEYORS,
  GET_PURVEYORS,
  REQUEST_PURVEYORS,
  RECEIVE_PURVEYORS,
  ERROR_PURVEYORS,
  ADD_PURVEYOR,
  DELETE_PURVEYOR
} from '../actions';

const initialState = {
  purveyors: {
    data: {},
  }
};

function purveyors(state = initialState.purveyors, action) {
  switch (action.type) {
  case RESET_PURVEYORS:
    return Object.assign({}, initialState.purveyors);
  case REQUEST_PURVEYORS:
    return Object.assign({}, state, {
      isFetching: true,
      errors: null,
    });
  case RECEIVE_PURVEYORS:
    return Object.assign({}, state, {
      isFetching: false,
      errors: null,
      data: Object.assign({}, action.purveyors),
      lastUpdated: (new Date()).getTime()
    });
  case ADD_PURVEYOR:
    console.log('reducer: add purveyor:', state, action)
    return Object.assign({}, state, {
      data: Object.assign({}, state.data, action.purveyor)
    });
  case DELETE_PURVEYOR:
    let newPurveyorState = Object.assign({}, state);
    newPurveyorState.data[action.purveyorKey].deleted = true;
    return newPurveyorState;
  case GET_PURVEYORS:
  default:
    return state;
  }
}

const purveyorReducers = {
  'purveyors': purveyors
}

export default purveyorReducers
