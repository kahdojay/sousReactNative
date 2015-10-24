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

  function createMessage(messageText, author, imageUrl) {
    // console.log('imageUrl', imageUrl)
    return (dispatch, getState) => {
      const {session} = getState()
      author = author ? author : `${session.firstName} ${session.lastName.substring(0,1)}`;
      imageUrl = imageUrl ? imageUrl : session.imageUrl;

      messageText = messageText.replace('{{author}}', author);
      var newMessage = {
        _id: shortid.generate(),
        message: messageText,
        userId: session.userId,
        author: author || "Default",
        teamId: session.teamId,
        createdAt: (new Date()).getTime(),
        imageUrl: imageUrl,
        delete: false
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
