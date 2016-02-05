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

let allActions = {}
const connectActions = ConnectActions(ddpClient)
allActions['connectActions'] = connectActions

const errorActions = ErrorActions(allActions)
allActions['errorActions'] = errorActions

// const uiActions = UIActions(ddpClient)
const sessionActions = SessionActions(allActions)
allActions['sessionActions'] = sessionActions

const messageActions = MessageActions(allActions)
allActions['messageActions'] = messageActions

const categoryActions = CategoryActions(allActions)
allActions['categoryActions'] = categoryActions

const productActions = ProductActions(allActions)
allActions['productActions'] = productActions

const purveyorActions = PurveyorActions(allActions)
allActions['purveyorActions'] = purveyorActions

const cartItemActions = CartItemActions(allActions)
allActions['cartItemActions'] = cartItemActions

const orderActions = OrderActions(allActions)
allActions['orderActions'] = orderActions

const teamActions = TeamActions(allActions)
allActions['teamActions'] = teamActions

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
      // dispatch(cartItemActions.resetCartItems());
      // dispatch(purveyorActions.resetPurveyors());
    }

    //--------------------------------------
    // Bind app events
    //--------------------------------------

    // dispatch(uiActions.bindKeyboard());

    //--------------------------------------
    // Connect DDP
    //--------------------------------------

    dispatch(connectActions.connectDDP(allActions));
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
