import { ADD_TASK, TOGGLE_TASK, SET_TASK_VISIBILITY, TaskVisibility } from './actionTypes'

function addTask(text) {
  return {
    type: ADD_TASK,
    text: text
  };
}

function toggleTask(index) {
  return {
    type: TOGGLE_TASK,
    index: index
  };
}

function setVisibilityFilter(filter) {
  return {
    type: SET_TASK_VISIBILITY,
    filter: filter
  };
}

export default {
  ADD_TASK,
  TOGGLE_TASK,
  SET_TASK_VISIBILITY,
  TaskVisibility,
  addTask,
  toggleTask,
  setVisibilityFilter,
}
