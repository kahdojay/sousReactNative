import { getIdx, updateByIdx, updateDataState } from '../utilities/reducer'
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
    errors: null,
    teams: {},
    lastUpdated: null
  }
};

function purveyors(state = initialState.purveyors, action) {
  switch (action.type) {
  // reset the purveyors
  case RESET_PURVEYORS:
    let resetPurveyorState = Object.assign({}, initialState.purveyors);
    if(action.hasOwnProperty('teamId') === true && action.teamId !== null){
      resetPurveyorState = Object.assign({}, state);
      if(resetPurveyorState.teams.hasOwnProperty(action.teamId) === true){
        delete resetPurveyorState.teams[action.teamId];
      }
    }
    return resetPurveyorState;

  // request the purveyors
  case REQUEST_PURVEYORS:
    return Object.assign({}, state, {

      errors: null,
    });

  // receive the purveyors
  case RECEIVE_PURVEYORS:
    var newPurveyorTeamState = Object.assign({}, state.teams);
    if(newPurveyorTeamState.hasOwnProperty(action.purveyor.teamId) === false){
      newPurveyorTeamState[action.purveyor.teamId] = {};
    }
    let originalTeamPurveyor = {}
    if(newPurveyorTeamState[action.purveyor.teamId].hasOwnProperty(action.purveyor.id)){
      originalTeamPurveyor = newPurveyorTeamState[action.purveyor.teamId][action.purveyor.id] = newPurveyorTeamState[action.purveyor.teamId][action.purveyor.id]
    }
    newPurveyorTeamState[action.purveyor.teamId][action.purveyor.id] = Object.assign(originalTeamPurveyor, action.purveyor)
    // console.log(action.purveyor)
    return Object.assign({}, state, {
      errors: null,
      teams: newPurveyorTeamState,
      lastUpdated: (new Date()).toISOString()
    });

  // add purveyor
  case ADD_PURVEYOR:
    var addPurveyorTeamState = Object.assign({}, state.teams);
    if(addPurveyorTeamState.hasOwnProperty(action.purveyor.teamId) === false){
      addPurveyorTeamState[action.purveyor.teamId] = {};
    }
    let originalTeamAddPurveyor = {}
    if(addPurveyorTeamState[action.purveyor.teamId].hasOwnProperty(action.purveyor.id)){
      originalTeamAddPurveyor = addPurveyorTeamState[action.purveyor.teamId][action.purveyor.id] = addPurveyorTeamState[action.purveyor.teamId][action.purveyor.id]
    }
    addPurveyorTeamState[action.purveyor.teamId][action.purveyor.id] = Object.assign(originalTeamAddPurveyor, action.purveyor)
    // console.log(action.purveyor)
    return Object.assign({}, state, {
      errors: null,
      teams: addPurveyorTeamState,
      lastUpdated: (new Date()).toISOString()
    });

  // everything else
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
