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
  ADD_PRODUCT_TO_CATEGORY,
} from './actionTypes'

export default function CategoryActions(allActions){

  const {
    connectActions,
  } = allActions

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
  //     dispatch(connectActions.ddpCall('createCategory', [newCategoryAttributes]);)
  //     return dispatch({
  //       type: ADD_CATEGORY,
  //       category: newCategoryAttributes
  //     });
  //   }
  // }
  //
  // function updateCategory(categoryId, categoryAttributes){
  //   return (dispatch, getState) => {
  //     dispatch(connectActions.ddpCall('updateCategory', [categoryId, categoryAttributes]))
  //     return dispatch({
  //       type: UPDATE_CATEGORY,
  //       categoryId: categoryId,
  //       category: categoryAttributes
  //     })
  //   }
  // }
  //
  // function deleteCategory(categoryId) {
  //   return (dispatch, getState) => {
  //     const {session} = getState()
  //     dispatch(connectActions.ddpCall('deleteCategory', [categoryId, session.userId]))
  //     return dispatch({
  //       type: DELETE_CATEGORY,
  //       categoryId: categoryId
  //     })
  //   }
  // }

  function addProductToCategory(categoryId, productId){
    // console.log(categoryId, productId)
    return (dispatch, getState) => {
      const {teams} = getState()
      dispatch(connectActions.ddpCall('addProductToCategory', [
        {
          _id: categoryId,
          teamId: teams.currentTeam.id
        },
        productId
      ]))
      return dispatch({
        type: ADD_PRODUCT_TO_CATEGORY,
        categoryId: categoryId,
        productId: productId,
        teamId: teams.currentTeam.id
      })
    }
  }

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
    ADD_PRODUCT_TO_CATEGORY,
    // addCategory,
    // updateCategory,
    // deleteCategory,
    addProductToCategory,
    receiveCategories,
    resetCategories,
  }
}
