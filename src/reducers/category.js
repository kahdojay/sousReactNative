import _ from 'lodash';
import {
  RESET_CATEGORIES,
  GET_CATEGORIES,
  REQUEST_CATEGORIES,
  RECEIVE_CATEGORIES,
  ERROR_CATEGORIES,
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  ADD_PRODUCT_CATEGORY,
  REMOVE_PRODUCT_CATEGORY,
} from '../actions';

const initialState = {
  categories: {
    errors: null,
    teams: {},
    lastUpdated: null
  }
};

function categories(state = initialState.categories, action) {
  // console.log(action.type)
  switch (action.type) {
  // reset the categories
  case RESET_CATEGORIES:
    let resetCategoryState = Object.assign({}, initialState.categories);
    if(action.hasOwnProperty('teamId') === true && action.teamId !== null){
      resetCategoryState = Object.assign({}, state);
      if(resetCategoryState.teams.hasOwnProperty(action.teamId) === true){
        delete resetCategoryState.teams[action.teamId];
      }
    }
    return resetCategoryState;

  // request the categories
  case REQUEST_CATEGORIES:
    return Object.assign({}, state, {
      errors: null,
    });

  // receive the categories
  case RECEIVE_CATEGORIES:
    const newCategoryTeamState = Object.assign({}, state.teams);
    if(newCategoryTeamState.hasOwnProperty(action.category.teamId) === false){
      newCategoryTeamState[action.category.teamId] = {};
    }
    let originalTeamCategory = {}
    if(newCategoryTeamState[action.category.teamId].hasOwnProperty(action.category.id)){
      originalTeamCategory = newCategoryTeamState[action.category.teamId][action.category.id]
    }
    newCategoryTeamState[action.category.teamId][action.category.id] = Object.assign(originalTeamCategory, action.category)
    return Object.assign({}, state, {
      errors: null,
      teams: newCategoryTeamState,
      lastUpdated: (new Date()).toISOString()
    });

  // add category
  case ADD_CATEGORY:
    const addCategoryTeamState = Object.assign({}, state.teams);
    if(addCategoryTeamState.hasOwnProperty(action.category.teamId) === false){
      addCategoryTeamState[action.category.teamId] = {};
    }
    let originalTeamAddCategory = {}
    if(addCategoryTeamState[action.category.teamId].hasOwnProperty(action.category.id)){
      originalTeamAddCategory = addCategoryTeamState[action.category.teamId][action.category.id]
    }
    addCategoryTeamState[action.category.teamId][action.category.id] = Object.assign(originalTeamAddCategory, action.category)
    return Object.assign({}, state, {
      errors: null,
      teams: addCategoryTeamState,
      lastUpdated: (new Date()).toISOString()
    });

  // update category
  case UPDATE_CATEGORY:
    const updateCategoryTeamState = Object.assign({}, state.teams);
    if(updateCategoryTeamState.hasOwnProperty(action.category.teamId) === false){
      updateCategoryTeamState[action.category.teamId] = {};
    }
    let originalTeamUpdateCategory = {}
    if(updateCategoryTeamState[action.category.teamId].hasOwnProperty(action.category.id)){
      originalTeamUpdateCategory = updateCategoryTeamState[action.category.teamId][action.category.id]
    }
    updateCategoryTeamState[action.category.teamId][action.category.id] = Object.assign(originalTeamUpdateCategory, action.category)
    return Object.assign({}, state, {
      errors: null,
      teams: updateCategoryTeamState,
      lastUpdated: (new Date()).toISOString()
    });

  // add product to categories
  case ADD_PRODUCT_CATEGORY:
    const newCategoryTeamProductsState = Object.assign({}, state.teams);
    if(newCategoryTeamProductsState.hasOwnProperty(action.teamId) === true){
      // console.log(newCategoryTeamProductsState[action.teamId])
      if(newCategoryTeamProductsState[action.teamId].hasOwnProperty(action.categoryId)){
        // console.log(action)
        // console.log(newCategoryTeamProductsState[action.teamId][action.categoryId].products)
        newCategoryTeamProductsState[action.teamId][action.categoryId].products.push(action.productId)
        // console.log(newCategoryTeamProductsState[action.teamId][action.categoryId].products)
      }
    }
    return Object.assign({}, state, {
      errors: null,
      teams: newCategoryTeamProductsState,
      lastUpdated: (new Date()).toISOString()
    });

  case REMOVE_PRODUCT_CATEGORY:
    const removeCategoryTeamProductsState = Object.assign({}, state.teams);
    if(removeCategoryTeamProductsState.hasOwnProperty(action.teamId) === true){
      if(removeCategoryTeamProductsState[action.teamId].hasOwnProperty(action.categoryId)){
        const removeProductIdx = removeCategoryTeamProductsState[action.teamId][action.categoryId].products.indexOf(action.productId)
        if(removeProductIdx !== -1){
          const removeCategoryProducts = _.filter(removeCategoryTeamProductsState[action.teamId][action.categoryId].products, (productId) => {
            return productId !== action.productId
          })
          removeCategoryTeamProductsState[action.teamId][action.categoryId].products = removeCategoryProducts
        }
      }
    }
    return Object.assign({}, state, {
      errors: null,
      teams: removeCategoryTeamProductsState,
      lastUpdated: (new Date()).toISOString()
    });

  case DELETE_CATEGORY:
    const deleteCategoryTeamState = Object.assign({}, state.teams);
    if(deleteCategoryTeamState.hasOwnProperty(action.category.teamId) === false){
      deleteCategoryTeamState[action.category.teamId] = {};
    }
    let originalTeamDeleteCategory = {}
    if(deleteCategoryTeamState[action.category.teamId].hasOwnProperty(action.category.id)){
      originalTeamDeleteCategory = deleteCategoryTeamState[action.category.teamId][action.category.id]
    }
    deleteCategoryTeamState[action.category.teamId][action.category.id] = Object.assign(originalTeamDeleteCategory, action.category)
    return Object.assign({}, state, {
      errors: null,
      teams: deleteCategoryTeamState,
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
