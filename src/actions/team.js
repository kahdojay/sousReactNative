import Shortid from 'shortid'
import MessageActions from './message'
import { getIdx, updateByIdx, updateDataState } from '../utilities/reducer'
import {
  RESET_TEAMS,
  GET_TEAMS,
  REQUEST_TEAMS,
  RECEIVE_TEAMS,
  RECEIVE_CATEGORIES,
  RECEIVE_PRODUCTS,
<<<<<<< HEAD
  UPDATE_TEAM_CART,
=======
>>>>>>> development
  ERROR_TEAMS,
  ADD_TEAM,
  UPDATE_TEAM,
  DELETE_TEAM,
  COMPLETE_TEAM_TASK,
  CART
} from './actionTypes'

export default function TeamActions(ddpClient) {

  const messageActions = MessageActions(ddpClient)

  function resetTeams(){
    return {
      type: RESET_TEAMS
    }
  }

  function addTeam(name) {
    return (dispatch, getState) => {
      const {session, teams} = getState();
      var newTeamAttributes = {
        _id: Shortid.generate(),
        name: name,
        tasks: [],
        categories: teams.defaultCategories,
        users: [session.userId],
        cart: {
          date: null,
          total: 0.0,
          orders: {}
        },
        deleted: false
      }
      ddpClient.call('createTeam', [newTeamAttributes]);
      return dispatch({
        type: ADD_TEAM,
        team: newTeamAttributes
      });
    }
  }

  function completeTeamTask(messageText) {
    return (dispatch) => {
      dispatch(messageActions.createMessage(messageText))
      return dispatch({
        type: COMPLETE_TEAM_TASK
      });
    }
  }

  function addTeamTask(taskAttributes){
    return (dispatch, getState) => {
      const {session, teams} = getState();
      var team = _.filter(teams.data, { id: session.teamId })[0]
      let tasks = team.tasks.map((task) => {
        if (! task.deleted)
          return task.name;
      });
      if (tasks.indexOf(taskAttributes.name) === -1) {
        var newTaskAttributes = {
          recipeId: Shortid.generate(),
          name: taskAttributes.name,
          description: "",
          deleted: false,
          completed: false,
          quantity: 1,
          unit: 0 // for future use
        }
        ddpClient.call('addTeamTask', [session.userId, session.teamId, newTaskAttributes]);
        return dispatch({
          type: UPDATE_TEAM,
          teamId: session.teamId,
          recipeId: newTaskAttributes.recipeId,
          task: newTaskAttributes
        })
      } else {
        return dispatch(errorTeams([{
          machineId: 'team-task-validation',
          message: 'Task already exists'
        }]))
      }
    }
  }

  function updateTeamTask(recipeId, taskAttributes){
    return (dispatch, getState) => {
      const {session} = getState();
      ddpClient.call('updateTeamTask', [session.teamId, recipeId, taskAttributes]);
      return dispatch({
        type: UPDATE_TEAM,
        teamId: session.teamId,
        recipeId: recipeId,
        task: taskAttributes
      })
    }
  }

  function updateTeam(teamAttributes){
    return (dispatch, getState) => {
      const {session} = getState();
      ddpClient.call('updateTeam', [session.teamId, teamAttributes]);
      return dispatch({
        type: UPDATE_TEAM,
        teamId: session.teamId,
        team: teamAttributes
      })
    }
  }

  function deleteTeam() {
    return (dispatch, getState) => {
      const {session} = getState();
      ddpClient.call('deleteTeam', [session.teamId])
      return dispatch({
        type: DELETE_TEAM,
        teamId: session.teamId
      })
    }
  }

  function requestTeams() {
    return {
      type: REQUEST_TEAMS
    }
  }

  function errorTeams(errors){
    return {
      type: ERROR_TEAMS,
      errors: errors
    }
  }

  function receiveTeams(team) {
    // console.log(RECEIVE_TEAMS, team);
    return {
      type: RECEIVE_TEAMS,
      team: team
    }
  }

  function receiveCategories(category) {
    return {
      type: RECEIVE_CATEGORIES,
      category: category
    }
  }

  function receiveProducts(product) {
    return {
      type: RECEIVE_PRODUCTS,
      product: product
    }
  }

  function updateProductInCart(cartAction, cartAttributes){
    console.log(cartAction, cartAttributes);
    return (dispatch, getState) => {
      const {session, teams} = getState();

      // if(cartAttributes.hasOwnProperty('purveyorId') === false || !cartAttributes.purveyorId){
      //   return dispatch(errorTeams([{
      //     machineId: 'missing-attributes',
      //     message: 'Missing purveyor reference.'
      //   }]))
      // }

      let currentTeamIdx = getIdx(teams.data, session.teamId);
      let updatedCart = Object.assign({}, teams.data[currentTeamIdx].cart);
      let cartProductPurveyor = null;

      switch (cartAction) {
      case CART.ADD:
        // add the date
        if (updatedCart.date === null) {
          updatedCart.date = (new Date()).getTime()
        }
        // add the product purveyor
        if (updatedCart.orders.hasOwnProperty(cartAttributes.purveyorId) === false) {
          updatedCart.orders[cartAttributes.purveyorId] = {
            total: 0.0,
            deliveryInstruction: '',
            products: {}
          };
        }
        // get the product purveyor
        cartProductPurveyor = updatedCart.orders[cartAttributes.purveyorId];

        // add the product
        if(cartProductPurveyor.products.hasOwnProperty(cartAttributes.productId) === false) {
          cartProductPurveyor.products[cartAttributes.productId] = {}
        }

        // update the cart item
        cartProductPurveyor.products[cartAttributes.productId] = {
          quantity: cartAttributes.quantity,
          note: cartAttributes.note
        }

        // update the product purveyor
        updatedCart.orders[cartAttributes.purveyorId] = cartProductPurveyor;
        break;
      case CART.REMOVE:
        // get the product purveyor
        if (updatedCart.orders.hasOwnProperty(cartAttributes.purveyorId) === true) {
          cartProductPurveyor = updatedCart.orders[cartAttributes.purveyorId];

          // delete the product
          if (cartProductPurveyor.products.hasOwnProperty(cartAttributes.productId) === true) {
            delete cartProductPurveyor.products[cartAttributes];
          }
          // clean up product purveyors
          if (Object.keys(cartProductPurveyor.products).length === 0){
            delete updatedCart.orders[cartAttributes.purveyorId];
          }
        }
        // clean up the cart
        if (Object.keys(updatedCart.orders)) {
          updatedCart = {
            date: null,
            total: 0.0,
            orders: {}
          };
        }
        break;
      case CART.RESET:
        updatedCart = {
          date: null,
          total: 0.0,
          orders: {}
        };
        break;
      default:
        break;
      }

      console.log('Updated Cart: ', updatedCart);

      return dispatch(updateTeam({
        cart: updatedCart
      }))
    }
  }

  return {
    RESET_TEAMS,
    GET_TEAMS,
    REQUEST_TEAMS,
    RECEIVE_TEAMS,
    RECEIVE_CATEGORIES,
    RECEIVE_PRODUCTS,
    ERROR_TEAMS,
    ADD_TEAM,
    UPDATE_TEAM,
    DELETE_TEAM,
    addTeam,
    addTeamTask,
    updateTeamTask,
    updateTeam,
    deleteTeam,
    // getTeams,
    receiveTeams,
    receiveCategories,
    receiveProducts,
    updateProductInCart,
    resetTeams,
    completeTeamTask,
  }
}
