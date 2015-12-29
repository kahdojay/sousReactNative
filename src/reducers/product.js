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
    lastUpdated: null
  }
};

function getTeamProduct(productTeamState, teamId, productId) {
  let originalTeamProduct = null
  if(productTeamState.hasOwnProperty(teamId) !== false){
    originalTeamProduct = {}
    if(productTeamState[teamId].hasOwnProperty(productId)){
      originalTeamProduct = productTeamState[teamId][productId]
    }
  }
  return originalTeamProduct
}

function products(state = initialState.products, action) {
  switch (action.type) {
  // reset the products
  case RESET_PRODUCTS:
    return Object.assign({}, initialState.products);
  // request the products
  case REQUEST_PRODUCTS:
    return Object.assign({}, state, {
      errors: null,
    });

  // receive the products
  case RECEIVE_PRODUCTS:
    var newProductTeamState = Object.assign({}, state.teams);
    if(newProductTeamState.hasOwnProperty(action.product.teamId) === false){
      newProductTeamState[action.product.teamId] = {};
    }
    const originalTeamProduct = getTeamProduct(newProductTeamState, action.product.teamId, action.product.id)
    newProductTeamState[action.product.teamId][action.product.id] = Object.assign(originalTeamProduct, action.product)
    return Object.assign({}, state, {
      errors: null,
      teams: newProductTeamState,
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
      lastUpdated: (new Date()).toISOString()
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
    updateProductTeamState[action.teamId][action.productId] = Object.assign(updateOriginalTeamProduct, action.product, {
      updatedAt: (new Date()).toISOString()
    })
    return Object.assign({}, state, {
      errors: null,
      teams: updateProductTeamState,
      lastUpdated: (new Date()).toISOString()
    });

  // everything else
  case GET_PRODUCTS:
  default:
    return state;
  }
}

const productReducers = {
  'products': products
}

export default productReducers
