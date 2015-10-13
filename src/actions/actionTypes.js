/*
 * action types
 */

export const RESET_SESSION = 'RESET_SESSION';
export const REGISTER_SESSION = 'REGISTER_SESSION';
export const REQUEST_SESSION = 'REQUEST_SESSION';
export const RECEIVE_SESSION = 'RECEIVE_SESSION';
export const ERROR_SESSION = 'ERROR_SESSION';
export const UPDATE_SESSION = 'UPDATE_SESSION';

export const RESET_STATIONS = 'RESET_STATIONS';
export const GET_STATIONS = 'GET_STATIONS';
export const ADD_STATION = 'ADD_STATION';
export const UPDATE_STATION = 'UPDATE_STATION';
export const DELETE_STATION = 'DELETE_STATION';
export const REQUEST_STATIONS = 'REQUEST_STATIONS';
export const RECEIVE_STATIONS = 'RECEIVE_STATIONS';
export const ERROR_STATIONS = 'ERROR_STATIONS';
export const COMPLETE_STATION_TASK = 'COMPLETE_STATION_TASK';

export const GET_TEAMS = 'GET_TEAMS';
export const ADD_TEAM = 'ADD_TEAM';
export const DELETE_TEAM = 'DELETE_TEAM';
export const REQUEST_TEAMS = 'REQUEST_TEAMS';
export const RECEIVE_TEAMS = 'RECEIVE_TEAMS';
export const ERROR_TEAMS = 'ERROR_TEAMS';

// export const ADD_TASK = 'ADD_TASK';
// export const UPDATE_TASK = 'UPDATE_TASK';
// export const TOGGLE_TASK = 'TOGGLE_TASK';
// export const SET_TASK_VISIBILITY = 'SET_TASK_VISIBILITY';

export const RESET_MESSAGES = 'RESET_MESSAGES';
export const GET_MESSAGES = 'GET_MESSAGES';
export const CREATE_MESSAGE = 'CREATE_MESSAGE';
export const DELETE_MESSAGE = 'DELETE_MESSAGE';
export const REQUEST_MESSAGES = 'REQUEST_MESSAGES';
export const RECEIVE_MESSAGES = 'RECEIVE_MESSAGES';
export const ERROR_MESSAGES = 'ERROR_MESSAGES';

export const RESET_PURVEYORS = 'RESET_PURVEYORS';
export const GET_PURVEYORS = 'GET_PURVEYORS';
export const ADD_PURVEYOR = 'ADD_PURVEYOR';
export const UPDATE_PURVEYOR = 'UPDATE_PURVEYOR';
export const DELETE_PURVEYOR = 'DELETE_PURVEYOR';
export const REQUEST_PURVEYORS = 'REQUEST_PURVEYORS';
export const RECEIVE_PURVEYORS = 'RECEIVE_PURVEYORS';
export const ERROR_PURVEYORS = 'ERROR_PURVEYORS';
export const ORDER_PURVEYOR_PRODUCT = 'ORDER_PURVEYOR_PRODUCT';

// export const ADD_PRODUCT = 'ADD_PRODUCT';
// export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
// export const TOGGLE_PRODUCT = 'TOGGLE_PRODUCT';

export const RESET_UI = 'RESET_UI';
export const KEYBOARD_WILL_SHOW = 'KEYBOARD_WILL_SHOW';
export const KEYBOARD_WILL_HIDE = 'KEYBOARD_WILL_HIDE';

/*
 * other constants
 */

export const TaskVisibility = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
};
