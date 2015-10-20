/*
 * action types
 */

export const RESET_SESSION = 'RESET_SESSION';
export const RESET_SESSION_VERSION = 'RESET_SESSION_VERSION';
export const REGISTER_SESSION = 'REGISTER_SESSION';
export const REQUEST_SESSION = 'REQUEST_SESSION';
export const RECEIVE_SESSION = 'RECEIVE_SESSION';
export const ERROR_SESSION = 'ERROR_SESSION';
export const UPDATE_SESSION = 'UPDATE_SESSION';

export const RESET_TEAMS = 'RESET_TEAMS';
export const GET_TEAMS = 'GET_TEAMS';
export const ADD_TEAM = 'ADD_TEAM';
export const UPDATE_TEAM = 'UPDATE_TEAM';
export const DELETE_TEAM = 'DELETE_TEAM';
export const REQUEST_TEAMS = 'REQUEST_TEAMS';
export const RECEIVE_TEAMS = 'RECEIVE_TEAMS';
export const RECEIVE_CATEGORIES = 'RECEIVE_CATEGORIES';
export const RECEIVE_PRODUCTS = 'RECEIVE_PRODUCTS';
export const UPDATE_TEAM_CART = 'UPDATE_TEAM_CART';
export const ERROR_TEAMS = 'ERROR_TEAMS';
export const COMPLETE_TEAM_TASK = 'COMPLETE_TEAM_TASK';
export const CART = {
  ADD: 'ADD_TO_CART',
  REMOVE: 'REMOVE_FROM_CART',
  RESET: 'RESET_CART',
  DELETE: 'DELETE_FROM_CART',
};
export const ORDER_SENT = 'ORDER_SENT';

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
