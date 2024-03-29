import _ from 'lodash'
import slug from 'slug'
import { DDP } from '../resources/apiConfig'
import { generateId } from '../utilities/utils'
import { getIdx } from '../utilities/reducer'
import Urls from '../resources/urls';
import DataUtils from '../utilities/data';
import {
  ADD_TEAM,
  CART,
  COMPLETE_TEAM_TASK,
  CONNECT,
  DELETE_TEAM,
  ERROR_TEAMS,
  GET_TEAMS,
  LEAVE_TEAM,
  RECEIVE_TEAMS_USERS,
  RECEIVE_TEAM_RESOURCE_INFO,
  RECEIVE_TEAM_BETA_ACCESS,
  RECEIVE_TEAMS,
  REQUEST_TEAMS,
  RESET_TEAMS,
  SET_CART_TIMEOUT_ID,
  SET_CURRENT_TEAM,
  SET_TASK_TIMEOUT_ID,
  UPDATE_TEAM,
} from './actionTypes'

export default function TeamActions(allActions) {

  const noop = ()=>{}

  const {
    cartItemActions,
    categoryActions,
    connectActions,
    errorActions,
    messageActions,
    orderActions,
    productActions,
    purveyorActions,
    sessionActions,
  } = allActions

  function resetTeams(){
    return {
      type: RESET_TEAMS
    }
  }

  function addTeam(name, demoTeam = false) {
    return (dispatch, getState) => {
      const {session, teams, messages} = getState();
      const sessionTeamId = session.teamId

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
        let teamCode = slug(name, {
          replacement: '',
        })
        teamCode = teamCode.toUpperCase()
        // TODO: add any other filters besides TEAM?
        teamCode = teamCode.replace('TEAM', '')
        const teamId = generateId();
        // TODO: check for unique teamCode?
        var newTeamAttributes = {
          _id: teamId,
          teamCode: teamCode,
          name: name,
          tasks: [],
          users: [session.userId],
          cart: {
            date: null,
            total: 0.0,
            orders: {}
          },
          orders: [],
          phone: DataUtils.formatPhoneNumber(session.username),
          address: '',
          city: '',
          state: '',
          zipCode: '',
          orderContacts: `${session.firstName} • ${DataUtils.formatPhoneNumber(session.username)}`,
          orderEmails: session.email,
          deleted: false,
          betaAccess: 'showDeliveryDate',
          allowedUserCount: 1,
        }

        if(demoTeam === true){
          newTeamAttributes.demoTeam = true;
        }


        dispatch({
          type: ADD_TEAM,
          teamId: teamId,
          team: Object.assign({}, newTeamAttributes, {
            id: teamId,
          }),
          sessionTeamId: sessionTeamId
        })

        dispatch(sessionActions.updateSession({teamId: newTeamAttributes._id}))

        dispatch(connectActions.ddpCall('createTeam', [Object.assign({}, newTeamAttributes), session.userId]))


        dispatch(receiveSessionTeamsUser())

        // add the teamId to the session
        const newSession = Object.assign({}, session, {
          teamId: newTeamAttributes.id
        })

        // subscribe to newly-added team
        let teamIds = _.pluck(teams.data, 'id');
        teamIds.push(newTeamAttributes.id)
        dispatch(connectActions.subscribeDDP(newSession, teamIds))
      }
    }
  }

  function completeTeamTask(message, author) {
    return (dispatch) => {
      dispatch(messageActions.createMessage(message, author, Urls.msgLogo))
      return dispatch({
        type: COMPLETE_TEAM_TASK
      });
    }
  }

  function addTeamTask(taskAttributes){
    return (dispatch, getState) => {
      const {session, teams} = getState();
      const sessionTeamId = session.teamId
      let tasks = teams.currentTeam.tasks.map((task) => {
        if (! task.deleted)
          return task.name;
      });
      if (tasks.indexOf(taskAttributes.name) === -1) {
        const recipeId = generateId()
        var newTaskAttributes = {
          recipeId: recipeId,
          name: taskAttributes.name,
          description: "",
          deleted: false,
          completed: false,
          quantity: 1,
          unit: 0, // for future use
        }
        dispatch(connectActions.ddpCall('addTeamTask', [session.userId, sessionTeamId, Object.assign({}, newTaskAttributes)]))
        return dispatch({
          type: UPDATE_TEAM,
          teamId: sessionTeamId,
          recipeId: recipeId,
          task: newTaskAttributes,
          sessionTeamId: sessionTeamId
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
      const sessionTeamId = session.teamId
      // console.log(teams.currentTeam)
      const currentTeam = Object.assign({}, teams.currentTeam)
      const taskIdx = _.findIndex(currentTeam.tasks, (item, idx) => {
        // console.log('getIdx item: ', item)
        if (item !== undefined) {
          return item.recipeId === recipeId;
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
        // dispatch(connectActions.ddpCall('updateTeamTask', [sessionTeamId, recipeId, taskAttributes]))
        dispatch(connectActions.ddpCall('updateTeam', [sessionTeamId, {
          tasks: currentTeam.tasks
        }]))

        // dispatch({
        //   type: UPDATE_TEAM,
        //   teamId: sessionTeamId,
        //   recipeId: recipeId,
        //   task: taskAttributes,
        //   sessionTeamId: sessionTeamId
        // })
      }, 1500);

      return dispatch({
        type: SET_TASK_TIMEOUT_ID,
        taskTimeoutId: taskTimeoutId
      })

    }
  }

  function updateTeam(teamAttributes, updateTeamCb = noop){
    return (dispatch, getState) => {
      const {session} = getState();
      let teamId = session.teamId;
      if(teamAttributes.id){
        teamId = teamAttributes.id
      }

      dispatch(connectActions.ddpCall('updateTeam', [teamId, teamAttributes], updateTeamCb))
      return dispatch({
        type: UPDATE_TEAM,
        teamId: teamId,
        team: teamAttributes,
      })
    }
  }

  function deleteTeam() {
    return (dispatch, getState) => {
      const {session} = getState();
      const sessionTeamId = session.teamId
      dispatch(connectActions.ddpCall('deleteTeam', [sessionTeamId, session.userId]))
      return dispatch({
        type: DELETE_TEAM,
        teamId: sessionTeamId
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
    return (dispatch, getState) => {
      const {session, teams, messages} = getState();
      const sessionTeamId = session.teamId
      let teamIds = _.pluck(teams.data, 'id');

      if( teamIds.indexOf(team.id) === -1 ){
        teamIds.push(team.id)
        dispatch(connectActions.subscribeDDP(session, teamIds))
      }

      if(team.id === sessionTeamId){
        dispatch({
          type: SET_CURRENT_TEAM,
          team: Object.assign({}, teams.currentTeam, team)
        })
      }

      dispatch(getTeamResourceInfo(team.id))
      dispatch(getTeamBetaAccess(team.id))

      let messageCount = 0
      if(messages.teams.hasOwnProperty(team.id) && Object.keys(messages.teams[team.id]).length > 0){
        messageCount = Object.keys(messages.teams[team.id]).length;
      }
      if(messageCount < 20){
        dispatch(messageActions.getTeamMessages(team.id))
      }
      dispatch(productActions.getProducts(team.id))
      dispatch(categoryActions.getCategories(team.id))
      dispatch(cartItemActions.getTeamCartItems(team.id))
      dispatch(orderActions.getTeamOrders(team.id))
      dispatch(getTeamUsers(team.id))

      return dispatch({
        type: RECEIVE_TEAMS,
        team: team,
      })
    }
  }

  function receiveSessionTeamsUser(userData) {
    const newUserData = userData || {}
    return (dispatch, getState) => {
      const {session} = getState()
      const teamUserData = {
        'id': session.userId,
        'firstName': session.firstName,
        'lastName': session.lastName,
        'email': session.email,
        'superUser': session.superUser,
        'imageUrl': session.imageUrl,
        'updatedAt': session.updatedAt,
      }
      return dispatch(receiveTeamsUsers(Object.assign({}, teamUserData, newUserData)))
    }
  }

  function receiveTeamsUsers(user) {
    return {
      type: RECEIVE_TEAMS_USERS,
      user: user
    }
  }

  function setCurrentTeam(teamId){
    return (dispatch, getState) => {
      const {teams} = getState()
      var team = _.filter(teams.data, { id: teamId })[0]
      // console.log(team)
      dispatch(messageActions.resetMessages(teamId))
      dispatch(messageActions.getTeamMessages(teamId))
      dispatch(sessionActions.updateSession({ teamId: teamId }))
      dispatch(getTeamResourceInfo(teamId))
      dispatch(getTeamBetaAccess(teamId))
      dispatch(getTeamUsers(teamId))
      return dispatch({
        type: SET_CURRENT_TEAM,
        team: team
      })
    }
  }

  function leaveCurrentTeam(teamId) {
    return (dispatch, getState) => {
      const {session, teams} = getState()
      const sessionTeamId = session.teamId

      // console.log('leaving teamId: ', teamId)

      // let teamUsers = teams.data[teamId].users;
      // const userTeamIdx = teamUsers.indexOf(session.userId);
      // if(userTeamIdx !== -1){
      //   delete teamUsers[userTeamIdx];
      // }
      // teamUsers = teamUsers.filter((v) => { return v !== undefined && v !== null; })

      // console.log('reset users: ', teamUsers)

      // update team to remove the current user
      // dispatch(updateTeam({id: teamId, users: teamUsers}))

      dispatch(connectActions.ddpCall('removeUserFromTeam', [session.userId, teamId]))


      let allTeamIds = _.pluck(teams.data, 'id');
      const currentTeamIdx = allTeamIds.indexOf(teamId);
      delete allTeamIds[currentTeamIdx];
      allTeamIds = allTeamIds.filter((v) => { return v !== undefined && v !== null; })
      if(allTeamIds.indexOf(sessionTeamId) === -1){
        const newTeamId = allTeamIds[0];
        // set a new team id
        dispatch(setCurrentTeam(newTeamId));
      }

      // dispatch(connectActions.disconnectDDPClient())
      dispatch(connectActions.subscribeDDP(session, allTeamIds))

      // console.log('setting new teamId: ', newTeamId)

      // reset the objects for other resources

      // Don't reset the pureveyors and categories since if the user is added
      // back to this team, they wont get them back...
      // dispatch(purveyorActions.resetPurveyors(teamId));
      // dispatch(categoryActions.resetCategories(teamId));

      dispatch(productActions.resetProducts(teamId));
      dispatch(orderActions.resetOrders(teamId));
      dispatch(cartItemActions.resetCartItems(teamId));
      dispatch(messageActions.resetMessages(teamId));

      // delete the team data from the team that was just left
      return dispatch({
        type: LEAVE_TEAM,
        teamId: teamId,
      })
    }
  }

  function getTeamUsers(teamId){
    return (dispatch, getState) => {
      const {session} = getState()

      // console.log(messageDate)
      const getTeamUsersCb = (err, result) => {
        // console.log('called function, result: ', result);
        if(result.length > 0){
          result.forEach((user) => {
            const teamUserData = {
              'id': user._id,
              'firstName': user.firstName,
              'lastName': user.lastName,
              'username': user.username,
              'email': user.email,
              'superUser': user.superUser,
              'imageUrl': user.imageUrl,
              'updatedAt': user.updatedAt,
              'imagedChangedAt': user.imagedChangedAt,
            }
            dispatch(receiveTeamsUsers(teamUserData))
          })
        }
      }

      dispatch(connectActions.ddpCall('getTeamUsers', [session.userId, teamId], getTeamUsersCb))
    }
  }

  function getTeamResourceInfo(teamId){
    return (dispatch, getState) => {
      const {offline, connect, session} = getState()
      if(Object.keys(offline.queue).length === 0 && connect.status === CONNECT.CONNECTED){
        // console.log('Resume retrieving team resources...')
        var getTeamResourceInfoCb = (err, results) => {
          if(!err){
            dispatch({
              type: RECEIVE_TEAM_RESOURCE_INFO,
              teamId: teamId,
              resources: results,
            })
          }
        }
        dispatch(connectActions.ddpCall('getTeamResourceInfo', [session.userId, teamId], getTeamResourceInfoCb))
      }
    }
  }

  function getTeamBetaAccess(teamId){
    return (dispatch, getState) => {
      const {session} = getState()
      var getTeamBetaAccessCb = (err, results) => {
        if(!err){
          dispatch({
            type: RECEIVE_TEAM_BETA_ACCESS,
            teamId: teamId,
            betaAccess: results.betaAccess,
          })
        }
      }
      dispatch(connectActions.ddpCall('getTeamBetaAccess', [session.userId, teamId], getTeamBetaAccessCb))
    }
  }

  return {
    ADD_TEAM,
    DELETE_TEAM,
    ERROR_TEAMS,
    GET_TEAMS,
    LEAVE_TEAM,
    RECEIVE_TEAMS_USERS,
    RECEIVE_TEAM_RESOURCE_INFO,
    RECEIVE_TEAM_BETA_ACCESS,
    RECEIVE_TEAMS,
    REQUEST_TEAMS,
    RESET_TEAMS,
    SET_CART_TIMEOUT_ID,
    SET_CURRENT_TEAM,
    SET_TASK_TIMEOUT_ID,
    UPDATE_TEAM,
    // getTeams,
    // updateProductInCart,
    addTeam,
    addTeamTask,
    completeTeamTask,
    deleteTeam,
    getTeamResourceInfo,
    getTeamBetaAccess,
    leaveCurrentTeam,
    receiveTeams,
    receiveTeamsUsers,
    receiveSessionTeamsUser,
    resetTeams,
    setCurrentTeam,
    updateTeam,
    updateTeamTask,
  }
}
