import {
  REGISTER_INSTALLATION,
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
    status: CONNECT.CONNECTED,
    installationRegistered: false,
    error: null,
    settings: {
      token: null,
      uuid: null
    }
  }
}

function connect(state = initialState.connect, action) {
  switch (action.type) {
  case RESET_CHANNELS:
    return Object.assign({}, {
      channels: initialState.connect.channels,
      // status: CONNECT.OFFLINE, // if you do this you get offline flash modal when app starts
      // if you delete it you get flash of error modal
    });
  case REGISTER_INSTALLATION:
    return Object.assign({}, state, {
      installationRegistered: action.installationRegistered,
      settings: Object.assign({}, state.settings, {
        token: action.token,
        uuid: action.uuid
      })
    });
  case CONNECTION_STATUS:
    let channels = state.channels;
    if( action.status === CONNECT.OFFLINE ){
      channels = []
    } else if( action.status === CONNECT.CONNECTED ){
      // .. ??
    }
    return Object.assign({}, state, {
      timeoutId: action.timeoutId,
      status: action.status,
      error: action.error,
      channels: channels
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
