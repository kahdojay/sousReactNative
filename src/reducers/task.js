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

function tasks(state = initialState.tasks, action) {
  switch (action.type) {
  case ADD_TASK:
    return [...state, {
      text: action.text,
      completed: false
    }];
  case TOGGLE_TASK:
    let targetTask = state[action.index]
    return [
      ...state.slice(0, action.index),
      Object.assign({}, targetTask, {
        completed: !targetTask.completed
      }),
      ...state.slice(action.index + 1)
    ];
  default:
    return state;
  }
}

const task = {
  'taskVisibility': taskVisibility,
  'tasks': tasks
}

export default task
