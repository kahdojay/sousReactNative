import MockData from '../resources/mockData';
import {
  ADD_TASK,
  UPDATE_TASK,
  TOGGLE_TASK,
  SET_TASK_VISIBILITY,
  TaskVisibility
} from '../actions';
const { SHOW_ALL } = TaskVisibility;

const initialState = {
  stations: {},
  tasks: {}
};

function taskVisibility(state = SHOW_ALL, action) {
  switch (action.type) {
  case SET_TASK_VISIBILITY:
    return action.filter;
  default:
    return state;
  }
}

function tasks(state = initialState.tasks, action) {
  switch (action.type) {
  case ADD_TASK:
    let newState = Object.assign({}, state)
    let newTaskId = Object.keys(newState).length;
    newState[newTaskId] = {
      id: newTaskId + '',
      stationKey: action.stationKey,
      name: action.name,
      description: '',
      completed: false,
      quantity: 1
    }
    return newState
  case TOGGLE_TASK:
    let newStateToggle = Object.assign({}, state)
    newStateToggle[action.index].completed = !newStateToggle[action.index].completed
    return newStateToggle;
  case UPDATE_TASK:
    let newTasksState = Object.assign({}, state)
    newTasksState[action.task.id] = action.task
    return newTasksState
  default:
    return state;
  }
}

const task = {
  'taskVisibility': taskVisibility,
  'tasks': tasks
}

export default task
