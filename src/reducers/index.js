import { combineReducers } from 'redux';
import cartItem from './cartItem';
import category from './category';
import connect from './connect';
import contact from './contact';
import error from './error';
import message from './message';
import order from './order';
import product from './product';
import purveyor from './purveyor';
import session from './session';
import team from './team';

const reducers = combineReducers(Object.assign(
  {},
  connect,
  contact,
  team,
  session,
  message,
  purveyor,
  product,
  category,
  error,
  order,
  cartItem,
));

export default reducers;
