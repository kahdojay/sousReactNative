import { generateId } from '../utilities/utils'
import MessageActions from './message'
import {
  RESET_CATEGORIES,
  GET_CATEGORIES,
  RECEIVE_CATEGORIES,
  ERROR_CATEGORIES,
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  ORDER_CATEGORY_CATEGORY
} from './actionTypes'

export default function CategoryActions(ddpClient){

  function resetCategories(){
    return {
      type: RESET_CATEGORIES
    }
  }

  // function addCategory(name) {
  //   return (dispatch, getState) => {
  //     const { session } = getState();
  //     var newCategoryAttributes = {
  //       _id: generateId(),
  //       teamId: session.teamId,
  //       name: categoryRow.name,
  //       description: categoryRow.description,
  //       price: categoryRow.price,
  //       purveyors: purveyors,
  //       amount: categoryRow.amount,
  //       unit: categoryRow.unit,
  //       deleted: false,
  //     }
  //     ddpClient.call('createCategory', [newCategoryAttributes]);
  //     return dispatch({
  //       type: ADD_CATEGORY,
  //       category: newCategoryAttributes
  //     });
  //   }
  // }
  //
  // function updateCategory(categoryId, categoryAttributes){
  //   ddpClient.call('updateCategory', [categoryId, categoryAttributes]);
  //   return {
  //     type: UPDATE_CATEGORY,
  //     categoryId: categoryId,
  //     category: categoryAttributes
  //   }
  // }
  //
  // function deleteCategory(categoryId) {
  //   return (dispatch, getState) => {
  //     const {session} = getState()
  //     ddpClient.call('deleteCategory', [categoryId, session.userId])
  //     return {
  //       type: DELETE_CATEGORY,
  //       categoryId: categoryId
  //     }
  //   }
  // }

  function requestCategories() {
    return {
      type: REQUEST_CATEGORIES
    }
  }

  function errorCategories(errors){
    return {
      type: ERROR_CATEGORIES,
      errors: errors
    }
  }

  function receiveCategories(category) {
    return {
      type: RECEIVE_CATEGORIES,
      category: category
    }
  }

  return {
    RESET_CATEGORIES,
    GET_CATEGORIES,
    RECEIVE_CATEGORIES,
    ERROR_CATEGORIES,
    ADD_CATEGORY,
    UPDATE_CATEGORY,
    DELETE_CATEGORY,
    // addCategory,
    // updateCategory,
    // deleteCategory,
    receiveCategories,
    resetCategories,
  }
}
