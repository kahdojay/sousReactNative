import { DDP } from '../resources/apiConfig'
import DDPClient from 'ddp-client'
import ConnectActions from './connect'
import UIActions from './ui'
import SessionActions from './session'
import TeamActions from './team'
import MessageActions from './message'
import PurveyorActions from './purveyor'
import ProductActions from './product'
import CategoryActions from './category'
import ErrorActions from './error'

const ddpClient = new DDPClient({
  // host : "localhost",
  // port : 3000,
  // ssl  : false,
  autoReconnect : false, // default: true,
  // autoReconnectTimer : 500,
  maintainCollections : false, // default: true,
  // ddpVersion : '1',  // ['1', 'pre2', 'pre1'] available
  // Use a full url instead of a set of `host`, `port` and `ssl`
  url: DDP.ENDPOINT_WS,
  // socketConstructor: WebSocket // Another constructor to create new WebSockets
});

const errorActions = ErrorActions(ddpClient)
const connectActions = ConnectActions(ddpClient)
const uiActions = UIActions(ddpClient)
const sessionActions = SessionActions(ddpClient, {
  'connectActions': connectActions
})
const messageActions = MessageActions(ddpClient)
const teamActions = TeamActions(ddpClient, {
  'connectActions': connectActions,
  'messageActions': messageActions
})
const purveyorActions = PurveyorActions(ddpClient)
const productActions = ProductActions(ddpClient)
const categoryActions = CategoryActions(ddpClient)

function connectApp(){
  return (dispatch) => {
    //--------------------------------------
    // Execute pre-connect actions
    //--------------------------------------

    // dispatch(sessionActions.resetSession());
    dispatch(sessionActions.resetSessionVersion());
    // dispatch(uiActions.resetUI()); //NOTE: why doesnt this work?
    dispatch(messageActions.resetMessages());
    // dispatch(purveyorActions.resetPurveyors());

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
      'teamActions': teamActions,
      'messageActions': messageActions,
      'purveyorActions': purveyorActions,
      'errorActions': errorActions
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
  messageActions,
  purveyorActions,
  productActions,
  categoryActions,
  errorActions
)
