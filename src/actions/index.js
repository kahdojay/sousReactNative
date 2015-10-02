/*
 * action types
 */

export const ADD_TASK = 'ADD_TASK';
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

/*
 * action creators
 */

export function addTask(text) {
  return {
    type: ADD_TASK,
    text: text
  };
}

export function toggleTask(index) {
  return {
    type: TOGGLE_TASK,
    index: index
  };
}

export function setVisibilityFilter(filter) {
  return {
    type: SET_TASK_VISIBILITY,
    filter: filter
  };
}
