import {
  KEYBOARD_WILL_SHOW,
  KEYBOARD_WILL_HIDE,
} from '../actions';

const initialState = {
  ui: {
    keyboard: {
      visible: false,
      marginBottom: 0
    }
  }
}

function ui(state = initialState.ui, action) {
  switch (action.type) {
  case KEYBOARD_WILL_SHOW:
    return Object.assign({}, state, {
      keyboard: {
        visible: true,
        marginBottom: action.marginBottom
      }
    });
  case KEYBOARD_WILL_HIDE:
    return Object.assign({}, state, {
      keyboard: {
        visible: false,
        marginBottom: action.marginBottom
      }
    });
  default:
    return state;
  }
}


const uiReducers = {
  'ui': ui
}

export default uiReducers
