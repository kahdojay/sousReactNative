/*
 * action types
 */

export const RESET_SESSION = 'RESET_SESSION';
export const REGISTER_SESSION = 'REGISTER_SESSION';
export const REQUEST_SESSION = 'REQUEST_SESSION';
export const RECEIVE_SESSION = 'RECEIVE_SESSION';
export const ERROR_SESSION = 'ERROR_SESSION';

export const ADD_STATION = 'ADD_STATION';
export const DELETE_STATION = 'DELETE_STATION';
export const REQUEST_STATIONS = 'REQUEST_STATIONS';
export const RECEIVE_STATIONS = 'RECEIVE_STATIONS';
export const ERROR_STATIONS = 'ERROR_STATIONS';

export const ADD_TASK = 'ADD_TASK';
export const UPDATE_TASK = 'UPDATE_TASK';
export const TOGGLE_TASK = 'TOGGLE_TASK';
export const SET_TASK_VISIBILITY = 'SET_TASK_VISIBILITY';

/*
 * other constants
 */

export const TaskVisibility = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
};
