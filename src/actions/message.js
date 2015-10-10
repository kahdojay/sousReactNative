import {
  RESET_MESSAGES,
  GET_MESSAGES,
  REQUEST_MESSAGES,
  RECEIVE_MESSAGES,
  ERROR_MESSAGES,
  CREATE_MESSAGE,
  DELETE_MESSAGE
} from './actionTypes'

export default function MessageActions(ddpClient) {

  function resetMessages(){
    return {
      type: RESET_MESSAGES
    }
  }

  function createMessage(message) {
    // NOTE: this will call the update when done, so the CREATE_MESSAGE reducer
    //          currently doesnt do anything
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

  return {
    RESET_MESSAGES,
    GET_MESSAGES,
    REQUEST_MESSAGES,
    RECEIVE_MESSAGES,
    ERROR_MESSAGES,
    CREATE_MESSAGE,
    DELETE_MESSAGE,
    createMessage,
    deleteMessage,
    // getMessages,
    resetMessages,
    receiveMessages
  }
}
