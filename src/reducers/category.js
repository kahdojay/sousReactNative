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
    var newCategoryState = Object.assign({}, state);
    if(newCategoryState.teams.hasOwnProperty(action.category.teamId) === false){
      newCategoryState.teams[action.category.teamId] = {};
    }
    var currentCategoriesDataState = updateDataState(newCategoryState.teams[action.category.teamId], action.category)
    var currentTeamsDataState = Object.assign({}, teams);
    currentTeamsDataState[action.category.teamId] = currentCategoriesDataState
    return Object.assign({}, state, {
      errors: null,
      teams: currentTeamsDataState,
      lastUpdated: (new Date()).toISOString()
    });

  // // delete the category
  // case DELETE_CATEGORY:
  //   var newCategoryState = Object.assign({}, state);
  //   var categoryIdx = getIdx(newCategoryState.data, action.categoryId);
  //   var currentCategoriesDataState = updateByIdx(newCategoryState.data, categoryIdx, { deleted: true });
  //   return Object.assign({}, state, {
  //     data: currentCategoriesDataState,
  //     lastUpdated: (new Date()).toISOString()
  //   });
  //
  // // add category
  // case ADD_CATEGORY:
  //   var newCategoryState = Object.assign({}, state);
  //   var currentCategoriesDataState = updateDataState(newCategoryState.data, action.category)
  //   // console.log(action.type, action.category.id)
  //   return Object.assign({}, state, {
  //     data: currentCategoriesDataState,
  //     lastUpdated: (new Date()).toISOString()
  //   });
  //
  // // update category
  // case UPDATE_CATEGORY:
  //   // action {
  //   //   categoryId
  //   //   category
  //   //   ------- OR -------
  //   //   categoryId
  //   //   categoryId
  //   //   category
  //   // }
  //
  //   var newCategoryState = Object.assign({}, state);
  //   var currentCategoriesDataState = newCategoryState.data;
  //   // if category passed in, then assume we are only updating the category attributes
  //   if (action.hasOwnProperty('category')) {
  //     currentCategoriesDataState = updateDataState(newCategoryState.data, action.category);
  //   }
  //   // if categoryId and category passed in, then assume we are updating a specific category
  //   else if(action.hasOwnProperty('categoryId') && action.hasOwnProperty('category')){
  //     var categoryIdx = getIdx(newCategoryState.data, action.categoryId);
  //     // console.log(action.type, action.categoryId);
  //     var categoryIdx = getIdx(newCategoryState.data[categoryIdx].categories, action.categoryId);
  //     var currentCategoriesDataState = updateByIdx(newCategoryState.data[categoryIdx].categories, categoryIdx, action.category);
  //     currentCategoriesDataState = updateByIdx(newCategoryState.data, categoryIdx, {
  //       categories: currentCategoriesDataState
  //     });
  //   }
  //
  //   return Object.assign({}, state, {
  //     data: currentCategoriesDataState,
  //     lastUpdated: (new Date()).toISOString()
  //   });

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
