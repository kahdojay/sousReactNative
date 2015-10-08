import murmurhash from 'murmurhash'
import DDPClient from 'ddp-client'
import {
  CHAT
} from '../resources/apiConfig'
import {
  RESET_MESSAGES,
  GET_MESSAGES,
  REQUEST_MESSAGES,
  RECEIVE_MESSAGES,
  ERROR_MESSAGES,
  CREATE_MESSAGE,
  DELETE_MESSAGE
} from './actionTypes'

let ddpClient = new DDPClient({
  // host : "localhost",
  // port : 3000,
  // ssl  : false,
  // autoReconnect : true,
  // autoReconnectTimer : 500,
  // maintainCollections : true,
  // ddpVersion : '1',  // ['1', 'pre2', 'pre1'] available
  // Use a full url instead of a set of `host`, `port` and `ssl`
  // url: CHAT.ENPOINT_WS,
  url: 'ws://localhost:3000/websocket'
  // socketConstructor: WebSocket // Another constructor to create new WebSockets
});

function resetMessages(){
  return {
    type: RESET_MESSAGES
  }
}

function createMessage(message) {
  // NOTE: this will call the update when done, so the CREATE_MESSAGE reducer currently doesnt do anything
  ddpClient.call('createMessage', message)
  return {
    type: CREATE_MESSAGE,
    message: message
  };
}

function deleteMessage(messageKey) {
  return {
    type: DELETE_MESSAGE,
    messageKey: messageKey
  }
}

function requestMessages() {
  return {
    type: REQUEST_MESSAGES
  }
}

function receiveMessages(message) {
  return {
    type: RECEIVE_MESSAGES,
    message: message
  }
}

function errorMessages(errors){
  return {
    type: ERROR_MESSAGES,
    errors: errors
  }
}

function getMessages(){
  return (dispatch, getState) => {
    let teamKey = getState().session.teamKey
    dispatch(requestMessages())

    ddpClient.connect((error, wasReconnect) => {
      if (error) {
        return dispatch(errorMessages([{
          id: 'error_feed_connection',
          message: 'Feed connection error!'
        }]));
      }
      if (wasReconnect) {
        console.log('Reestablishment of a connection.');
      }
      ddpClient.subscribe(CHAT.PUBLISH, [teamKey]);
    });

    // TODO: Do we even need these observers?
    // observe the lists collection
    // var observer = ddpClient.observe("messages");
    // observer.added = (msg) => {
    //   console.log("NEW MSG", ddpClient.collections.messages)
    // }
    // observer.changed = () => {
    //   console.log("CHANGED");
    // }
    // observer.removed = () => {
      //TODO: should this be a skinny arrow instead of a fat arrow function?
      //TODO: what does update row actually do?
    //   this.updateRows(_.cloneDeep(_.values(ddpClient.collections.messages)));
    // }

    return ddpClient.on('message', (msg) => {
      var message = JSON.parse(msg);
      if (message.fields){
        dispatch(receiveMessages(message.fields))
      } else {
        // console.log('No message fields: ', message);
      }
    });
  }
}

export default {
  RESET_MESSAGES,
  GET_MESSAGES,
  REQUEST_MESSAGES,
  RECEIVE_MESSAGES,
  ERROR_MESSAGES,
  CREATE_MESSAGE,
  DELETE_MESSAGE,
  createMessage,
  deleteMessage,
  getMessages,
  resetMessages,
}
