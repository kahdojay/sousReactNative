import {
  RESET_UI,
  KEYBOARD_WILL_SHOW,
  KEYBOARD_WILL_HIDE,
} from '../actions';

const initialState = {
  ui: {
    keyboard: {
      visible: false,
      marginBottom: 0,
      screenX: 0,
      screenY: 0
    }
  }
}

function ui(state = initialState.ui, action) {
  switch (action.type) {
  case RESET_UI:
    return Object.assign({}, initialState.ui);
  case KEYBOARD_WILL_SHOW:
    return Object.assign({}, state, {
      keyboard: {
        visible: true,
        marginBottom: action.marginBottom,
        screenX: action.screenX,
        screenY: action.screenY
      }
    });
  case KEYBOARD_WILL_HIDE:
    return Object.assign({}, state, {
      keyboard: {
        visible: false,
        marginBottom: action.marginBottom,
        screenX: action.screenX,
        screenY: action.screenY
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
