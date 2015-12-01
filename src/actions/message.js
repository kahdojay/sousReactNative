import shortid from 'shortid';
import moment from 'moment';
import {
  RESET_MESSAGES,
  GET_MESSAGES,
  REQUEST_MESSAGES,
  RECEIVE_MESSAGES,
  NO_MESSAGES,
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
      dispatch(() => {
        ddpClient.call('createMessage', [newMessage])
      })
      return dispatch({
        type: CREATE_MESSAGE,
        message: newMessage
      });
    }
  }

  function deleteMessage(teamId, messageId) {
    return {
      type: DELETE_MESSAGE,
      teamId: teamId,
      messageId: messageId,
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

  function noMessagesReceived() {
    return {
      type: NO_MESSAGES
    }
  }

  function errorMessages(errors){
    return {
      type: ERROR_MESSAGES,
      errors: errors
    }
  }

  function getTeamMessages(teamId) {
    return (dispatch, getState) => {
      const {messages} = getState()
      // console.log(messages);
      // console.log(teamId);
      const teamMessages = messages.teams[teamId] || {}
      let messageKeys = Object.keys(teamMessages)
      let lastMessageDate = (new Date()).toISOString()
      if(messageKeys.length > 0){
        messageKeys.sort((a, b) => {
          return moment(teamMessages[a].createdAt).isBefore(teamMessages[b].createdAt) ? 1 : -1;
        })
        lastMessageDate = teamMessages[messageKeys[messageKeys.length - 1]].createdAt;
      }
      dispatch(() => {
        ddpClient.call(
          'getTeamMessages',
          [teamId, lastMessageDate],
          (err, result) => {
            // console.log('called function, result: ', result);
            if(result.length > 0){
              result.forEach((message) => {
                dispatch(receiveMessages(message));
              })
            } else {
              dispatch(noMessagesReceived())
            }
          }
        );
      });
      return dispatch(requestMessages());
    }
  }

  return {
    RESET_MESSAGES,
    GET_MESSAGES,
    REQUEST_MESSAGES,
    RECEIVE_MESSAGES,
    NO_MESSAGES,
    ERROR_MESSAGES,
    CREATE_MESSAGE,
    DELETE_MESSAGE,
    createMessage,
    deleteMessage,
    // getMessages,
    resetMessages,
    receiveMessages,
    getTeamMessages,
  }
}
