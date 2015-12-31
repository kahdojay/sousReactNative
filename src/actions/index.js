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
import CartItemActions from './cartItem';
import ddpClient from '../utilities/ddpClient';

const connectActions = ConnectActions(ddpClient)

const errorActions = ErrorActions({
  'connectActions': connectActions,
})
// const uiActions = UIActions(ddpClient)
const sessionActions = SessionActions({
  'connectActions': connectActions,
})
const messageActions = MessageActions({
  'connectActions': connectActions,
})
const categoryActions = CategoryActions({
  'connectActions': connectActions,
})
const productActions = ProductActions({
  'connectActions': connectActions,
  'categoryActions': categoryActions
})
const purveyorActions = PurveyorActions({
  'connectActions': connectActions,
  'messageActions': messageActions,
})
const orderActions = OrderActions({
  'connectActions': connectActions,
})
const cartItemActions = CartItemActions({
  'connectActions': connectActions,
})
const teamActions = TeamActions({
  'connectActions': connectActions,
  'sessionActions': sessionActions,
  'messageActions': messageActions,
  'cartItemActions': cartItemActions,
})

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
      'orderActions': orderActions,
      'cartItemActions': cartItemActions,
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
  cartItemActions,
)
