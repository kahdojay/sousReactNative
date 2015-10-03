import { RESET_SESSION, REQUEST_SESSION, RECEIVE_SESSION, ERROR_SESSION } from './actionTypes'

// function validateSession() {
//   return (dispatch, getState) => {
//     let session = getState()
//     return dispatch(fetchSession(sessionParams))
//   }
// }
function resetSession() {
  return {
    type: RESET_SESSION
  }
}
function fetchSession(sessionParams) {
  return (dispatch) => {
    dispatch(requestSession())
    const url = 'http://localhost:3000/api/1/sessions'
    return fetch(url, {
        method: 'POST',
        headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionParams)
      })
      .then(res => res.json())
      .then(res => {
        console.log('server response', res)
        if (res.success === false)
          dispatch(errorSession(sessionParams.email, res.errors))
        else
          dispatch(receiveSession(sessionParams.email, res.token))
      })
  }
}

function requestSession() {
  return {
    type: REQUEST_SESSION,
  };
}

function receiveSession(login, token) {
  return {
    type: RECEIVE_SESSION,
    token: token,
    login: login,
    receivedAt: (new Date).getTime()
  };
}

function errorSession(login, errors) {
  return {
    type: ERROR_SESSION,
    login: login,
    errors: errors
  }
}

function createSession(sessionParams) {
  return (dispatch, getState) => {
    return dispatch(fetchSession(sessionParams))
  }
}

// note: expose other action creators for testing
export default {
  RESET_SESSION,
  REQUEST_SESSION, 
  RECEIVE_SESSION,
  ERROR_SESSION,
  // validateSession,
  createSession,
  resetSession
}