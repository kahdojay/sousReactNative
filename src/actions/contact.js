import AddressBook from 'react-native-addressbook';
import {
  RESET_CONTACTS,
  GET_CONTACTS,
  RECEIVE_CONTACTS,
} from './actionTypes'

export default function ContactActions(allActions){

  function resetContacts(){
    return {
      type: RESET_CONTACTS,
    }
  }

  function getContacts() {
    return (dispatch, getState) => {
      AddressBook.getContacts( (err, addressBookContacts) => {
        let denied = false
        let contacts = []
        if (err && err.type === 'permissionDenied'){
          denied = true
        } else {
          contacts = addressBookContacts
        }
        dispatch(receiveContacts(contacts, denied))
      })
      return dispatch({
        type: GET_CONTACTS,
        isFetching: true,
      })
    }
  }

  function receiveContacts(contacts, contactsPermissionDenied) {
    return {
      type: RECEIVE_CONTACTS,
      contacts: contacts,
      contactsPermissionDenied: contactsPermissionDenied,
    }
  }

  return {
    RESET_CONTACTS,
    GET_CONTACTS,
    RECEIVE_CONTACTS,
    getContacts,
    resetContacts,
    receiveContacts
  }
}
