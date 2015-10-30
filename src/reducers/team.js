import { getIdx, updateByIdx, updateDataState } from '../utilities/reducer'
import {
  SET_CART_TIMEOUT_ID,
  SET_CURRENT_TEAM,
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
  COMPLETE_TEAM_TASK
} from '../actions';

const initialState = {
  teams: {
    isFetching: false,
    errors: null,
    data: [],
    defaultCategories: {},
    currentTeam: {},
    cartTimeoutId: null,
    products: {},
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
    // console.log('team action received: ', action)
    const receiveTeamState = Object.assign({}, state);
    const receiveTeamIdx = getIdx(receiveTeamState.data, action.team.id);
    const receiveTeamsDataState = updateDataState(receiveTeamState.data, action.team)
    // console.log(action.type, action.team.id)
    // let receiveCurrentTeam = receiveTeamState.currentTeam;
    // if(action.sessionTeamId === action.team.id){
    //   receiveCurrentTeam = receiveTeamsDataState[receiveTeamIdx];
    // }

    return Object.assign({}, state, {
      isFetching: false, // TODO: do we need to phase this out?
      errors: null,
      data: receiveTeamsDataState,
      // currentTeam: receiveCurrentTeam,
      lastUpdated: (new Date()).toISOString()
    });

  case RECEIVE_CATEGORIES:
    const defaultCategoriesState = Object.assign({}, state);
    // const currentDefaultCategoriesState = updateDataState(defaultCategoriesState.defaultCategories, action.category)
    defaultCategoriesState.defaultCategories[action.category.id] = action.category;
    return Object.assign({}, state, {
      // defaultCategories: currentDefaultCategoriesState,
      defaultCategories: defaultCategoriesState.defaultCategories,
    });

  case RECEIVE_PRODUCTS:
    const newProductsState = Object.assign({}, state);
    // const currentProductsState = updateDataState(newProductsState.products, action.product)
    newProductsState.products[action.product.id] = action.product;
    return Object.assign({}, state, {
      // products: currentProductsState,
      products: newProductsState.products
    });

  // delete the team
  case DELETE_TEAM:
    const deleteTeamState = Object.assign({}, state);
    const deleteTeamIdx = getIdx(deleteTeamState.data, action.teamId);
    const deteleteTeamsDataState = updateByIdx(deleteTeamState.data, deleteTeamIdx, { deleted: true });
    return Object.assign({}, state, {
      data: deteleteTeamsDataState,
      lastUpdated: (new Date()).toISOString()
    });

  // add team
  case ADD_TEAM:
    const addTeamState = Object.assign({}, state);
    const addTeamsDataState = updateDataState(addTeamState.data, action.team);
    const addTeamIdx = getIdx(addTeamsDataState, action.team.id);

    let addCurrentTeam = addTeamState.currentTeam;
    if(action.sessionTeamId === action.team.id){
      addCurrentTeam = addTeamsDataState[addTeamIdx];
    }
    // console.log(action.type, action.team.id)
    return Object.assign({}, state, {
      data: addTeamsDataState,
      currentTeam: addCurrentTeam,
      lastUpdated: (new Date()).toISOString()
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

    const updateTeamState = Object.assign({}, state);
    let updateTeamsDataState = updateTeamState.data;
    const updateTeamIdx = getIdx(updateTeamsDataState, action.teamId);
    // if team passed in, then assume we are only updating the team attributes
    if (action.hasOwnProperty('team')) {
      updateTeamsDataState = updateDataState(updateTeamState.data, action.team);
    }
    // if recipeId and task passed in, then assume we are updating a specific task
    else if(action.hasOwnProperty('recipeId') && action.hasOwnProperty('task')){
      // console.log(action.type, action.recipeId);
      const taskIdx = getIdx(updateTeamState.data[updateTeamIdx].tasks, action.recipeId);
      const currentTasksDataState = updateByIdx(updateTeamState.data[updateTeamIdx].tasks, taskIdx, action.task);
      updateTeamsDataState = updateByIdx(updateTeamState.data, updateTeamIdx, {
        tasks: currentTasksDataState
      });
    }

    // let updateCurrentTeam = updateTeamState.currentTeam;
    // if(action.sessionTeamId === action.team.id){
    //   updateCurrentTeam = updateTeamsDataState[updateTeamIdx];
    // }

    return Object.assign({}, state, {
      data: updateTeamsDataState,
      // currentTeam: updateCurrentTeam,
      lastUpdated: (new Date()).toISOString()
    });

  case SET_CURRENT_TEAM:
    return Object.assign({}, state, {
      currentTeam: action.team
    });

  case SET_CART_TIMEOUT_ID:
    return Object.assign({}, state, {
      cartTimeoutId: action.cartTimeoutId
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
