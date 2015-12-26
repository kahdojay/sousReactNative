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
  CONNECT
} from './actionTypes'

export default function ConnectActions(ddpClient) {

  var connectedChannels = {}

  function registerInstallation(deviceAttributes) {
    return (dispatch, getState) => {
      const {session} = getState()
      // TODO: use connect.channels in processSubscription to retrigger registrations on team changes
      dispatch(() => {
        ddpClient.call('registerInstallation', [session.userId, {
          token: deviceAttributes.token,
          uuid: deviceAttributes.uuid,
        }])
      })
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
      dispatch(() => {
        ddpClient.call('updateInstallation', [session.userId, dataAttributes])
      })
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
      const {connect, session} = getState()
      //--------------------------------------
      // Bind DDP client events
      //--------------------------------------
      ddpClient.on('message', (msg) => {
        const {connect} = getState()
        var log = JSON.parse(msg);
        // console.log(`[${new Date()}] MAIN DDP MSG`, log);

        if(connect.status !== CONNECT.CONNECTED){
          // Treat an message as a "ping"
          clearTimeout(connect.timeoutId)
          dispatch({
            type: CONNECTION_STATUS,
            timeoutId: null,
            status: CONNECT.CONNECTED,
            error: null
          })
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
        dispatch({
          type: CONNECTION_STATUS,
          timeoutId: null,
          status: CONNECT.CONNECTED,
          error: null
        })
        // console.log('TEAMS', teams);
        // console.log('TEAM IDS', teamIds);
        const teamIds = _.pluck(teams.data, 'id')
        dispatch(subscribeDDP(session, teamIds))
      });
    }
  }

  function subscribeDDPSocketClose() {
    return (dispatch, getState) => {
      const {connect} = getState()
      ddpClient.on('socket-close', (code, message) => {
        // console.log("Close: %s %s", code, message);
        clearTimeout(connect.timeoutId)
        dispatch({
          type: CONNECTION_STATUS,
          timeoutId: null,
          status: CONNECT.OFFLINE,
          error: 'Socket connection was closed, attempting to reconnect.'
        })
        // autoReconnect();
      })
    }
  }
  function subscribeDDPSocketError() {
    return (dispatch, getState) => {
      const {connect} = getState()
      ddpClient.on('socket-error', (code, message) => {
        clearTimeout(connect.timeoutId)
        dispatch({
          type: CONNECTION_STATUS,
          timeoutId: null,
          status: CONNECT.OFFLINE,
          error: 'Socket connnection errored out, attempting to reconnect.',
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

  function connectDDPTimeoutId(timeoutId){
    return (dispatch, getState) => {
      const {connect} = getState()
      clearTimeout(connect.timeoutId)
      dispatch({
        type: CONNECTION_STATUS,
        timeoutId: timeoutId,
        status: CONNECT.OFFLINE,
        error: null
      })
    }
  }

  function connectDDP(allActions){
    return (dispatch, getState) => {
      const {connect} = getState()
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
          clearTimeout(connect.timeoutId)
          dispatch({
            type: CONNECTION_STATUS,
            status: CONNECT.OFFLINE,
            timeoutId: null,
            error: error
          })
        }
      });
    }
  }

  function sendEmail(requestAttributes){
    return (dispatch) => {
      dispatch(() => {
        // console.log('Sending email: ', requestAttributes);
        ddpClient.call('sendEmail', [requestAttributes])
      })
      return {
        type: SEND_EMAIL
      }
    }
  }

  // TODO: how to handle disconnect?

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
    // 'connectSingleChannel': connectSingleChannel,
    // 'connectChannels': connectChannels,
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
