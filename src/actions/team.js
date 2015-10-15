import Shortid from 'shortid'
import MessageActions from './message'
import {
  RESET_TEAMS,
  GET_TEAMS,
  REQUEST_TEAMS,
  RECEIVE_TEAMS,
  ERROR_TEAMS,
  ADD_TEAM,
  UPDATE_TEAM,
  DELETE_TEAM,
  COMPLETE_TEAM_TASK
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
      const {session} = getState();
      var newTeamAttributes = {
        _id: Shortid.generate(),
        name: name,
        tasks: [],
        users: [session.userId],
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

  function addTeamTask(teamId, taskAttributes){
    return (dispatch, getState) => {
      const {session} = getState();
      var newTaskAttributes = {
        recipeId: Shortid.generate(),
        name: taskAttributes.name,
        description: "",
        deleted: false,
        completed: false,
        quantity: 1,
        unit: 0 // for future use
      }
      ddpClient.call('addTeamTask', [session.userId, teamId, newTaskAttributes]);
      return dispatch({
        type: UPDATE_TEAM,
        teamId: teamId,
        recipeId: newTaskAttributes.recipeId,
        task: newTaskAttributes
      })
    }
  }

  function updateTeamTask(teamId, recipeId, taskAttributes){
    ddpClient.call('updateTeamTask', [teamId, recipeId, taskAttributes]);
    return {
      type: UPDATE_TEAM,
      teamId: teamId,
      recipeId: recipeId,
      task: taskAttributes
    }
  }

  function updateTeam(teamId, teamAttributes){
    ddpClient.call('updateTeam', [teamId, teamAttributes]);
    return {
      type: UPDATE_TEAM,
      teamId: teamId,
      team: teamAttributes
    }
  }

  function deleteTeam(teamId) {
    ddpClient.call('deleteTeam', [teamId])
    return {
      type: DELETE_TEAM,
      teamId: teamId
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

  return {
    RESET_TEAMS,
    GET_TEAMS,
    REQUEST_TEAMS,
    RECEIVE_TEAMS,
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
    resetTeams,
    completeTeamTask,
  }
}
