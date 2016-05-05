import { generateId } from '../utilities/utils'
import { getIdx } from '../utilities/reducer'
import {
  RESET_CATEGORIES,
  GET_CATEGORIES,
  RECEIVE_CATEGORIES,
  ERROR_CATEGORIES,
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  ADD_PRODUCT_CATEGORY,
  REMOVE_PRODUCT_CATEGORY,
} from './actionTypes'

export default function CategoryActions(allActions){

  const {
    connectActions,
    errorActions,
  } = allActions

  function resetCategories(teamId = null){
    return {
      teamId: teamId,
      type: RESET_CATEGORIES,
    }
  }

  function addCategory(categoryAttributes) {
    return (dispatch, getState) => {
      const { teams, session } = getState();
      const sessionTeamId = session.teamId
      const teamIdx = getIdx(teams.data, sessionTeamId);
      const categoryId = generateId()
      const newCategoryAttributes = {
        _id: categoryId,
        name: categoryAttributes.name,
        teamId: sessionTeamId,
        teamCode: teams.data[teamIdx].teamCode,
        products: [],
        deleted: false,
      }
      // console.log(newCategoryAttributes)
      dispatch({
        type: ADD_CATEGORY,
        categoryId: categoryId,
        category: Object.assign({}, newCategoryAttributes, {
          id: categoryId
        })
      })
      dispatch(connectActions.ddpCall('createCategory', [Object.assign({}, newCategoryAttributes), {_id: newCategoryAttributes._id}]))
    }
  }

  function updateCategory(categoryId, categoryAttributes){
    return (dispatch, getState) => {
      const { categories, session } = getState();
      const sessionTeamId = session.teamId;
      if(categories.teams.hasOwnProperty(sessionTeamId) === true){
        if(categories.teams[sessionTeamId].hasOwnProperty(categoryId) === true){
          dispatch({
            type: UPDATE_CATEGORY,
            categoryId: categoryId,
            category: Object.assign({}, categories.teams[sessionTeamId][categoryId], categoryAttributes),
          })
          dispatch(connectActions.ddpCall('updateCategory', [categoryId, categoryAttributes]))
        } else {
          // dispatch(errorActions.createError('update-category', 'Unable to update category'))
        }
      }
    }
  }

  function deleteCategory(categoryId) {
    return (dispatch, getState) => {
      const { categories, session } = getState()
      const sessionTeamId = session.teamId;
      if(categories.teams.hasOwnProperty(sessionTeamId) === true){
        if(categories.teams[sessionTeamId].hasOwnProperty(categoryId) === true){
          const deleteCategoryAttributes = Object.assign({}, categories.teams[sessionTeamId][categoryId], {
            deleted: true,
            deletedBy: session.userId,
            deletedAt: (new Date()).toISOString(),
          })
          dispatch({
            type: DELETE_CATEGORY,
            category: deleteCategoryAttributes,
          })
          dispatch(connectActions.ddpCall('deleteCategory', [categoryId, deleteCategoryAttributes]))
        } else {
          // dispatch(errorActions.createError('update-category', 'Unable to update category'))
        }
      }
    }
  }

  function addProductCategory(categoryId, productId){
    // console.log(categoryId, productId)
    return (dispatch, getState) => {
      const {teams} = getState()

      dispatch({
        type: ADD_PRODUCT_CATEGORY,
        categoryId: categoryId,
        productId: productId,
        teamId: teams.currentTeam.id
      })

      const categoryLookup = { _id: categoryId, teamId: teams.currentTeam.id }
      dispatch(connectActions.ddpCall('addProductCategory', [categoryLookup, productId]))
    }
  }

  function updateProductCategory(previousCategoryId, categoryId, productId){
    // console.log(categoryId, productId)
    return (dispatch, getState) => {
      const {teams} = getState()

      dispatch({
        type: REMOVE_PRODUCT_CATEGORY,
        categoryId: previousCategoryId,
        productId: productId,
        teamId: teams.currentTeam.id
      })

      dispatch({
        type: ADD_PRODUCT_CATEGORY,
        categoryId: categoryId,
        productId: productId,
        teamId: teams.currentTeam.id
      })

      const categoryLookup = { _id: categoryId, teamId: teams.currentTeam.id }
      dispatch(connectActions.ddpCall('updateProductCategory', [categoryLookup, productId]))
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

  function getCategories(categoryTeamId) {
    // console.log('Getting categories for: ', categoryTeamId)
    return (dispatch, getState) => {
      const {session} = getState();
      let teamId = session.teamId
      if(categoryTeamId) {
        teamId = categoryTeamId
      }

      const getCategoriesCb = (err, result) => {
        dispatch({
          type: GET_CATEGORIES,
          isFetching: false,
        })
        // console.log('called function, result: ', result);
        if(result.length > 0){
          result.forEach((category) => {
            category.id = category._id
            delete category._id
            dispatch(receiveCategories(category));
          })
        }
      }
      dispatch(connectActions.ddpCall('getCategories', [teamId], getCategoriesCb))
      return dispatch({
        type: GET_CATEGORIES,
        isFetching: true,
      })
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
    ADD_PRODUCT_CATEGORY,
    REMOVE_PRODUCT_CATEGORY,
    addCategory,
    updateCategory,
    deleteCategory,
    addProductCategory,
    getCategories,
    updateProductCategory,
    receiveCategories,
    resetCategories,
  }
}
