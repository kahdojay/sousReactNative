import { DDP } from '../resources/apiConfig'
import {
  CONNECTION_STATUS,
  RESET_CHANNELS,
  SUBSCRIBE_CHANNEL,
  UNSUBSCRIBE_CHANNEL,
  ERROR_CONNECTION,
  CONNECT
} from './actionTypes'

export default function ConnectActions(ddpClient) {

  var connectedChannels = {}

  function processSubscription(channel, argsList){
    // console.log('PROCESSING: ', channel, argsList);
    return (dispatch, getState) => {
      const {connect} = getState()

      let proceed = false
      const connectionDetails = [channel, argsList]
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
      const {connect} = getState()
      if(session.phoneNumber !== ""){
        dispatch(processSubscription(DDP.SUBSCRIBE_LIST.RESTRICTED.channel, [session.phoneNumber]))
      }

      if(session.userId !== null){
        dispatch(processSubscription(DDP.SUBSCRIBE_LIST.ERRORS.channel, [session.userId]))
      }

      if(session.isAuthenticated === true){
        if(teamIds !== undefined && teamIds.length > 0){
          dispatch(processSubscription(DDP.SUBSCRIBE_LIST.MESSAGES.channel, [teamIds]))
        }
        if(session.userId !== null){
          dispatch(processSubscription(DDP.SUBSCRIBE_LIST.TEAMS.channel, [session.userId]))
        }
        if(session.teamId !== null){
          dispatch(processSubscription(DDP.SUBSCRIBE_LIST.PURVEYORS.channel, [session.teamId]))
          dispatch(processSubscription(DDP.SUBSCRIBE_LIST.CATEGORIES.channel, [session.teamId]))
          dispatch(processSubscription(DDP.SUBSCRIBE_LIST.PRODUCTS.channel, [session.teamId]))
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
      uiActions,
      sessionActions,
      teamActions,
      messageActions,
      purveyorActions,
      errorActions
    } = allActions

    return (dispatch, getState) => {
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
              dispatch(messageActions.receiveMessages(data))
              break;
            case 'teams':
              dispatch(teamActions.receiveTeams(data))
              break;
            case 'purveyors':
              dispatch(purveyorActions.receivePurveyors(data))
              break;
            case 'categories':
              dispatch(teamActions.receiveCategories(data))
              break;
            case 'products':
              dispatch(teamActions.receiveProducts(data))
              break;
            case 'users':
              // console.log("MAIN DDP WITH FIELDS MSG", log);
              dispatch(sessionActions.receiveSession(data))
              break;
            case 'errors':
              dispatch(errorActions.receiveErrors(data))
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

  // TODO: how to handle disconnect?

  return {
    CONNECTION_STATUS,
    RESET_CHANNELS,
    SUBSCRIBE_CHANNEL,
    UNSUBSCRIBE_CHANNEL,
    ERROR_CONNECTION,
    CONNECT,
    // 'connectSingleChannel': connectSingleChannel,
    // 'connectChannels': connectChannels,
    'connectDDP': connectDDP,
    'connectDDPClient': connectDDPClient,
    'connectDDPTimeoutId': connectDDPTimeoutId,
    'subscribeDDP': subscribeDDP,
  }
}
