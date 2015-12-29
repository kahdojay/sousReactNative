import _ from 'lodash';
import { DDP } from '../resources/apiConfig';
import moment from 'moment';
import {
  SEND_EMAIL,
  REGISTER_INSTALLATION,
  UPDATE_INSTALLATION,
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
} from './actionTypes'

export default function ConnectActions(ddpClient) {

  const connectedChannels = {}, noop = ()=>{}

  const APPROVED_OFFLINE_METHODS = {
    'addProductToCategory': { allow: true },
    'addTeamTask': { allow: true },
    'createMessage': { allow: true },
    'createProduct': { allow: true },
    'createTeam': { allow: true },
    'streamS3Image': { allow: true },
    'updateOrder': { allow: true },
    'updateProduct': { allow: true },
    'updateTeam': { allow: true },
    'updateTeamTask': { allow: true },
    'updateUser': { allow: true },
  }

  function ddpCall(method, args, methodCb = noop, serverCb = noop){
    return (dispatch, getState) => {
      const {connect} = getState()
      if(connect.status === CONNECT.CONNECTED){
        dispatch(() => {
          ddpClient.call(method, args, methodCb, serverCb);
        })
      } else {
        if(APPROVED_OFFLINE_METHODS.hasOwnProperty(method) === true && APPROVED_OFFLINE_METHODS[method].allow === true){
          dispatch({
            type: OFFLINE_ADD_QUEUE,
            item: {
              method: method,
              args: args,
              methodCb: methodCb,
              serverCb: serverCb,
              calledAt: (new Date()).toISOString()
            }
          })
        } else {
          dispatch({
            type: OFFLINE_NOOP,
            method: method,
          })
        }
      }
    }
  }

  function sendOfflineQueue() {
    return (dispatch, getState) => {
      const {offline} = getState()
      const queueKeys = Object.keys(offline.queue)
      // console.log(offline.processing)
      if(queueKeys.length > 0 && offline.processing === false){
        dispatch({
          type: OFFLINE_PROCESSING,
          processing: true,
        })
        queueKeys.sort()
        // console.log(queueKeys)
        queueKeys.forEach((queueKey) => {
          const item = offline.queue[queueKey]
          _.debounce(() => {
            dispatch(ddpCall(item.method, item.args, item.methodCb, item.serverCb))
            dispatch({
              type: OFFLINE_REMOVE_QUEUE,
              calledAt: queueKey
            })
          }, 25)()
        })
        dispatch({
          type: OFFLINE_PROCESSING,
          processing: false,
        })
      }
    }
  }

  function registerInstallation(deviceAttributes) {
    return (dispatch, getState) => {
      const {session} = getState()
      // TODO: use connect.channels in processSubscription to retrigger registrations on team changes
      const installationAttributes = {
        token: deviceAttributes.token,
        uuid: deviceAttributes.uuid,
      }
      dispatch(ddpCall('registerInstallation', [session.userId, installationAttributes]))
      return dispatch({
        type: REGISTER_INSTALLATION,
        installationRegistered: true,
        token: deviceAttributes.token,
        uuid: deviceAttributes.uuid,
      })
    }
  }

  function updateInstallation(dataAttributes) {
    return (dispatch, getState) => {
      const {session} = getState()
      dispatch(ddpCall('updateInstallation', [session.userId, dataAttributes]))
      return dispatch({
        type: UPDATE_INSTALLATION,
      })
    }
  }

  function registerInstallationDeclined() {
    return (dispatch, getState) => {
      const {session} = getState()
      return dispatch({
        type: REGISTER_INSTALLATION,
        installationRegistered: true,
      })
    }
  }

  function registerInstallationError() {
    return (dispatch, getState) => {
      const {session} = getState()
      return dispatch({
        type: REGISTER_INSTALLATION,
        installationRegistered: true,
      })
    }
  }

  function processSubscription(channel, argsList, keyOverride = null){
    // console.log('PROCESSING: ', channel, argsList);
    return (dispatch, getState) => {
      const {connect} = getState()

      let proceed = false
      let connectionDetails = [channel, argsList]
      if(keyOverride !== null){
        connectionDetails = keyOverride
      }
      const connectionId = JSON.stringify(connectionDetails)

      // console.log(connect.channels.hasOwnProperty(channel), ' === false ?');

      if( connect.channels.hasOwnProperty(channel) === false ){
        proceed = true
      } else {
        // console.log(connect.channels[channel], ' === ', connectionId, ' ?');
        if( connect.channels[channel] !== connectionId ){
          proceed = true
        }
      }
      // console.log('ALL CHANNELS ', connect.channels);
      // console.log('PROCEED to connect? '+proceed+' ', channel, argsList);
      if(proceed === true){
        dispatch(() => {
          ddpClient.unsubscribe(channel)
          // console.log('CONNECTING: ', channel, argsList);
          ddpClient.subscribe(channel, argsList);
        })
        dispatch({
          type: SUBSCRIBE_CHANNEL,
          channel: channel,
          connectionId: connectionId,
        })
      }
    }
  }

  function processUnsubscribe() {
    return (dispatch, getState) => {
      const {connect} = getState()
      console.log(connect)
      // ddpClient.unsubscribe(channel)
    }
  }

  function subscribeDDP(session, teamIds){
    // console.log('subscribeDDP called for session: ', session)
    return (dispatch, getState) => {
      const {connect, messages} = getState()
      if(session.phoneNumber !== ""){
        dispatch(processSubscription(DDP.SUBSCRIBE_LIST.RESTRICTED.channel, [session.phoneNumber]))
      }

      if(session.userId !== null){
        dispatch(processSubscription(DDP.SUBSCRIBE_LIST.ERRORS.channel, [session.userId]))
        dispatch(processSubscription(DDP.SUBSCRIBE_LIST.SETTINGS.channel, [session.userId]))
      }

      if(session.isAuthenticated === true){
        if(session.teamId !== null){
          const teamMessages = messages.teams[session.teamId] || {}
          let messageKeys = Object.keys(teamMessages)
          let messageDate = (new Date()).toISOString()
          if(messageKeys.length > 0){
            messageKeys.sort((a, b) => {
              return moment(teamMessages[a].createdAt).isBefore(teamMessages[b].createdAt) ? 1 : -1;
            })
            messageDate = teamMessages[messageKeys[0]].createdAt;
          }
          dispatch(processSubscription(DDP.SUBSCRIBE_LIST.MESSAGES.channel, [session.userId, session.teamId, messageDate], [session.userId, session.teamId]))
        }
        if(teamIds !== undefined && teamIds.length > 0 && session.userId !== null){
          dispatch(processSubscription(DDP.SUBSCRIBE_LIST.TEAMS_USERS.channel, [session.userId, teamIds]))
          dispatch(processSubscription(DDP.SUBSCRIBE_LIST.PURVEYORS.channel, [session.userId, teamIds]))
          dispatch(processSubscription(DDP.SUBSCRIBE_LIST.CATEGORIES.channel, [session.userId, teamIds]))
          dispatch(processSubscription(DDP.SUBSCRIBE_LIST.PRODUCTS.channel, [session.userId, teamIds]))
          dispatch(processSubscription(DDP.SUBSCRIBE_LIST.ORDERS.channel, [session.userId, teamIds]))
        }
        if(session.userId !== null){
          dispatch(processSubscription(DDP.SUBSCRIBE_LIST.TEAMS.channel, [session.userId]))
        }
      }
    }
  }

  /*
  * subscribes client to all backend messages,
  * introspects on messages and routes them to the appropriate reducer
  */
  function subscribeDDPMessage(allActions){
    const {
      // uiActions,
      sessionActions,
      teamActions,
      messageActions,
      purveyorActions,
      productActions,
      categoryActions,
      errorActions,
      orderActions,
    } = allActions

    return (dispatch, getState) => {
      const {session} = getState()
      //--------------------------------------
      // Bind DDP client events
      //--------------------------------------
      ddpClient.on('message', (msg) => {
        var log = JSON.parse(msg);
        // console.log(`[${new Date()}] MAIN DDP MSG`, log);
        const {connect} = getState()
        if(connect.status !== CONNECT.CONNECTED){
          // Treat an message as a "ping"
          clearTimeout(connect.timeoutId)
          dispatch(connectionStatusConnected(connect.attempt))
        }

        // process the subscribe events to collections and their fields
        if (log.hasOwnProperty('fields')){
          // console.log("MAIN DDP WITH FIELDS MSG", log);
          var data = log.fields;
          data.id = log.id;
          switch(log.collection){
            case 'messages':
              // console.log("MAIN DDP WITH FIELDS MSG", log);
              dispatch(messageActions.receiveMessages(data))
              break;
            case 'teams':
              dispatch(teamActions.receiveTeams(data))
              break;
            case 'purveyors':
              dispatch(purveyorActions.receivePurveyors(data))
              break;
            case 'categories':
              dispatch(categoryActions.receiveCategories(data))
              break;
            case 'products':
              dispatch(productActions.receiveProducts(data))
              break;
            case 'users':
              // console.log("MAIN DDP WITH FIELDS MSG: ", log);
              // console.log("SESSION USERID: ", session.userId)

              let profileData = false
              if(data.hasOwnProperty('authToken') === true){
                profileData = true
              }
              if(data.hasOwnProperty('smsSent') === true){
                profileData = true
              }
              if(data.hasOwnProperty('smsVerified') === true){
                profileData = true
              }
              if(session.userId !== null && session.userId === data.id){
                profileData = true
              }

              if(profileData){
                dispatch(sessionActions.receiveSession(data))
              }

              if(data.hasOwnProperty('firstName') === true && data.hasOwnProperty('lastName') === true && data.hasOwnProperty('username') === true){
                const teamUserData = {
                  'id': data.id,
                  'firstName': data.firstName,
                  'lastName': data.lastName,
                  'username': data.username,
                  'superUser': data.superUser,
                  'imageUrl': data.imageUrl,
                }
                dispatch(teamActions.receiveTeamsUsers(teamUserData))
              }
              break;
            case 'errors':
              dispatch(errorActions.receiveErrors(data))
              break;
            case 'orders':
              dispatch(orderActions.receiveOrders(data))
              break;
            default:
              // console.log("TODO: wire up collection: ", log.collection);
              break;
          }
        } else if(log){
          // console.log("MAIN DDP MSG", log);
        }
      });
    }
  }

  function subscribeDDPConnected(){
    return (dispatch, getState) => {
      ddpClient.on('connected', () => {
        const {connect, session, teams} = getState()
        clearTimeout(connect.timeoutId)
        dispatch(connectionStatusConnected(0))
        // console.log('TEAMS', teams);
        // console.log('TEAM IDS', teamIds);
        const teamIds = _.pluck(teams.data, 'id')
        dispatch(subscribeDDP(session, teamIds))
      });
    }
  }

  function subscribeDDPSocketClose() {
    return (dispatch, getState) => {
      ddpClient.on('socket-close', (code, message) => {
        const {connect} = getState()
        // console.log("Close: %s %s", code, message);
        // processUnsubscribe()
        clearTimeout(connect.timeoutId)
        dispatch({
          type: CONNECTION_STATUS,
          timeoutId: null,
          status: CONNECT.OFFLINE,
          error: 'Socket connection was closed, attempting to reconnect.',
          attempt: connect.attempt,
        })
        // autoReconnect();
      })
    }
  }
  function subscribeDDPSocketError() {
    return (dispatch, getState) => {
      ddpClient.on('socket-error', (code, message) => {
        const {connect} = getState()
        clearTimeout(connect.timeoutId)
        dispatch({
          type: CONNECTION_STATUS,
          timeoutId: null,
          status: CONNECT.OFFLINE,
          error: 'Socket connnection errored out, attempting to reconnect.',
          attempt: connect.attempt,
        })
      })
    }
  }

  function connectDDPClient() {
    return (dispatch, getState) => {
      const {connect} = getState()
      ddpClient.connect();
    }
  }

  function connectDDPTimeoutId(timeoutId, timeoutMilliseconds){
    return (dispatch, getState) => {
      const {connect} = getState()
      clearTimeout(connect.timeoutId)
      let attempt = connect.attempt
      if(isNaN(attempt) === true){
        attempt = 0
      }
      dispatch({
        type: CONNECTION_STATUS,
        timeoutId: timeoutId,
        status: CONNECT.OFFLINE,
        error: null,
        attempt: (attempt + 1),
        timeoutMilliseconds: timeoutMilliseconds,
      })
    }
  }

  function connectDDP(allActions){
    return (dispatch, getState) => {
      dispatch({
        type: RESET_CHANNELS,
      })
      // dispatch(allActions.orderActions.resetOrders());
      dispatch(subscribeDDPMessage(allActions))
      dispatch(subscribeDDPConnected())
      dispatch(subscribeDDPSocketClose())
      dispatch(subscribeDDPSocketError())

      //--------------------------------------
      // Connect the DDP client
      //--------------------------------------
      ddpClient.connect((error, reconnectAttempt) => {
        if (error) {
          const {connect} = getState()
          clearTimeout(connect.timeoutId)
          dispatch({
            type: CONNECTION_STATUS,
            status: CONNECT.OFFLINE,
            timeoutId: null,
            error: error,
            attempt: connect.attempt,
          })
        }
      });
    }
  }

  function connectionStatusConnected(attempt) {
    return (dispatch, getState) => {

      dispatch(sendOfflineQueue())

      return dispatch({
        type: CONNECTION_STATUS,
        timeoutId: null,
        status: CONNECT.CONNECTED,
        error: null,
        attempt: attempt,
      })
    }
  }

  function sendEmail(requestAttributes){
    return (dispatch) => {
      // console.log('Sending email: ', requestAttributes);
      dispatch(ddpCall('sendEmail', [requestAttributes]))
      return {
        type: SEND_EMAIL
      }
    }
  }

  return {
    SEND_EMAIL,
    UPDATE_INSTALLATION,
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
    // 'connectSingleChannel': connectSingleChannel,
    // 'connectChannels': connectChannels,
    'ddpCall': ddpCall,
    'registerInstallation': registerInstallation,
    'updateInstallation': updateInstallation,
    'registerInstallationDeclined': registerInstallationDeclined,
    'registerInstallationError': registerInstallationError,
    'connectDDP': connectDDP,
    'connectDDPClient': connectDDPClient,
    'connectDDPTimeoutId': connectDDPTimeoutId,
    'subscribeDDP': subscribeDDP,
    'sendEmail': sendEmail,
  }
}
