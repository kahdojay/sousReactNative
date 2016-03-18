import { generateId } from '../utilities/utils';
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

export default function MessageActions(allActions){

  const {
    connectActions,
  } = allActions

  function resetMessages(teamId = null){
    return {
      teamId: teamId,
      type: RESET_MESSAGES,
    }
  }

  function createMessage(message, author, imageUrl) {
    // console.log('imageUrl', imageUrl)
    return (dispatch, getState) => {
      const {session} = getState()
      const sessionTeamId = session.teamId
      author = author ? author : `${session.firstName}`;
      imageUrl = imageUrl ? imageUrl : session.imageUrl;

      message.text = message.text.replace(/\{\{author\}\}/g, author);
      const messageId = generateId()
      var newMessage = {
        _id: messageId,
        author: author || "Default",
        createdAt: (new Date()).toISOString(),
        delete: false,
        imageUrl: imageUrl,
        message: message.text,
        teamId: sessionTeamId,
        type: message.type,
        userId: session.userId,
      };
      if(message.hasOwnProperty('purveyor') === true){
        newMessage.purveyor = message.purveyor
      }
      if(message.hasOwnProperty('orderId') === true){
        newMessage.orderId = message.orderId
      }

      // console.log('newMessage', newMessage);
      dispatch({
        type: CREATE_MESSAGE,
        messageId: messageId,
        message: Object.assign({}, newMessage, {
          id: messageId,
        })
      })

      dispatch(connectActions.ddpCall('createMessage', [Object.assign({}, newMessage), session.userId]))
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
    return (dispatch) => {
      // console.log(message);
      return dispatch({
        type: RECEIVE_MESSAGES,
        message: message
      })
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

  function getTeamMessages(teamId, sinceNow=false) {
    return (dispatch, getState) => {
      const {messages} = getState()
      // console.log(messages);
      // console.log(teamId);
      const teamMessages = messages.teams[teamId] || {}
      let messageKeys = Object.keys(teamMessages)
      let messageDate = (new Date()).toISOString()
      if(messageKeys.length > 0){
        messageKeys.sort((a, b) => {
          return moment(teamMessages[a].createdAt).isBefore(teamMessages[b].createdAt) ? 1 : -1;
        })
        if(sinceNow === true){
          messageDate = (new Date).toISOString();
        } else {
          messageDate = teamMessages[messageKeys[messageKeys.length - 1]].createdAt;
        }
      }
      // console.log(messageDate)
      const getTeamMessagesCb = (err, result) => {
        // console.log('called function, result: ', result);
        if(result.length > 0){
          result.forEach((message) => {
            message.id = message._id
            delete message._id
            dispatch(receiveMessages(message));
          })
        } else {
          dispatch(noMessagesReceived())
        }
      }
      dispatch(connectActions.ddpCall('getTeamMessages',[teamId, messageDate, false], getTeamMessagesCb))
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
