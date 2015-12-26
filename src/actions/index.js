import ConnectActions from './connect';
// import UIActions from './ui';
import SessionActions from './session';
import TeamActions from './team';
import MessageActions from './message';
import PurveyorActions from './purveyor';
import ProductActions from './product';
import CategoryActions from './category';
import ErrorActions from './error';
import OrderActions from './order';
import ddpClient from '../utilities/ddpClient';

const errorActions = ErrorActions(ddpClient)
const connectActions = ConnectActions(ddpClient)
// const uiActions = UIActions(ddpClient)
const sessionActions = SessionActions(ddpClient, {
  'connectActions': connectActions
})
const messageActions = MessageActions(ddpClient)
const teamActions = TeamActions(ddpClient, {
  'sessionActions': sessionActions,
  'connectActions': connectActions,
  'messageActions': messageActions
})
const categoryActions = CategoryActions(ddpClient)
const productActions = ProductActions(ddpClient, {
  'categoryActions': categoryActions
})
const purveyorActions = PurveyorActions(ddpClient)
const orderActions = OrderActions(ddpClient)

function connectApp(){
  return (dispatch, getState) => {
    const {connect} = getState()
    //--------------------------------------
    // Execute pre-connect actions
    //--------------------------------------

    if(connect.status === connectActions.CONNECT.CONNECTED){
      // dispatch(sessionActions.resetSession());
      dispatch(sessionActions.resetSessionVersion());
      dispatch(messageActions.resetMessages());
      // dispatch(purveyorActions.resetPurveyors());
    }

    //--------------------------------------
    // Bind app events
    //--------------------------------------

    // dispatch(uiActions.bindKeyboard());

    //--------------------------------------
    // Connect DDP
    //--------------------------------------

    dispatch(connectActions.connectDDP({
      // 'uiActions': uiActions,
      'sessionActions': sessionActions,
      'teamActions': teamActions,
      'messageActions': messageActions,
      'purveyorActions': purveyorActions,
      'categoryActions': categoryActions,
      'productActions': productActions,
      'errorActions': errorActions,
      'orderActions': orderActions
    }));
  }
}

export default Object.assign(
  {'connectApp': connectApp},
  connectActions,
  // uiActions,
  sessionActions,
  teamActions,
  messageActions,
  purveyorActions,
  productActions,
  categoryActions,
  errorActions,
  orderActions,
)
