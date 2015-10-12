import { DDP } from '../resources/apiConfig'
import DDPClient from 'ddp-client'
import UIActions from './ui'
import SessionActions from './session'
import StationActions from './station'
import TeamActions from './team'
import MessageActions from './message'
import PurveyorActions from './purveyor'

let ddpClient = new DDPClient({
  // host : "localhost",
  // port : 3000,
  // ssl  : false,
  // autoReconnect : true,
  // autoReconnectTimer : 500,
  // maintainCollections : true,
  // ddpVersion : '1',  // ['1', 'pre2', 'pre1'] available
  // Use a full url instead of a set of `host`, `port` and `ssl`
  url: DDP.ENDPOINT_WS,
  // socketConstructor: WebSocket // Another constructor to create new WebSockets
});

const uiActions = UIActions(ddpClient)
const sessionActions = SessionActions(ddpClient)
const stationActions = StationActions(ddpClient)
const teamActions = TeamActions(ddpClient)
const messageActions = MessageActions(ddpClient)
const purveyorActions = PurveyorActions(ddpClient)

function connectApp(teamKey){
  return (dispatch, getState) => {

    //--------------------------------------
    // Execute pre-connect actions
    //--------------------------------------

    dispatch(messageActions.resetMessages());
    dispatch(stationActions.resetStations());
    dispatch(purveyorActions.resetPurveyors());

    //--------------------------------------
    // Bind app events
    //--------------------------------------

    dispatch(uiActions.bindKeyboard());

    //--------------------------------------
    // Bind DDP client events
    //--------------------------------------

    ddpClient.on('connected', () => {
      Object.keys(DDP.SUBSCRIBE_LIST).forEach((resourceKey) => {
        let resource = DDP.SUBSCRIBE_LIST[resourceKey];
        ddpClient.subscribe(resource.channel, [teamKey]);
      })
    })
    ddpClient.on('message', (msg) => {
      var log = JSON.parse(msg);
      // console.log("MAIN DDP MSG", log);
      // var stationIds = getState().stations.data.map(function(station) {
      //   return station.id;
      // })
      if (log.fields){
        var data = log.fields;
        data.id = log.id;
        switch(log.collection){
          case 'messages':
            dispatch(messageActions.receiveMessages(data))
            break;
          case 'stations':
            dispatch(stationActions.receiveStations(data))
            break;
          case 'purveyors':
            dispatch(purveyorActions.receivePurveyors(data))
            break;
          default:
            console.log("TODO: wire up collection: ", log.collection);
            break;
        }
      }
    });

    //--------------------------------------
    // Connect the DDP client
    //--------------------------------------

    ddpClient.connect((error, wasReconnected) => {
      if (error) {
        // return dispatch(errorStations([{
        //   id: 'error_feed_connection',
        //   message: 'Feed connection error!'
        // }]));
        // console.log('ERROR: ', error);
        // TODO: create a generic error action and reducer
      }
      if (wasReconnected) {
        // console.log('RECONNECT: Reestablishment of a connection.');
      }

    });
  }
}

// TODO: how to handle disconnect?

export default Object.assign(
  {
    'connectApp': connectApp
  },
  uiActions,
  sessionActions,
  teamActions,
  stationActions,
  messageActions,
  purveyorActions
)
