import { ADD_TASK, UPDATE_TASK, TOGGLE_TASK, SET_TASK_VISIBILITY, TaskVisibility } from './actionTypes'

function addTask(text, stationKey) {
  return {
    type: ADD_TASK,
    name: text,
    stationKey: stationKey,
  };
}

function updateTask(task) {
  return {
    type: UPDATE_TASK,
    task: task
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
  UPDATE_TASK,
  TOGGLE_TASK,
  SET_TASK_VISIBILITY,
  TaskVisibility,
  addTask,
  updateTask,
  toggleTask,
  setVisibilityFilter,
}
