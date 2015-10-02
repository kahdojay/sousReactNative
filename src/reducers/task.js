import MockData from '../resources/mockData';
import { ADD_TASK, TOGGLE_TASK, SET_TASK_VISIBILITY, TaskVisibility } from '../actions';
const { SHOW_ALL } = TaskVisibility;

const initialState = MockData;

function taskVisibility(state = SHOW_ALL, action) {
  switch (action.type) {
  case SET_TASK_VISIBILITY:
    return action.filter;
  default:
    return state;
  }
}

function tasks(state = initialState, action) {
  switch (action.type) {
  case ADD_TASK:
    // kick back if station name is empty
    if(action.text === ''){
      return state;
    }
    let newState = Object.assign({}, state)
    let newTaskId = Object.keys(newState.tasks).length;
    newState.tasks[newTaskId] = {
      id: newTaskId + '',
      stationId: action.stationId,
      description: action.text,
      completed: false
    }
    newState.stations[action.stationId].taskList.push(newTaskId)
    return newState
  case TOGGLE_TASK:
    let newStateToggle = Object.assign({}, state)
    newStateToggle.tasks[action.index].completed = !newStateToggle.tasks[action.index].completed
    return newStateToggle;
  default:
    return state;
  }
}

const task = {
  'taskVisibility': taskVisibility,
  'tasks': tasks
}

export default task
