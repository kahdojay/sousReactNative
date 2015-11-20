import { getIdx, updateByIdx, updateDataState } from '../utilities/reducer'
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
    let originalTeamProduct = {}
    if(newProductTeamState[action.product.teamId].hasOwnProperty(action.product.id)){
      originalTeamProduct = newProductTeamState[action.product.teamId][action.product.id] = newProductTeamState[action.product.teamId][action.product.id]
    }
    newProductTeamState[action.product.teamId][action.product.id] = Object.assign(originalTeamProduct, action.product)
    return Object.assign({}, state, {
      errors: null,
      teams: newProductTeamState,
      lastUpdated: (new Date()).toISOString()
    });

  // // delete the product
  // case DELETE_PRODUCT:
  //   var newProductState = Object.assign({}, state);
  //   var productIdx = getIdx(newProductState.data, action.productId);
  //   var currentProductsDataState = updateByIdx(newProductState.data, productIdx, { deleted: true });
  //   return Object.assign({}, state, {
  //     data: currentProductsDataState,
  //     lastUpdated: (new Date()).toISOString()
  //   });
  //
  // // add product
  // case ADD_PRODUCT:
  //   var newProductState = Object.assign({}, state);
  //   var currentProductsDataState = updateDataState(newProductState.data, action.product)
  //   // console.log(action.type, action.product.id)
  //   return Object.assign({}, state, {
  //     data: currentProductsDataState,
  //     lastUpdated: (new Date()).toISOString()
  //   });
  //
  // // update product
  // case UPDATE_PRODUCT:
  //   // action {
  //   //   productId
  //   //   product
  //   //   ------- OR -------
  //   //   productId
  //   //   productId
  //   //   product
  //   // }
  //
  //   var newProductState = Object.assign({}, state);
  //   var currentProductsDataState = newProductState.data;
  //   // if product passed in, then assume we are only updating the product attributes
  //   if (action.hasOwnProperty('product')) {
  //     currentProductsDataState = updateDataState(newProductState.data, action.product);
  //   }
  //   // if productId and product passed in, then assume we are updating a specific product
  //   else if(action.hasOwnProperty('productId') && action.hasOwnProperty('product')){
  //     var productIdx = getIdx(newProductState.data, action.productId);
  //     // console.log(action.type, action.productId);
  //     var productIdx = getIdx(newProductState.data[productIdx].products, action.productId);
  //     var currentProductsDataState = updateByIdx(newProductState.data[productIdx].products, productIdx, action.product);
  //     currentProductsDataState = updateByIdx(newProductState.data, productIdx, {
  //       products: currentProductsDataState
  //     });
  //   }
  //
  //   return Object.assign({}, state, {
  //     data: currentProductsDataState,
  //     lastUpdated: (new Date()).toISOString()
  //   });

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
