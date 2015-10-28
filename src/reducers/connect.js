import {
  CONNECTION_STATUS,
  RESET_CHANNELS,
  SUBSCRIBE_CHANNEL,
  UNSUBSCRIBE_CHANNEL,
  ERROR_CONNECTION,
  CONNECT
} from '../actions'

const initialState = {
  connect: {
    channels: {},
    timeoutId: null,
    status: null,
    error: null
  }
}

function connect(state = initialState.connect, action) {
  switch (action.type) {
  case RESET_CHANNELS:
    return Object.assign({}, {
      channels: initialState.connect.channels
    });
  case CONNECTION_STATUS:
    return Object.assign({}, state, {
      timeoutId: action.timeoutId,
      status: action.status,
      error: action.error
    });
  case SUBSCRIBE_CHANNEL:
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
