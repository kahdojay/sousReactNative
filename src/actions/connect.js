import _ from 'lodash';
import { DDP } from '../resources/apiConfig';
import moment from 'moment';
import {
  SEND_EMAIL,
  REGISTER_INSTALLATION,
  REGISTER_INSTALLATION_DECLINED,
  REGISTER_INSTALLATION_ERROR,
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
import DeviceInfo from 'react-native-device-info';

export default function ConnectActions(ddpClient) {

  const connectedChannels = {}, noop = ()=>{}
  let connectAllActions = null
  let heartbeatTimeoutDisconnectId = null
  let heartbeatTimeoutId = null
  let ddpClientConnected = false
  let successfulHeartbeatCounter = 0

  // const APPROVED_OFFLINE_METHODS = {
  //   'addCartItem': { allow: true },
  //   'addProductCategory': { allow: true },
  //   'addTeamTask': { allow: true },
  //   'createMessage': { allow: true },
  //   'createProduct': { allow: true },
  //   // 'createTeam': { allow: true },
  //   'deleteCartItem': { allow: true },
  //   'streamS3Image': { allow: true },
  //   'updateCartItem': { allow: true },
  //   'updateOrder': { allow: true },
  //   'updateProduct': { allow: true },
  //   'updateTeam': { allow: true },
  //   'updateTeamTask': { allow: true },
  //   'updateUser': { allow: true },
  // }

  function ddpCall(method, args, methodCb = noop, serverCb = noop){
    return (dispatch, getState) => {
      const {connect, offline} = getState()
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
      if(connect.status === CONNECT.CONNECTED){
        dispatch(sendOfflineQueue())
      }
    }
  }

  function sendOfflineQueue() {
    return (dispatch, getState) => {
      const {connect, offline} = getState()
        const queueKeys = Object.keys(offline.queue)

      // console.log(JSON.stringify(queueKeys))
      // console.log(offline.processing)
      if(connect.status === CONNECT.CONNECTED && queueKeys.length > 0){
        const queueKey = queueKeys.pop()
        if(queueKey !== null){
          const item = offline.queue[queueKey]
          dispatch({
            type: OFFLINE_REMOVE_QUEUE,
            calledAt: queueKey
          })
          // console.log('processing: ', queueKey, ' item method: ', item.method)
          dispatch(() => {
            ddpClient.call(item.method, item.args, (err, results) => {
              if(item.methodCb){
                item.methodCb(err, results)
              }
              window.setTimeout(() => {
                dispatch(sendOfflineQueue())
              }, 150)
            }, item.serverCb)
          })
        }
      }
    }
  }

  function registerInstallation(deviceAttributes) {
    return (dispatch, getState) => {
      const {session} = getState()

      deviceAttributes.model = DeviceInfo.getModel()
      deviceAttributes.appVersion = DeviceInfo.getVersion()
      deviceAttributes.appBuildNumber = DeviceInfo.getBuildNumber()
      deviceAttributes.deviceId = DeviceInfo.getDeviceId()
      deviceAttributes.deviceName = DeviceInfo.getDeviceName()
      deviceAttributes.systemName = DeviceInfo.getSystemName()
      deviceAttributes.systemVersion = DeviceInfo.getSystemVersion()

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

      deviceAttributes.model = DeviceInfo.getModel()
      deviceAttributes.appVersion = DeviceInfo.getVersion()
      deviceAttributes.appBuildNumber = DeviceInfo.getBuildNumber()
      deviceAttributes.deviceId = DeviceInfo.getDeviceId()
      deviceAttributes.deviceName = DeviceInfo.getDeviceName()
      deviceAttributes.systemName = DeviceInfo.getSystemName()
      deviceAttributes.systemVersion = DeviceInfo.getSystemVersion()

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
        type: REGISTER_INSTALLATION_DECLINED,
        installationRegistered: true,
      })
    }
  }

  function registerInstallationError() {
    return (dispatch, getState) => {
      const {session} = getState()
      return dispatch({
        type: REGISTER_INSTALLATION_ERROR,
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
      // if(channel === 'teams'){
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
    // console.log('subscribeDDP called for session: ', session, teamIds)
    return (dispatch, getState) => {
      const {connect, messages, teams} = getState()
      const sessionTeamId = session.teamId

      if(session.userId !== null){
        dispatch(processSubscription(DDP.SUBSCRIBE_LIST.RESTRICTED, [session.userId]))
        dispatch(processSubscription(DDP.SUBSCRIBE_LIST.ERRORS, [session.userId]))
        dispatch(processSubscription(DDP.SUBSCRIBE_LIST.SETTINGS, [session.userId]))
        dispatch(processSubscription(DDP.SUBSCRIBE_LIST.TEAMS, [session.userId]))
      }

      if(session.isAuthenticated === true){
        // if(session.userId !== null){
        // }
        if(sessionTeamId !== null){
          const teamMessages = messages.teams[sessionTeamId] || {}
          let messageKeys = Object.keys(teamMessages)
          let messageDate = (new Date()).toISOString()
          if(messageKeys.length > 0){
            messageKeys.sort((a, b) => {
              return moment(teamMessages[a].createdAt).isBefore(teamMessages[b].createdAt) ? 1 : -1;
            })
            messageDate = teamMessages[messageKeys[0]].createdAt;
          }
          dispatch(processSubscription(DDP.SUBSCRIBE_LIST.MESSAGES, [session.userId, sessionTeamId, messageDate], [session.userId, sessionTeamId]))
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
      }
      // console.log(ddpClient.collections)
    }
  }

  function resetAppState() {
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
      } = connectAllActions

      dispatch(sessionActions.updateSession({ resetAppState: false, isAuthenticated: false }))
      ddpClient.close()

      dispatch(() => {

        dispatch(teamActions.resetTeams())
        dispatch(cartItemActions.resetCartItems())
        dispatch(orderActions.resetOrders())
        dispatch(productActions.resetProducts())
        dispatch(categoryActions.resetCategories())
        dispatch(purveyorActions.resetPurveyors())
        dispatch(messageActions.resetMessages())
        dispatch(sessionActions.resetSession())
        dispatch(errorActions.resetErrors())

        // dispatch(processUnsubscribe())
        dispatch(connectDDP(connectAllActions))

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
    connectAllActions = allActions

    return (dispatch, getState) => {
      const {session} = getState()
      //--------------------------------------
      // Bind DDP client events
      //--------------------------------------
      ddpClient.on('message', (msg) => {
        var log = JSON.parse(msg);
        // console.log(`[${new Date()}] MAIN DDP MSG`, log);
        const {connect, session} = getState()
        // if(connect.status !== CONNECT.CONNECTED){
        //   // Treat a message as a "ping"
        //   // clearTimeout(connect.timeoutId)
        //   // dispatch(connectionStatusConnected(0))
        //   dispatch(connectionHeartBeat())
        // }

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
                dispatch(resetAppState())
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
        // } else if(log.msg && log.msg === 'ping'){
        //   console.log(`PING [${(new Date()).getTime()}]`, log);
        } else if(log){
          // console.log("MAIN DDP MSG", log);
        }
      });
    }
  }

  function subscribeDDPConnected(){
    return (dispatch, getState) => {
      ddpClient.on('connected', () => {
        // console.log('connected')
        const {connect, session, teams} = getState()
        // clearTimeout(connect.timeoutId)
        // dispatch(connectionStatusConnected(0))
        dispatch(connectionHeartBeat())
        dispatch(getAppStoreVersion())
        dispatch(getSettingsConfig())
        dispatch(updateInstallation({}))
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
        ddpClientConnected = false
        dispatch(reconnectDDPClient('Socket connection was closed, attempting to reconnect.'))
      })
    }
  }
  function subscribeDDPSocketError() {
    return (dispatch, getState) => {
      ddpClient.on('socket-error', (code, message) => {
        ddpClientConnected = false
        dispatch(reconnectDDPClient('Socket connnection error, attempting to reconnect.'))
      })
    }
  }

  function connectDDPClient(resetAttempt, passCallBack) {
    return (dispatch, getState) => {
      // const {connect} = getState()
      if(ddpClientConnected === false){
        if(passCallBack === true){
          ddpClient.connect((error, reconnectAttempt) => {
            if (error) {
              ddpClientConnected = false
              dispatch(reconnectDDPClient(error, resetAttempt))
            } else {
              ddpClientConnected = true
            }
          });
        } else {
          // It needs to send without a callback so that the socket doesnt throw
          // a max listners error: "possible EventEmitter memory leak detected"
          ddpClient.connect()
        }
      } else {
        console.log('skipping, already connected')
      }
    }
  }

  function disconnectDDPClient() {
    return (dispatch, getState) => {
      // const {connect} = getState()
      ddpClient.close();
    }
  }

  function reconnectDDPClient(error, resetAttempt){
    return (dispatch, getState) => {
      const {connect} = getState()
      successfulHeartbeatCounter = 0
      clearTimeout(heartbeatTimeoutId)
      clearTimeout(connect.timeoutId)
      let attempt = connect.attempt
      if(isNaN(attempt) === true){
        attempt = 0
      }
      if(resetAttempt){
        attempt = 0
      }
      attempt = (attempt + 1)
      let timeoutMilliseconds = 5000

      // if(attempt > 34){
      //   timeoutMilliseconds = 31000
      // } else if(attempt > 21){
      //   timeoutMilliseconds = 21000
      // } else if(attempt > 13){
      //   timeoutMilliseconds = 15000
      // } else if(attempt > 8){
      //   timeoutMilliseconds = 11000
      // } else if(attempt > 5){
      //   timeoutMilliseconds = 9000
      // } else if (attempt > 3) {
      //   timeoutMilliseconds = 7000
      // }

      const timeoutId = window.setTimeout(() => {
        dispatch(connectDDPClient())
      }, timeoutMilliseconds)

      dispatch({
        type: CONNECTION_STATUS,
        timeoutId: timeoutId,
        status: CONNECT.OFFLINE,
        error: error,
        attempt: attempt,
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
      dispatch({
        type: CONNECTION_STATUS,
        timeoutId: null,
        status: CONNECT.OFFLINE,
        error: null,
        attempt: 0,
      })
      const resetAttempt = true
      const passCallBack = true
      dispatch(connectDDPClient(resetAttempt, passCallBack))
    }
  }

  function connectionHeartBeat() {
    return (dispatch, getState) => {
      const {connect, session} = getState()
      // if(connect.status === CONNECT.CONNECTED){

        clearTimeout(heartbeatTimeoutDisconnectId)
        heartbeatTimeoutDisconnectId = window.setTimeout(() => {
          dispatch(reconnectDDPClient('Connection heartbeat timed out'))
        }, 4000)

        const heartbeatData = [{
          userId: session.userId,
        }]
        ddpClient.call('💓', heartbeatData, (err, results) => {
          if(err){
            // NOTE: Do we need to set the flag to be disconnected?
            // ddpClientConnected = false
            dispatch(reconnectDDPClient(err.toString()))
          } else {
            clearTimeout(heartbeatTimeoutDisconnectId)
            clearTimeout(connect.timeoutId)
            if(successfulHeartbeatCounter > 1){
              if(connect.status !== CONNECT.CONNECTED){
                dispatch({
                  type: CONNECTION_STATUS,
                  timeoutId: null,
                  status: CONNECT.CONNECTED,
                  error: null,
                  attempt: 0,
                })
              }
            } else {
              successfulHeartbeatCounter++
            }
            heartbeatTimeoutId = window.setTimeout(() => {
              dispatch(connectionHeartBeat())
            }, 2000)
          }
        })
      // }
    }
  }

  // function connectionStatusConnected(attempt) {
  //   return (dispatch, getState) => {
  //     window.setTimeout(() => {
  //       dispatch(connectionHeartBeat())
  //     }, 5000)
  //     return dispatch({
  //       type: CONNECTION_STATUS,
  //       timeoutId: null,
  //       status: CONNECT.CONNECTED,
  //       error: null,
  //       attempt: attempt,
  //     })
  //   }
  // }

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

  function logout() {
    return (dispatch) => {
      dispatch(resetAppState())
    }
  }

  return {
    SEND_EMAIL,
    UPDATE_INSTALLATION,
    REGISTER_INSTALLATION,
    REGISTER_INSTALLATION_DECLINED,
    REGISTER_INSTALLATION_ERROR,
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
    'disconnectDDPClient': disconnectDDPClient,
    // 'connectDDPTimeoutId': connectDDPTimeoutId,
    'subscribeDDP': subscribeDDP,
    'sendEmail': sendEmail,
    'getSettingsConfig': getSettingsConfig,
    logout: logout,
  }
}
