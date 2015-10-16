import { getIdx, updateByIdx, updateDataState } from '../utilities/reducer'
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
} from '../actions';

const initialState = {
  teams: {
    isFetching: false,
    errors: null,
    data: [],
    lastUpdated: null
  }
};

function teams(state = initialState.teams, action) {
  switch (action.type) {
  // reset the teams
  case RESET_TEAMS:
    return Object.assign({}, initialState.teams);
  // request the teams
  case REQUEST_TEAMS:
    return Object.assign({}, state, {
      isFetching: true,
      errors: null,
    });
  // receive the teams
  case RECEIVE_TEAMS:
    var newTeamState = Object.assign({}, state);
    var currentTeamsDataState = updateDataState(newTeamState.data, action.team)
    // console.log(action.type, action.team.id)
    // console.log('TEAM REDUCER: ', currentTeamsDataState)
    return Object.assign({}, state, {
      isFetching: false, // do we need to phase this out?
      errors: null,
      data: currentTeamsDataState,
      lastUpdated: (new Date()).getTime()
    });

  // delete the team
  case DELETE_TEAM:
    var newTeamState = Object.assign({}, state);
    var teamIdx = getIdx(newTeamState.data, action.teamId);
    var currentTeamsDataState = updateByIdx(newTeamState.data, teamIdx, { deleted: true });
    return Object.assign({}, state, {
      data: currentTeamsDataState,
      lastUpdated: (new Date()).getTime()
    });

  // add team
  case ADD_TEAM:
    var newTeamState = Object.assign({}, state);
    var currentTeamsDataState = updateDataState(newTeamState.data, action.team)
    // console.log(action.type, action.team.id)
    return Object.assign({}, state, {
      data: currentTeamsDataState,
      lastUpdated: (new Date()).getTime()
    });

  // update team
  case UPDATE_TEAM:
    // action {
    //   teamId
    //   team
    //   ------- OR -------
    //   teamId
    //   recipeId
    //   task
    // }

    var newTeamState = Object.assign({}, state);
    var currentTeamsDataState = newTeamState.data;
    // if team passed in, then assume we are only updating the team attributes
    if (action.hasOwnProperty('team')) {
      currentTeamsDataState = updateDataState(newTeamState.data, action.team);
    }
    // if recipeId and task passed in, then assume we are updating a specific task
    else if(action.hasOwnProperty('recipeId') && action.hasOwnProperty('task')){
      var teamIdx = getIdx(newTeamState.data, action.teamId);
      // console.log(action.type, action.recipeId);
      var taskIdx = getIdx(newTeamState.data[teamIdx].tasks, action.recipeId);
      var currentTasksDataState = updateByIdx(newTeamState.data[teamIdx].tasks, taskIdx, action.task);
      currentTeamsDataState = updateByIdx(newTeamState.data, teamIdx, {
        tasks: currentTasksDataState
      });
    }

    return Object.assign({}, state, {
      data: currentTeamsDataState,
      lastUpdated: (new Date()).getTime()
    });

  // everything else
  case GET_TEAMS:
  case COMPLETE_TEAM_TASK:
  default:
    return state;
  }
}

const teamReducers = {
  'teams': teams
}

export default teamReducers
