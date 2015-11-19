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
    return Object.assign({}, initialState.purveyors);
  // request the purveyors
  case REQUEST_PURVEYORS:
    return Object.assign({}, state, {

      errors: null,
    });

  // receive the purveyors
  case RECEIVE_PURVEYORS:
    var newPurveyorState = Object.assign({}, state);
    if(newPurveyorState.teams.hasOwnProperty(action.purveyor.teamId) === false){
      newPurveyorState.teams[action.purveyor.teamId] = {};
    }
    var currentPurveyorsDataState = updateDataState(newPurveyorState.teams[action.purveyor.teamId], action.purveyor)
    var currentTeamsDataState = Object.assign({}, teams);
    currentTeamsDataState[action.purveyor.teamId] = currentPurveyorsDataState
    return Object.assign({}, state, {
      errors: null,
      teams: currentTeamsDataState,
      lastUpdated: (new Date()).toISOString()
    });

  // // delete the purveyor
  // case DELETE_PURVEYOR:
  //   var newPurveyorState = Object.assign({}, state);
  //   var purveyorIdx = getIdx(newPurveyorState.data, action.purveyorId);
  //   var currentPurveyorsDataState = updateByIdx(newPurveyorState.data, purveyorIdx, { deleted: true });
  //   return Object.assign({}, state, {
  //     data: currentPurveyorsDataState,
  //     lastUpdated: (new Date()).toISOString()
  //   });
  //
  // // add purveyor
  // case ADD_PURVEYOR:
  //   var newPurveyorState = Object.assign({}, state);
  //   var currentPurveyorsDataState = updateDataState(newPurveyorState.data, action.purveyor)
  //   // console.log(action.type, action.purveyor.id)
  //   return Object.assign({}, state, {
  //     data: currentPurveyorsDataState,
  //     lastUpdated: (new Date()).toISOString()
  //   });
  //
  // // update purveyor
  // case UPDATE_PURVEYOR:
  //   // action {
  //   //   purveyorId
  //   //   purveyor
  //   //   ------- OR -------
  //   //   purveyorId
  //   //   productId
  //   //   product
  //   // }
  //
  //   var newPurveyorState = Object.assign({}, state);
  //   var currentPurveyorsDataState = newPurveyorState.data;
  //   // if purveyor passed in, then assume we are only updating the purveyor attributes
  //   if (action.hasOwnProperty('purveyor')) {
  //     currentPurveyorsDataState = updateDataState(newPurveyorState.data, action.purveyor);
  //   }
  //   // if productId and product passed in, then assume we are updating a specific product
  //   else if(action.hasOwnProperty('productId') && action.hasOwnProperty('product')){
  //     var purveyorIdx = getIdx(newPurveyorState.data, action.purveyorId);
  //     // console.log(action.type, action.productId);
  //     var productIdx = getIdx(newPurveyorState.data[purveyorIdx].products, action.productId);
  //     var currentProductsDataState = updateByIdx(newPurveyorState.data[purveyorIdx].products, productIdx, action.product);
  //     currentPurveyorsDataState = updateByIdx(newPurveyorState.data, purveyorIdx, {
  //       products: currentProductsDataState
  //     });
  //   }
  //
  //   return Object.assign({}, state, {
  //     data: currentPurveyorsDataState,
  //     lastUpdated: (new Date()).toISOString()
  //   });

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
