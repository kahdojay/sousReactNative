import CartItemActions from './cartItem';
import CategoryActions from './category';
import ConnectActions from './connect';
import ContactActions from './contact';
import ErrorActions from './error';
import MessageActions from './message';
import OrderActions from './order';
import ProductActions from './product';
import PurveyorActions from './purveyor';
import SessionActions from './session';
import TeamActions from './team';
import ddpClient from '../utilities/ddpClient';

let allActions = {}
const connectActions = ConnectActions(ddpClient)
allActions['connectActions'] = connectActions

const contactActions = ContactActions(allActions)
allActions['contactActions'] = contactActions

const errorActions = ErrorActions(allActions)
allActions['errorActions'] = errorActions

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
    // Connect DDP
    //--------------------------------------

    dispatch(connectActions.connectDDP(allActions));
  }
}

export default Object.assign(
  {'connectApp': connectApp},
  cartItemActions,
  categoryActions,
  connectActions,
  contactActions,
  errorActions,
  messageActions,
  orderActions,
  productActions,
  purveyorActions,
  sessionActions,
  teamActions,
)
