import {
  GET_TEAMS,
  REQUEST_TEAMS,
  RECEIVE_TEAMS,
  ERROR_TEAMS,
  ADD_TEAM,
  DELETE_TEAM
} from '../actions';

const initialState = {
  teams: {
    isFetching: false,
    errors: null,
    data: {},
    lastUpdated: null
  }
};

function teams(state = initialState.teams, action) {
  switch (action.type) {
  case REQUEST_TEAMS:
    return Object.assign({}, state, {
      isFetching: true,
      errors: null,
    });
  case RECEIVE_TEAMS:
    return Object.assign({}, state, {
      isFetching: false,
      errors: null,
      data: Object.assign({}, action.teams),
      lastUpdated: (new Date()).getTime()
    });
  case ADD_TEAM:
    return Object.assign({}, state, {
      data: Object.assign({}, state.data, action.team)
    });
  case DELETE_TEAM:
    let newTeamState = Object.assign({}, state);
    newTeamState.data[action.teamId].deleted = true;
    return newTeamState;
  case GET_TEAMS:
  default:
    return state;
  }
}

const teamReducers = {
  'teams': teams
}

export default teamReducers
