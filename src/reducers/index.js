import MockData from '../resources/mockData';
import { combineReducers } from 'redux';
import { ADD_TODO, TOGGLE_TODO, SET_VISIBILITY_FILTER, VisibilityFilters } from '../actions';
const { SHOW_ALL } = VisibilityFilters;
const initialState = MockData
function visibilityFilter(state = SHOW_ALL, action) {
  switch (action.type) {
  case SET_VISIBILITY_FILTER:
    return action.filter;
  default:
    return state;
  }
}

function todos(state = initialState.tasks, action) {
  switch (action.type) {
  case ADD_TODO:
    return [...state, {
      text: action.text,
      completed: false
    }];
  case TOGGLE_TODO:
    let targetTodo = state[action.index]
    return [
      ...state.slice(0, action.index),
      Object.assign({}, targetTodo, {
        completed: !targetTodo.completed
      }),
      ...state.slice(action.index + 1)
    ];
  default:
    return state;
  }
}

function stations (state = initialState.stations) {
  return state
}

const todoApp = combineReducers({
  visibilityFilter,
  todos,
  stations
});

export default todoApp;
