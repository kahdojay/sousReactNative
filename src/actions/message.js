import shortid from 'shortid'
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

  function createMessage(message, author, imageUrl) {
    // console.log('imageUrl', imageUrl)
    return (dispatch, getState) => {
      const {session} = getState()
      author = author ? author : `${session.firstName} ${session.lastName.substring(0,1)}`;
      imageUrl = imageUrl ? imageUrl : session.imageUrl;

      message.text = message.text.replace(/\{\{author\}\}/g, author);
      var newMessage = {
        _id: shortid.generate(),
        author: author || "Default",
        createdAt: (new Date()).toISOString(),
        delete: false,
        imageUrl: imageUrl,
        message: message.text,
        teamId: session.teamId,
        type: message.type,
        userId: session.userId,
      };
      // console.log('newMessage', newMessage);
      ddpClient.call('createMessage', [newMessage])
      return dispatch({
        type: CREATE_MESSAGE,
        message: newMessage
      });
    }
  }

  function deleteMessage(messageId) {
    return {
      type: DELETE_MESSAGE,
      messageId: messageId
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
