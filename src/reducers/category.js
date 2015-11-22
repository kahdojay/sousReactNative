import { getIdx, updateByIdx, updateDataState } from '../utilities/reducer'
import {
  RESET_CATEGORIES,
  GET_CATEGORIES,
  REQUEST_CATEGORIES,
  RECEIVE_CATEGORIES,
  ERROR_CATEGORIES,
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
} from '../actions';

const initialState = {
  categories: {
    errors: null,
    teams: {},
    lastUpdated: null
  }
};

function categories(state = initialState.categories, action) {
  switch (action.type) {
  // reset the categories
  case RESET_CATEGORIES:
    return Object.assign({}, initialState.categories);
  // request the categories
  case REQUEST_CATEGORIES:
    return Object.assign({}, state, {
      errors: null,
    });

  // receive the categories
  case RECEIVE_CATEGORIES:
    var newCategoryTeamState = Object.assign({}, state.teams);
    if(newCategoryTeamState.hasOwnProperty(action.category.teamId) === false){
      newCategoryTeamState[action.category.teamId] = {};
    }
    let originalTeamCategory = {}
    if(newCategoryTeamState[action.category.teamId].hasOwnProperty(action.category.id)){
      originalTeamCategory = newCategoryTeamState[action.category.teamId][action.category.id] = newCategoryTeamState[action.category.teamId][action.category.id]
    }
    newCategoryTeamState[action.category.teamId][action.category.id] = Object.assign(originalTeamCategory, action.category)
    return Object.assign({}, state, {
      errors: null,
      teams: newCategoryTeamState,
      lastUpdated: (new Date()).toISOString()
    });

  // everything else
  case GET_CATEGORIES:
  default:
    return state;
  }
}

const categoryReducers = {
  'categories': categories
}

export default categoryReducers
