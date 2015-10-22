import {
  CREATE_CONNECTION,
  RESET_CONNECTIONS,
  SUBSCRIBE_CONNECTION,
  UNSUBSCRIBE_CONNECTION,
  ERROR_CONNECTION
} from '../actions'

const initialState = {
  connect: {
    channels: {}
  }
}

function connect(state = initialState.connect, action) {
  switch (action.type) {
  case RESET_CONNECTIONS:
    // TODO: re-subscribe
    return Object.assign({}, initialState.connect);
  case CREATE_CONNECTION:
    return state;
  case SUBSCRIBE_CONNECTION:
    const newConnectState = Object.assign({}, state);
    newConnectState.channels[action.channel] = action.connectionId;
    return newConnectState
  default:
    return state;
  }
}


const connectReducers = {
  'connect': connect
}

export default connectReducers
