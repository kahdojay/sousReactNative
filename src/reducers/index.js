import { combineReducers } from 'redux';
import connect from './connect'
import ui from './ui'
import team from './team'
import session from './session'
import message from './message'
import purveyor from './purveyor'
import product from './product'
import category from './category'
import error from './error'
import order from './order'

const reducers = combineReducers(Object.assign(
  {},
  connect,
  ui,
  team,
  session,
  message,
  purveyor,
  product,
  category,
  error,
  order
));

export default reducers;
