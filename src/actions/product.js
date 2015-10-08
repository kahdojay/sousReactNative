import { ADD_PRODUCT, UPDATE_PRODUCT, TOGGLE_PRODUCT } from './actionTypes'

function addProduct(text, purveyorKey) {
  return {
    type: ADD_PRODUCT,
    name: text,
    purveyorKey: purveyorKey
  };
}

function updateProduct(product) {
  return {
    type: UPDATE_PRODUCT,
    product: product
  };
}

function toggleProduct(index) {
  return {
    type: TOGGLE_PRODUCT,
    index: index
  };
}

function setVisibilityFilter(filter) {
  return {
    type: SET_PRODUCT_VISIBILITY,
    filter: filter
  };
}

export default {
  ADD_PRODUCT,
  UPDATE_PRODUCT,
  TOGGLE_PRODUCT,
  addProduct,
  updateProduct,
  toggleProduct,
}
