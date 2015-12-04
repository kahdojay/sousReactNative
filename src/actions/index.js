import ConnectActions from './connect'
import UIActions from './ui'
import SessionActions from './session'
import TeamActions from './team'
import MessageActions from './message'
import PurveyorActions from './purveyor'
import ProductActions from './product'
import CategoryActions from './category'
import ErrorActions from './error'
import ddpClient from '../utilities/ddpClient'

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
    dispatch(teamActions.resetTeams());
    // dispatch(uiActions.resetUI()); //NOTE: why doesnt this work?
    // dispatch(messageActions.resetMessages());
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
      'categoryActions': categoryActions,
      'productActions': productActions,
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
