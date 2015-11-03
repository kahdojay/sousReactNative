import _ from 'lodash'
import { DDP } from '../resources/apiConfig'
import Shortid from 'shortid'
import MessageActions from './message'
import { getIdx, updateByIdx, updateDataState } from '../utilities/reducer'
import {
  SET_TASK_TIMEOUT_ID,
  SET_CART_TIMEOUT_ID,
  SET_CURRENT_TEAM,
  RESET_TEAMS,
  GET_TEAMS,
  REQUEST_TEAMS,
  RECEIVE_TEAMS,
  RECEIVE_CATEGORIES,
  RECEIVE_PRODUCTS,
  RECEIVE_TEAMS_USERS,
  ERROR_TEAMS,
  ADD_TEAM,
  UPDATE_TEAM,
  DELETE_TEAM,
  COMPLETE_TEAM_TASK,
  ORDER_SENT,
  CART
} from './actionTypes'

export default function TeamActions(ddpClient, allActions) {

  const {
    messageActions,
    connectActions
  } = allActions

  function resetTeams(){
    return {
      type: RESET_TEAMS
    }
  }

  function addTeam(name) {
    return (dispatch, getState) => {
      const {session, teams} = getState();

      const teamNames = teams.data.map((team) => {
        if (! team.deleted)
          return team.name;
      });
      if (teamNames.indexOf(name) !== -1) {
        return dispatch(errorTeams([{
          machineId: 'team-add-validation',
          message: 'Team already exists',
        }]));
      } else {
        var newTeamAttributes = {
          _id: Shortid.generate(),
          name: name,
          tasks: [],
          categories: teams.defaultCategories,
          users: [{  // push in enough info to render member listing
            _id: session.userId,
            firstName: session.firstName,
            lastName: session.lastName
          }],
          cart: {
            date: null,
            total: 0.0,
            orders: {}
          },
          orders: [],
          deleted: false
        }
        dispatch(() => {
          ddpClient.call('createTeam', [newTeamAttributes]);
        })

        // subscribe to newly-added team
        let teamIds = _.pluck(teams.data, 'id');
        teamIds.push(newTeamAttributes._id)
        dispatch(connectActions.subscribeDDP(session, teamIds))

        return dispatch({
          type: ADD_TEAM,
          team: newTeamAttributes,
          sessionTeamId: session.teamId
        });
      }
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
      let tasks = teams.currentTeam.tasks.map((task) => {
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
        dispatch(() => {
          ddpClient.call('addTeamTask', [session.userId, session.teamId, newTaskAttributes]);
        })
        return dispatch({
          type: UPDATE_TEAM,
          teamId: session.teamId,
          recipeId: newTaskAttributes.recipeId,
          task: newTaskAttributes,
          sessionTeamId: session.teamId
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
      // TODO: explore moving this logic into the set timeout in order to send localState at the time timeOut expires instead of an outdated localState (at the time timeOut is setup)
      const {session, teams} = getState();
      // console.log(teams.currentTeam)
      const currentTeam = Object.assign({}, teams.currentTeam)
      const taskIdx = _.findIndex(currentTeam.tasks, (item, idx) => {
        // console.log('getIdx item: ', item)
        if (item !== undefined) {
          return item.recipeId == recipeId;
        } else {
          return false
        }
      })
      currentTeam.tasks[taskIdx] = Object.assign({}, currentTeam.tasks[taskIdx], taskAttributes);
      // console.log(currentTeam.tasks)
      dispatch({
        type: SET_CURRENT_TEAM,
        team: currentTeam
      })

      clearTimeout(teams.taskTimeoutId);
      const taskTimeoutId = setTimeout(() => {
        dispatch(() => {
          // ddpClient.call('updateTeamTask', [session.teamId, recipeId, taskAttributes]);
          ddpClient.call('updateTeam', [session.teamId, {
            tasks: currentTeam.tasks
          }]);
        })

        // dispatch({
        //   type: UPDATE_TEAM,
        //   teamId: session.teamId,
        //   recipeId: recipeId,
        //   task: taskAttributes,
        //   sessionTeamId: session.teamId
        // })
      }, 1500);

      return dispatch({
        type: SET_TASK_TIMEOUT_ID,
        taskTimeoutId: taskTimeoutId
      })

    }
  }

  function updateTeam(teamAttributes){
    return (dispatch, getState) => {
      const {session} = getState();
      dispatch(() => {
        ddpClient.call('updateTeam', [session.teamId, teamAttributes]);
      })
      return dispatch({
        type: UPDATE_TEAM,
        teamId: session.teamId,
        team: teamAttributes,
        sessionTeamId: session.teamId
      })
    }
  }

  function deleteTeam() {
    return (dispatch, getState) => {
      const {session} = getState();
      ddpClient.call('deleteTeam', [session.teamId, session.userId])
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
    return (dispatch, getState) => {
      const {session, teams} = getState();
      let teamIds = _.pluck(teams.data, 'id');

      if( teamIds.indexOf(team.id) === -1 ){
        teamIds.push(team.id)
        dispatch(connectActions.subscribeDDP(session, teamIds));
      }

      if(team.id === session.teamId){
        dispatch({
          type: SET_CURRENT_TEAM,
          team: Object.assign({}, teams.currentTeam, team)
        })
      }

      return dispatch({
        type: RECEIVE_TEAMS,
        team: team,
        sessionTeamId: session.teamId
      })
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

  function receiveTeamsUsers(user) {
    return {
      type: RECEIVE_TEAMS_USERS,
      user: user
    }
  }

  function updateProductInCart(cartAction, cartAttributes) {
    return (dispatch, getState) => {
      const {session, teams} = getState();

      // if(cartAttributes.hasOwnProperty('purveyorId') === false || !cartAttributes.purveyorId){
      //   return dispatch(errorTeams([{
      //     machineId: 'missing-attributes',
      //     message: 'Missing purveyor reference.'
      //   }]))
      // }

      let currentTeamIdx = getIdx(teams.data, session.teamId);
      let updateTeamAttributes = Object.assign({}, teams.data[currentTeamIdx])
      let updatedCart = updateTeamAttributes.cart;
      let cartProductPurveyor = null;
      let currentTeam = _.filter(teams.data, { id: session.teamId });
      // console.log('cartAttributes', cartAttributes)

      switch (cartAction) {
      case CART.ADD:

        // console.log('cart.ADD:')

        // add the date
        if (updatedCart.date === null) {
          updatedCart.date = (new Date()).toISOString()
        }

        // add the product purveyor
        if (updatedCart.orders.hasOwnProperty(cartAttributes.purveyorId) === false) {
          updatedCart.orders[cartAttributes.purveyorId] = {
            id: Shortid.generate(),
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
        // TODO: decrement cart total on delete
        // console.log('cart.REMOVE:', currentTeam)
        // delete updatedCart
        //         .orders[cartAttributes.purveyorId]
        //         .products[cartAttributes.productId];

        // get the product purveyor
        if (updatedCart.orders.hasOwnProperty(cartAttributes.purveyorId) === true) {
          cartProductPurveyor = updatedCart.orders[cartAttributes.purveyorId];
          // console.log("Product Purveyor: ", cartProductPurveyor)

          // delete the product
          if (cartProductPurveyor.products.hasOwnProperty(cartAttributes.productId) === true) {
            // console.log("Deleting Product: ", cartProductPurveyor.products[cartAttributes.productId])
            delete cartProductPurveyor.products[cartAttributes.productId];
          }

          // clean up product purveyors
          if (Object.keys(cartProductPurveyor.products).length === 0){
            delete updatedCart.orders[cartAttributes.purveyorId];
          } else {
            updatedCart.orders[cartAttributes.purveyorId] = cartProductPurveyor;
          }
        }

        // clean up the cart
        if (Object.keys(updatedCart.orders).length === 0) {
          updatedCart = {
            date: null,
            total: 0.0,
            orders: {}
          };
        }

        break;

      // case CART.DELETE:
      //   // TODO: DELETE PRODUCT
      //   console.log('DELETING PRODUCT');
      //   break;

      case CART.RESET:
        // console.log('cart.RESET:', currentTeam.data)
        updatedCart = {
          date: null,
          total: 0.0,
          orders: {}
        };
        break;

      default:
        break;

      }

      // console.log('Dispatching receiveTeams');
      updateTeamAttributes.cart = updatedCart;

      // console.log('Updated Cart: ', updatedCart);
      dispatch({
        type: SET_CURRENT_TEAM,
        team: updateTeamAttributes
      })

      clearTimeout(teams.cartTimeoutId);
      const cartTimeoutId = setTimeout(() => {
        // console.log('Dispatching updateTeam');
        dispatch(() => {
          ddpClient.call('updateTeam', [session.teamId, {
            cart: updatedCart
          }]);
        })
        // update the team data
        // TODO: do we even need this??
        // dispatch(updateTeam(updateTeamAttributes))
      }, 1500);

      return dispatch({
        type: SET_CART_TIMEOUT_ID,
        cartTimeoutId: cartTimeoutId
      })

    }
  }

  function sendCart() {
    return (dispatch, getState) => {
      const {session} = getState()
      const orderId = Shortid.generate();
      ddpClient.call('sendCart', [session.userId, session.teamId, orderId])
      // TODO: add each teams[session.teamId].cart.orders into teams[session.teamId].orders seperately
      return dispatch({
        type: ORDER_SENT
      })
    }
  }

  function setCurrentTeam(teamId){
    return (dispatch, getState) => {
      const {teams} = getState()
      var team = _.filter(teams.data, { id: teamId })[0]
      return dispatch({
        type: SET_CURRENT_TEAM,
        team: team
      })
    }
  }

  return {
    SET_TASK_TIMEOUT_ID,
    SET_CART_TIMEOUT_ID,
    SET_CURRENT_TEAM,
    RESET_TEAMS,
    GET_TEAMS,
    REQUEST_TEAMS,
    RECEIVE_TEAMS,
    RECEIVE_CATEGORIES,
    RECEIVE_TEAMS_USERS,
    RECEIVE_PRODUCTS,
    ERROR_TEAMS,
    ADD_TEAM,
    UPDATE_TEAM,
    DELETE_TEAM,
    ORDER_SENT,
    addTeam,
    addTeamTask,
    updateTeamTask,
    updateTeam,
    deleteTeam,
    // getTeams,
    receiveTeams,
    receiveCategories,
    receiveProducts,
    receiveTeamsUsers,
    updateProductInCart,
    sendCart,
    resetTeams,
    setCurrentTeam,
    completeTeamTask,
  }
}
