import _ from 'lodash';
import {
  RESET_CONTACTS,
  GET_CONTACTS,
  RECEIVE_CONTACTS,
} from '../actions';

const initialState = {
  contacts: {
    data: [],
    contactsPermissionDenied: null,
    isFetching: false,
    lastUpdated: null
  }
};

function contacts(state = initialState.contacts, action) {
  switch (action.type) {
  // reset the contacts
  case RESET_CONTACTS:
    return Object.assign({}, initialState.contacts);

  // reset the contacts
  case GET_CONTACTS:
    return Object.assign({}, state, {
      isFetching: action.isFetching,
    });

  // receive the contacts
  case RECEIVE_CONTACTS:
    const contacts = _.sortBy(action.contacts, 'firstName')
    return Object.assign({}, state, {
      data: contacts,
      contactsPermissionDenied: action.contactsPermissionDenied,
      isFetching: false,
      lastUpdated: (new Date()).getTime()
    });

  // everything else
  default:
    return state;
  }
}

const contactReducers = {
  'contacts': contacts
}

export default contactReducers
