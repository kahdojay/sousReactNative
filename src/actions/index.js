import { DDP } from '../resources/apiConfig'
import DDPClient from 'ddp-client'
import ConnectActions from './connect'
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

const connectActions = ConnectActions(ddpClient)
const uiActions = UIActions(ddpClient)
const sessionActions = SessionActions(ddpClient, {
  'connectActions': connectActions
})
const stationActions = StationActions(ddpClient)
const teamActions = TeamActions(ddpClient)
const messageActions = MessageActions(ddpClient)
const purveyorActions = PurveyorActions(ddpClient)

function connectApp(){
  return (dispatch) => {
    //--------------------------------------
    // Execute pre-connect actions
    //--------------------------------------

    dispatch(sessionActions.resetSessionVersion());
    dispatch(messageActions.resetMessages());
    dispatch(stationActions.resetStations());
    // dispatch(uiActions.resetUI()); //NOTE: why doesnt this work?
    // dispatch(teamActions.fetchTeams());
    dispatch(purveyorActions.resetPurveyors());

    //--------------------------------------
    // Bind app events
    //--------------------------------------

    dispatch(uiActions.bindKeyboard());

    //--------------------------------------
    // Connect DDP
    //--------------------------------------

    dispatch(connectActions.connectDDP({
      'uiActions': uiActions,
      'sessionActions': sessionActions,
      'stationActions': stationActions,
      'teamActions': teamActions,
      'messageActions': messageActions,
      'purveyorActions': purveyorActions
    }));
  }
}

export default Object.assign({
    'connectApp': connectApp,
  },
  connectActions,
  uiActions,
  sessionActions,
  teamActions,
  stationActions,
  messageActions,
  purveyorActions
)
