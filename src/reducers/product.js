import _ from 'lodash';
import {
  RESET_PRODUCTS,
  GET_PRODUCTS,
  REQUEST_PRODUCTS,
  RECEIVE_PRODUCTS,
  ERROR_PRODUCTS,
  ADD_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
} from '../actions';

const initialState = {
  products: {
    errors: null,
    teams: {},
    purveyors: {},
    productTeamMapping: {},
    isFetching: false,
    lastUpdated: null
  }
};

function getTeamProduct(productTeamState, teamId, productId) {
  let originalTeamProduct = null
  if(productTeamState.hasOwnProperty(teamId) === true){
    originalTeamProduct = {}
    if(productTeamState[teamId].hasOwnProperty(productId) === true){
      originalTeamProduct = Object.assign({}, productTeamState[teamId][productId])
    }
  }
  return originalTeamProduct
}

function products(state = initialState.products, action) {
  switch (action.type) {
  // reset the products
  case RESET_PRODUCTS:
    let resetProductState = Object.assign({}, initialState.products);
    if(action.hasOwnProperty('teamId') === true && action.teamId !== null){
      resetProductState = Object.assign({}, state);
      if(resetProductState.teams.hasOwnProperty(action.teamId) === true){
        delete resetProductState.teams[action.teamId];
      }
    }
    return resetProductState;

  case GET_PRODUCTS:
    return Object.assign({}, state, {
      isFetching: action.isFetching,
      lastUpdated: (new Date()).toISOString(),
    });

  // request the products
  case REQUEST_PRODUCTS:
    return Object.assign({}, state, {
      errors: null,
    });

  // receive the products
  case RECEIVE_PRODUCTS:
    let newProductTeamState = Object.assign({}, state.teams);
    if(newProductTeamState.hasOwnProperty(action.product.teamId) === false){
      newProductTeamState[action.product.teamId] = {};
    }

    let productTeamMappingState = Object.assign({}, state.productTeamMapping);
    if(action.product.hasOwnProperty('teamId') === true){
      productTeamMappingState[action.product.id] = action.product.teamId;
    } else if(productTeamMappingState.hasOwnProperty(action.product.id) === true){
      action.product.teamId = productTeamMappingState[action.product.id];
    }

    const originalTeamProduct = getTeamProduct(newProductTeamState, action.product.teamId, action.product.id)

    let originalNewTeamProductPurveyors = []
    if(originalTeamProduct.hasOwnProperty('purveyors') === true){
      originalNewTeamProductPurveyors = Object.assign([], originalTeamProduct.purveyors)
    }

    newProductTeamState[action.product.teamId][action.product.id] = Object.assign({}, originalTeamProduct, action.product)

    const reducedProduct = newProductTeamState[action.product.teamId][action.product.id]
    let newProductPurveyorsState = Object.assign({}, state.purveyors);
    if(reducedProduct.hasOwnProperty('purveyors') === true){
      reducedProduct.purveyors.forEach((purveyorId) => {
        if(newProductPurveyorsState.hasOwnProperty(purveyorId) === false){
          newProductPurveyorsState[purveyorId] = {}
        }
        if(newProductPurveyorsState[purveyorId].hasOwnProperty(reducedProduct.id) === false){
          newProductPurveyorsState[purveyorId][reducedProduct.id] = true
        }
      });
      const newPurveyorChanges = _.difference(originalNewTeamProductPurveyors, newProductTeamState[action.product.teamId][action.product.id].purveyors);
      if(newPurveyorChanges.length > 0){
        newPurveyorChanges.forEach((purveyorId) => {
          if(newProductPurveyorsState.hasOwnProperty(purveyorId) === true){
            if(newProductPurveyorsState[purveyorId].hasOwnProperty(reducedProduct.id) === true){
              delete newProductPurveyorsState[purveyorId][reducedProduct.id]
            }
          }
        });
      }
    }

    return Object.assign({}, state, {
      errors: null,
      teams: newProductTeamState,
      purveyors: newProductPurveyorsState,
      productTeamMapping: productTeamMappingState,
      lastUpdated: (new Date()).toISOString()
    });

  // delete the product
  case DELETE_PRODUCT:
    var deleteProductTeamState = Object.assign({}, state.teams);
    const deleteOriginalTeamProduct = getTeamProduct(deleteProductTeamState, action.teamId, action.productId)
    if(deleteOriginalTeamProduct !== null){
      deleteProductTeamState[action.teamId][action.productId].deleted = true
      deleteProductTeamState[action.teamId][action.productId].updatedAt = (new Date()).toISOString()
    }
    return Object.assign({}, state, {
      errors: null,
      teams: deleteProductTeamState,
      lastUpdated: (new Date()).toISOString(),
    });

  // add product
  case ADD_PRODUCT:
    var addProductTeamState = Object.assign({}, state.teams);
    const addOriginalTeamProduct = {} //getTeamProduct(addProductTeamState, action.teamId, action.productId)
    addProductTeamState[action.teamId][action.productId] = Object.assign(addOriginalTeamProduct, action.product, {
      updatedAt: (new Date()).toISOString()
    })
    // console.log(addProductTeamState[action.teamId][action.productId]);
    return Object.assign({}, state, {
      errors: null,
      teams: addProductTeamState,
      lastUpdated: (new Date()).toISOString()
    });

  // update product
  case UPDATE_PRODUCT:
    var updateProductTeamState = Object.assign({}, state.teams);
    const updateOriginalTeamProduct = getTeamProduct(updateProductTeamState, action.teamId, action.productId)

    let originalUpdateTeamProductPurveyors = []
    if(updateOriginalTeamProduct.hasOwnProperty('purveyors') === true){
      originalUpdateTeamProductPurveyors = Object.assign([], updateOriginalTeamProduct.purveyors)
    }

    updateProductTeamState[action.teamId][action.productId] = Object.assign(updateOriginalTeamProduct, action.product, {
      updatedAt: (new Date()).toISOString()
    })

    const updateReducedProduct = updateProductTeamState[action.teamId][action.productId]
    let updateProductPurveyorsState = Object.assign({}, state.purveyors);
    if(updateReducedProduct.hasOwnProperty('purveyors') === true){
      updateReducedProduct.purveyors.forEach((purveyorId) => {
        if(updateProductPurveyorsState.hasOwnProperty(purveyorId) === false){
          updateProductPurveyorsState[purveyorId] = {}
        }
        if(updateProductPurveyorsState[purveyorId].hasOwnProperty(updateReducedProduct.id) === false){
          updateProductPurveyorsState[purveyorId][updateReducedProduct.id] = true
        }
      });
      const updatePurveyorChanges = _.difference(originalUpdateTeamProductPurveyors, updateProductTeamState[action.teamId][action.productId].purveyors);
      if(updatePurveyorChanges.length > 0){
        updatePurveyorChanges.forEach((purveyorId) => {
          if(updateProductPurveyorsState.hasOwnProperty(purveyorId) === true){
            if(updateProductPurveyorsState[purveyorId].hasOwnProperty(updateReducedProduct.id) === true){
              delete updateProductPurveyorsState[purveyorId][updateReducedProduct.id]
            }
          }
        });
      }
    }

    return Object.assign({}, state, {
      errors: null,
      teams: updateProductTeamState,
      purveyors: updateProductPurveyorsState,
      lastUpdated: (new Date()).toISOString()
    });

  // everything else
  default:
    return state;
  }
}

const productReducers = {
  'products': products
}

export default productReducers
