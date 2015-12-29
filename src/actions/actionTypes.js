/*
 * action types
 */

export const SEND_EMAIL = 'SEND_EMAIL';
export const REGISTER_INSTALLATION = 'REGISTER_INSTALLATION';
export const UPDATE_INSTALLATION = 'UPDATE_INSTALLATION';
export const CONNECTION_STATUS = 'CONNECTION_STATUS';
export const RESET_CHANNELS = 'RESET_CHANNELS';
export const SUBSCRIBE_CHANNEL = 'SUBSCRIBE_CHANNEL';
export const UNSUBSCRIBE_CHANNEL = 'UNSUBSCRIBE_CHANNEL';
export const ERROR_CONNECTION = 'ERROR_CONNECTION';
export const CONNECT = {
  CONNECTED: 'CONNECTED',
  RECONNECTED: 'RECONNECTED',
  OFFLINE: 'OFFLINE'
}
export const OFFLINE_RESET_QUEUE = 'OFFLINE_RESET_QUEUE';
export const OFFLINE_ADD_QUEUE = 'OFFLINE_ADD_QUEUE';
export const OFFLINE_REMOVE_QUEUE = 'OFFLINE_REMOVE_QUEUE';
export const OFFLINE_NOOP = 'OFFLINE_NOOP';
export const OFFLINE_PROCESSING = 'OFFLINE_PROCESSING';

export const RESET_SESSION = 'RESET_SESSION';
export const RESET_SESSION_VERSION = 'RESET_SESSION_VERSION';
export const REGISTER_SESSION = 'REGISTER_SESSION';
export const REQUEST_SESSION = 'REQUEST_SESSION';
export const RECEIVE_SESSION = 'RECEIVE_SESSION';
export const ERROR_SESSION = 'ERROR_SESSION';
export const UPDATE_SESSION = 'UPDATE_SESSION';

export const SET_CART_TIMEOUT_ID = 'SET_CART_TIMEOUT_ID';
export const SET_TASK_TIMEOUT_ID = 'SET_TASK_TIMEOUT_ID';
export const SET_CURRENT_TEAM = 'SET_CURRENT_TEAM';
export const RESET_TEAMS = 'RESET_TEAMS';
export const GET_TEAMS = 'GET_TEAMS';
export const ADD_TEAM = 'ADD_TEAM';
export const UPDATE_TEAM = 'UPDATE_TEAM';
export const DELETE_TEAM = 'DELETE_TEAM';
export const REQUEST_TEAMS = 'REQUEST_TEAMS';
export const RECEIVE_TEAMS = 'RECEIVE_TEAMS';
export const RECEIVE_TEAMS_USERS = 'RECEIVE_TEAMS_USERS';
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
export const NO_MESSAGES = 'NO_MESSAGES';
export const ERROR_MESSAGES = 'ERROR_MESSAGES';

export const RESET_ERRORS = 'RESET_ERRORS';
export const GET_ERRORS = 'GET_ERRORS';
export const CREATE_ERROR = 'CREATE_ERROR';
export const RECEIVE_ERRORS = 'RECEIVE_ERRORS';
export const DELETE_ERRORS = 'DELETE_ERRORS';

export const RESET_ORDERS = 'RESET_ORDERS';
export const RECEIVE_ORDERS = 'RECEIVE_ORDERS';
export const UPDATE_ORDER = 'UPDATE_ORDER';

export const RESET_PURVEYORS = 'RESET_PURVEYORS';
export const GET_PURVEYORS = 'GET_PURVEYORS';
export const ADD_PURVEYOR = 'ADD_PURVEYOR';
export const UPDATE_PURVEYOR = 'UPDATE_PURVEYOR';
export const DELETE_PURVEYOR = 'DELETE_PURVEYOR';
export const REQUEST_PURVEYORS = 'REQUEST_PURVEYORS';
export const RECEIVE_PURVEYORS = 'RECEIVE_PURVEYORS';
export const ERROR_PURVEYORS = 'ERROR_PURVEYORS';
export const ORDER_PURVEYOR_PRODUCT = 'ORDER_PURVEYOR_PRODUCT';

export const RESET_PRODUCTS = 'RESET_PRODUCTS';
export const GET_PRODUCTS = 'GET_PRODUCTS';
export const ADD_PRODUCT = 'ADD_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const REQUEST_PRODUCTS = 'REQUEST_PRODUCTS';
export const RECEIVE_PRODUCTS = 'RECEIVE_PRODUCTS';
export const ERROR_PRODUCTS = 'ERROR_PRODUCTS';

export const RESET_CATEGORIES = 'RESET_CATEGORIES';
export const GET_CATEGORIES = 'GET_CATEGORIES';
export const ADD_CATEGORY = 'ADD_CATEGORY';
export const UPDATE_CATEGORY = 'UPDATE_CATEGORY';
export const DELETE_CATEGORY = 'DELETE_CATEGORY';
export const REQUEST_CATEGORIES = 'REQUEST_CATEGORIES';
export const RECEIVE_CATEGORIES = 'RECEIVE_CATEGORIES';
export const ERROR_CATEGORIES = 'ERROR_CATEGORIES';
export const ADD_PRODUCT_TO_CATEGORY = 'ADD_PRODUCT_TO_CATEGORY';

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
