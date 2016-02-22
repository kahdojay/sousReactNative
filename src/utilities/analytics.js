import Tokens from '../secrets';

// store/index.js
import mixpanel from 'rn-redux-mixpanel'
import * as ActionTypes from '../actions/actionTypes'
import s from 'underscore.string'
import blacklist from './analyticsBlacklist'

// Export configured mixpanel redux middleware
export default mixpanel({

  // add ignore action filter
  ignoreAction: (action) => {
    return blacklist.indexOf(action.type) > -1;
  },

  // Mixpanel Token
  token: Tokens.MIXPANEL_TOKEN,

  // derive Mixpanel event name from action and/or state
  selectEventName: (action, state) => {
    return s.humanize(action.type)
  },

  // Per-action selector: Mixpanel event `distinct_id`
  selectDistinctId: (action, state) => {
    if (state.session && state.session.userId) {
      return state.session.userId
    }
  },

  // Per-action selector: Mixpanel Engage user profile data
  selectUserProfileData: (action, state) => {
    const user = action.user

    // Only update user profile data on REGISTER_SESSION action type
    if (ActionTypes.REGISTER_SESSION === action.type && state.session) {
      // User data to `$set` via Mixpanel Engage request
      const userProfileData = {
        '$first_name': state.session.firstName,
        '$last_name': state.session.lastName,
        '$email': state.session.email,
        '$created': state.session.createdAt,
        'phoneNumber': state.session.username,
      }

      return userProfileData
    } else if(ActionTypes.REGISTER_INSTALLATION === action.type && state.connect) {
      const userProfileSettingsData = {
        'settings__appBuildNumber': state.connect.settings.appBuildNumber,
        'settings__appVersion': state.connect.settings.appVersion,
        'settings__deviceName': state.connect.settings.deviceName,
        'settings__model': state.connect.settings.model,
        'settings__systemName': state.connect.settings.systemName,
        'settings__systemVersion': state.connect.settings.systemVersion,
      }
      return userProfileSettingsData
    }
  },
})
