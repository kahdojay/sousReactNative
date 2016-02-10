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
  RECEIVE_SETTINGS_CONFIG,
  RECEIVE_APPSTORE_VERSION,
} from './actionTypes'

export default function ConnectActions(ddpClient) {

  const connectedChannels = {}, noop = ()=>{}

  const APPROVED_OFFLINE_METHODS = {
    'addCartItem': { allow: true },
    'addProductCategory': { allow: true },
    'addTeamTask': { allow: true },
    'createMessage': { allow: true },
    'createProduct': { allow: true },
    'createTeam': { allow: true },
    'deleteCartItem': { allow: true },
    'streamS3Image': { allow: true },
    'updateCartItem': { allow: true },
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
        // console.log(method)
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
      dispatch(ddpCall('registerInstallation', [session.userId, deviceAttributes]))
      return dispatch({
        type: REGISTER_INSTALLATION,
        installationRegistered: true,
        deviceAttributes: deviceAttributes,
      })
    }
  }

  function updateInstallation(deviceAttributes) {
    return (dispatch, getState) => {
      const {session} = getState()
      dispatch(ddpCall('updateInstallation', [session.userId, deviceAttributes]))
      return dispatch({
        type: UPDATE_INSTALLATION,
        deviceAttributes: deviceAttributes,
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

  function processSubscription(subscribePkg, argsList, keyOverride = null){
    const channel = subscribePkg.channel;
    const collection = subscribePkg.collection;
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
      // if(channel === 'products'){
        // console.log('ALL CHANNELS ', connect.channels);
        // console.log('PROCEED to connect? '+proceed+' ', channel, argsList);
      // }
      if(proceed === true){
        dispatch(() => {
          ddpClient.unsubscribe(channel)
          // console.log('CONNECTING: ', channel, argsList);
          ddpClient.subscribe(channel, argsList, () => {
            // console.log(collection, ddpClient.collections[collection])
          });
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
      // dispatch({
      //   type: UNSUBSCRIBE_CHANNEL,
      //   channel: '*',
      // })
      // console.log(connect.channels)
      Object.keys(connect.channels).forEach((channel) => {
        // console.log('channel unsubscribed: ', channel)
        ddpClient.unsubscribe(channel)
      })
    }
  }

  function subscribeDDP(session, teamIds){
    // console.log('subscribeDDP called for session: ', session)
    return (dispatch, getState) => {
      const {connect, messages, teams} = getState()

      if(session.userId !== null){
        dispatch(processSubscription(DDP.SUBSCRIBE_LIST.RESTRICTED, [session.userId]))
        dispatch(processSubscription(DDP.SUBSCRIBE_LIST.ERRORS, [session.userId]))
        dispatch(processSubscription(DDP.SUBSCRIBE_LIST.SETTINGS, [session.userId]))
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
          dispatch(processSubscription(DDP.SUBSCRIBE_LIST.MESSAGES, [session.userId, session.teamId, messageDate], [session.userId, session.teamId]))
        }
        if(teamIds !== undefined && teamIds.length > 0 && session.userId !== null){
          let teamUserIds = []
          _.each(teams.data, (team) => {
            teamUserIds = teamUserIds.concat(team.users)
          })
          // dispatch(processSubscription(DDP.SUBSCRIBE_LIST.TEAMS_USERS, [session.userId, teamIds, teamUserIds]))
          const deprecate = true
          const onlyNew = true
          dispatch(processSubscription(DDP.SUBSCRIBE_LIST.PURVEYORS, [session.userId, teamIds]))
          dispatch(processSubscription(DDP.SUBSCRIBE_LIST.CATEGORIES, [session.userId, teamIds]))
          dispatch(processSubscription(DDP.SUBSCRIBE_LIST.PRODUCTS, [session.userId, teamIds, onlyNew]))
          dispatch(processSubscription(DDP.SUBSCRIBE_LIST.CART_ITEMS, [session.userId, teamIds, deprecate, onlyNew]))
          dispatch(processSubscription(DDP.SUBSCRIBE_LIST.ORDERS, [session.userId, teamIds, onlyNew]))
        }
        if(session.userId !== null){
          dispatch(processSubscription(DDP.SUBSCRIBE_LIST.TEAMS, [session.userId]))
        }
      }
      // console.log(ddpClient.collections)
    }
  }

  function resetAppState(allActions) {
    return (dispatch, getState) => {
      const {session} = getState()
      const {phoneNumber, smsToken} = session


      const newSession = {
        phoneNumber: phoneNumber,
        smsToken: smsToken,
      }

      const {
        sessionActions,
        teamActions,
        messageActions,
        purveyorActions,
        productActions,
        categoryActions,
        errorActions,
        orderActions,
        cartItemActions,
      } = allActions

      dispatch(sessionActions.updateSession({ resetAppState: false, isAuthenticated: false }))

      // dispatch(processUnsubscribe())
      dispatch(teamActions.resetTeams())
      dispatch(cartItemActions.resetCartItems())
      dispatch(orderActions.resetOrders())
      dispatch(productActions.resetProducts())
      dispatch(categoryActions.resetCategories())
      dispatch(purveyorActions.resetPurveyors())
      dispatch(messageActions.resetMessages())
      dispatch(sessionActions.resetSession())
      dispatch(errorActions.resetErrors())
      dispatch(() => {
        ddpClient.close()
        dispatch(connectDDP(allActions))
        // setTimeout(() => {
        // //   setTimeout(() => {
        // //     // const {connect} = getState()
        // //     dispatch(sessionActions.registerSession(newSession))
        // //     // dispatch(subscribeDDP(newSession, undefined))
        // //   }, 2000)
        // }, 1000)
      })
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
      cartItemActions,
    } = allActions

    return (dispatch, getState) => {
      const {session} = getState()
      //--------------------------------------
      // Bind DDP client events
      //--------------------------------------
      ddpClient.on('message', (msg) => {
        var log = JSON.parse(msg);
        // console.log(`[${new Date()}] MAIN DDP MSG`, log);
        const {connect, session} = getState()
        console.log()
        if(connect.status !== CONNECT.CONNECTED){
          // Treat an message as a "ping"
          clearTimeout(connect.timeoutId)
          dispatch(connectionStatusConnected(connect.attempt))
        }

        // process the subscribe events to collections and their fields
        if (log.hasOwnProperty('fields')){
          // console.log("MAIN DDP WITH FIELDS MSG", log);
          // console.log("COLLECTION: ", log.collection);
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

              if(session.isAuthenticated === true && data.hasOwnProperty('resetAppState') === true && data.resetAppState === true){
                dispatch(resetAppState(allActions))
                return;
              }

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

              // if(data.hasOwnProperty('firstName') === true && data.hasOwnProperty('lastName') === true && data.hasOwnProperty('username') === true){
              //   const teamUserData = {
              //     'id': data.id,
              //     'firstName': data.firstName,
              //     'lastName': data.lastName,
              //     'username': data.username,
              //     'email': data.email,
              //     'superUser': data.superUser,
              //     'imageUrl': data.imageUrl,
              //     'updatedAt': data.updatedAt,
              //   }
              //   dispatch(teamActions.receiveTeamsUsers(teamUserData))
              // }
              break;
            case 'errors':
              dispatch(errorActions.receiveErrors(data))
              break;
            case 'orders':
              dispatch(orderActions.receiveOrders(data))
              break;
            case 'cart_items':
              dispatch(cartItemActions.receiveCartItems(data))
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
        dispatch(getAppStoreVersion())
        dispatch(getSettingsConfig())
        // console.log('TEAMS', teams);
        // console.log('SESSION: ', session);
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
      return dispatch({
        type: SEND_EMAIL
      })
    }
  }

  function getAppStoreVersion() {
    return (dispatch) => {
      const appStoreVersionCb = (err, appStoreVersion) => {
        dispatch({
          type: RECEIVE_APPSTORE_VERSION,
          appStoreVersion: appStoreVersion,
        })
      }
      dispatch(ddpCall('getAppStoreVersion', [], appStoreVersionCb))
    }
  }

  function getSettingsConfig() {
    return (dispatch) => {
      const settingsConfigCb = (err, settingsConfig) => {
        dispatch({
          type: RECEIVE_SETTINGS_CONFIG,
          settingsConfig: settingsConfig,
        })
      }
      dispatch(ddpCall('getSettingsConfig', [], settingsConfigCb))
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
    RECEIVE_SETTINGS_CONFIG,
    RECEIVE_APPSTORE_VERSION,
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
    'getSettingsConfig': getSettingsConfig,
  }
}
