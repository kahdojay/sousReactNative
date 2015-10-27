import { DDP } from '../resources/apiConfig'
import {
  CREATE_CONNECTION,
  RESET_CONNECTIONS,
  SUBSCRIBE_CONNECTION,
  UNSUBSCRIBE_CONNECTION,
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

      if(proceed === true){
        dispatch(() => {
          ddpClient.unsubscribe(channel)
          // console.log('CONNECTING: ', channel, argsList);
          ddpClient.subscribe(channel, argsList);
        })
        dispatch({
          type: SUBSCRIBE_CONNECTION,
          channel: channel,
          connectionId: connectionId,
        })
      }
    }
  }

  function subscribeDDP(session, teamIds){
    return (dispatch, getState) => {
      const {connect} = getState();
      // console.log(session, teamIds)
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

  function connectDDP(allActions){
    const {
      uiActions,
      sessionActions,
      teamActions,
      messageActions,
      purveyorActions,
      errorActions
    } = allActions
    return (dispatch, getState) => {
      const {session, teams} = getState();
      dispatch({
        type: RESET_CONNECTIONS
      })
      //--------------------------------------
      // Bind DDP client events
      //--------------------------------------
      ddpClient.on('message', (msg) => {
        var log = JSON.parse(msg);
        // console.log(`[${new Date()}] MAIN DDP MSG`, log);
        // var teamIds = getState().teams.data.map(function(team) {
        //   return team.id;
        // })

        // Treat an message as a "ping"
        dispatch({
          type: CREATE_CONNECTION,
          status: CONNECT.CONNECTED
        })

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

      //--------------------------------------
      // Connect the DDP client
      //--------------------------------------
      ddpClient.connect((error, reconnectAttempt) => {
        if (error) {
          // return dispatch(errorTeams([{
          //   id: 'error_feed_connection',
          //   message: 'Feed connection error!'
          // }]));
          // console.log('ERROR: ', error);
          // TODO: create a generic error action and reducer
        }
        if (reconnectAttempt) {
          console.log('RECONNECT ATTEMPT: Reestablishment of a connection.');
          // TODO: what happens on reconnect?
          dispatch({
            type: CREATE_CONNECTION,
            status: CONNECT.OFFLINE
          })
        } else {
          console.log('CONNECT: app connect.')
          dispatch({
            type: CREATE_CONNECTION,
            status: CONNECT.CONNECTED
          })
          // console.log('TEAMS', teams);
          // console.log('TEAM IDS', teamIds);
          const teamIds = _.pluck(teams.data, 'id')
          dispatch(subscribeDDP(session, teamIds))
        }
      });
      ddpClient.on('socket-close', function(code, message) {
        console.log("Close: %s %s", code, message);
        dispatch({
          type: CREATE_CONNECTION,
          status: CONNECT.OFFLINE
        })
      });
    }
  }

  // TODO: how to handle disconnect?

  return {
    CREATE_CONNECTION,
    RESET_CONNECTIONS,
    SUBSCRIBE_CONNECTION,
    UNSUBSCRIBE_CONNECTION,
    ERROR_CONNECTION,
    CONNECT,
    // 'connectSingleChannel': connectSingleChannel,
    // 'connectChannels': connectChannels,
    'connectDDP': connectDDP,
    'subscribeDDP': subscribeDDP,
  }
}
