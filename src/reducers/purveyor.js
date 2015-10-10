import _ from 'lodash'
import {
  RESET_PURVEYORS,
  GET_PURVEYORS,
  REQUEST_PURVEYORS,
  RECEIVE_PURVEYORS,
  ERROR_PURVEYORS,
  ADD_PURVEYOR,
  UPDATE_PURVEYOR,
  DELETE_PURVEYOR,
  ORDER_PURVEYOR_PRODUCT
} from '../actions';

const initialState = {
  purveyors: {
    isFetching: false,
    errors: null,
    data: [],
    lastUpdated: null
  }
};

function purveyors(state = initialState.purveyors, action) {
  switch (action.type) {
  // reset the purveyors
  case RESET_PURVEYORS:
    return Object.assign({}, initialState.purveyors);
  // request the purveyors
  case REQUEST_PURVEYORS:
    return Object.assign({}, state, {
      isFetching: true,
      errors: null,
    });

  // receive the purveyors
  case RECEIVE_PURVEYORS:
    let purveyorsState = state.data;
    var purveyorIdx = _.findIndex(state.data, (purveyor, idx) => {
      return purveyor.id == action.purveyor.id;
    });
    if(purveyorIdx === -1){
      purveyorsState.push(action.purveyor);
    } else {
      purveyorsState = [
        ...purveyorsState.slice(0, purveyorIdx),
        Object.assign({}, purveyorsState[purveyorIdx], action.purveyor),
        ...purveyorsState.slice(purveyorIdx + 1)
      ]
    }
    // console.log('PURVEYOR REDUCER: ', purveyorsState)
    return Object.assign({}, state, {
      isFetching: false,
      errors: null,
      data: purveyorsState,
      lastUpdated: (new Date()).getTime()
    });

  // delete the purveyor
  case DELETE_PURVEYOR:
    let newPurveyorState = Object.assign({}, state);
    newPurveyorState.data.forEach((purveyor, index) => {
      if (purveyor.id == action.purveyorId) {
        newPurveyorState.data[index].deleted = true;
      }
    })
    return newPurveyorState;

  // everything else
  case ADD_PURVEYOR:
  case UPDATE_PURVEYOR:
  case GET_PURVEYORS:
  case ORDER_PURVEYOR_PRODUCT:
  default:
    return state;
  }
}

const purveyorReducers = {
  'purveyors': purveyors
}

export default purveyorReducers
