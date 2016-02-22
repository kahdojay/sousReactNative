import Tokens from '../secrets';

// store/index.js
import mixpanel from 'rn-redux-mixpanel'
import * as ActionTypes from '../actions/actionTypes'
import humanize from 'underscore.string'

// define a blacklist to be used in the ignoreAction filter
const blacklist = [
  ActionTypes.INIT_PERSISTENCE,
  ActionTypes.HYDRATE,
  ActionTypes.SESSION_ACTIVITY,
  ActionTypes.RECEIVE_PRODUCTS,
];

// Export configured mixpanel redux middleware
export default mixpanel({

  // add ignore action filter
  ignoreAction: (action) => {
    return blacklist.indexOf(action.type) > -1;
  },

  // Mixpanel Token
  token: Tokens.MIXPANEL_TOKEN,

  // derive Mixpanel event name from action and/or state
  selectEventName: (action, state) => humanize(action.type),

  // Per-action selector: Mixpanel event `distinct_id`
  selectDistinctId: (action, state) => {
    if (state.session && state.session.userId) {
      return state.session.userId
    } else if (ActionTypes.SIGN_IN === action.type && action.user) {
      return action.user._id
    }
  },

  // Per-action selector: Mixpanel Engage user profile data
  selectUserProfileData: (action, state) => {
    const user = action.user

    // Only update user profile data on SIGN_IN action type
    if (ActionTypes.SIGN_IN === action.type && user) {
      // User data to `$set` via Mixpanel Engage request
      const userProfileData = {
        '$first_name': user['first_name'],
        '$last_name': user['last_name'],
        '$email': user['email_address'],
        '$created': user['date_created'],
      }

      return userProfileData
    }
  },
})
