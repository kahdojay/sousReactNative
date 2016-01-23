import {
  REGISTER_INSTALLATION,
  CONNECTION_STATUS,
  RESET_CHANNELS,
  SUBSCRIBE_CHANNEL,
  UNSUBSCRIBE_CHANNEL,
  ERROR_CONNECTION,
  CONNECT,
  OFFLINE_RESET_QUEUE,
  OFFLINE_ADD_QUEUE,
  OFFLINE_REMOVE_QUEUE,
  OFFLINE_NOOP,
  OFFLINE_PROCESSING,
  RECEIVE_SETTINGS_CONFIG,
} from '../actions'

const initialState = {
  offline: {
    queue: {},
    lastUpdated: null,
    processing: false,
  },
  connect: {
    channels: {},
    timeoutId: null,
    timeoutMilliseconds: 0,
    attempt: 0,
    status: CONNECT.CONNECTED,
    installationRegistered: false,
    error: null,
    settings: {
      token: null,
      uuid: null
    }
  },
  settingsConfig: {},
}

function offline(state = initialState.offline, action) {
  switch (action.type) {

  case OFFLINE_PROCESSING:
    return {
      queue: state.queue,
      processing: action.processing,
      lastUpdated: (new Date()).toISOString(),
    }

  case OFFLINE_RESET_QUEUE:
    const resetOfflineQueueState = Object.assign({}, initialState.offline);
    const resetOfflineQueue = resetOfflineQueueState.queue;
    return {
      queue: resetOfflineQueue,
      processing: resetOfflineQueueState.processing,
      lastUpdated: (new Date()).toISOString(),
    }

  case OFFLINE_ADD_QUEUE:
    const currentOfflineQueueState = Object.assign({}, state);
    const currentOfflineQueue = currentOfflineQueueState.queue;
    currentOfflineQueue[action.item.calledAt] = action.item
    return {
      queue: currentOfflineQueue,
      processing: currentOfflineQueueState.processing,
      lastUpdated: (new Date()).toISOString(),
    }

  case OFFLINE_REMOVE_QUEUE:
    const removeOfflineQueueState = Object.assign({}, state);
    const removeOfflineQueue = removeOfflineQueueState.queue;
    delete removeOfflineQueue[action.calledAt]
    return {
      queue: removeOfflineQueue,
      processing: removeOfflineQueueState.processing,
      lastUpdated: (new Date()).toISOString(),
    }

  case OFFLINE_NOOP:
  default:
    return state;
  }
}

function settingsConfig(state = initialState.settingsConfig, action) {
  switch (action.type) {

  case RECEIVE_SETTINGS_CONFIG:
    return Object.assign({}, action.settingsConfig);

  default:
    return state;
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
      settings: Object.assign({}, state.settings, action.deviceAttributes)
    });

  case CONNECTION_STATUS:
    let channels = state.channels;
    if( action.status === CONNECT.OFFLINE ){
      channels = []
    } else if( action.status === CONNECT.CONNECTED ){
      // .. ??
    }
    let updateState = {
      timeoutId: action.timeoutId,
      status: action.status,
      error: action.error,
      channels: channels,
    }
    if(action.hasOwnProperty('attempt') === true){
      updateState.attempt = action.attempt
    }
    if(action.hasOwnProperty('timeoutMilliseconds') === true){
      updateState.timeoutMilliseconds = action.timeoutMilliseconds
    }
    return Object.assign({}, state, updateState);

  case SUBSCRIBE_CHANNEL:
    const newConnectState = Object.assign({}, state);
    newConnectState.channels[action.channel] = action.connectionId;
    return newConnectState

  case UNSUBSCRIBE_CHANNEL:
    const unsubscribeConnectState = Object.assign({}, state);
    if(action.channel !== '*'){
      delete unsubscribeConnectState.channels[action.channel]
    } else {
      unsubscribeConnectState.channels = {}
    }
    return unsubscribeConnectState

  default:
    return state;
  }
}

const connectReducers = {
  'connect': connect,
  'offline': offline,
  'settingsConfig': settingsConfig,
}

export default connectReducers
