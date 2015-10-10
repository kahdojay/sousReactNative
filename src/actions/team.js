import murmurhash from 'murmurhash'
import Fetcher from '../utilities/fetcher'
import {
  GET_TEAMS,
  REQUEST_TEAMS,
  RECEIVE_TEAMS,
  ERROR_TEAMS,
  ADD_TEAM,
  DELETE_TEAM
} from './actionTypes'

let SousFetcher = null;

function getTeams(){
  return {
    type: GET_TEAMS
  }
}

function addTeam(name, newKey) {
  return (dispatch, getState) => {
    // kick back if team name is empty
    if(name === ''){
      return dispatch(getTeams())
    }
    let state = getState()
    let newTeam = {}
    let newKey = newKey || murmurhash.v3(name).toString(16)
    newTeam[newKey] = {
      id: null,
      key: newKey,
      name: name,
      created_at: (new Date).toISOString(),
      update_at: (new Date).toISOString()
    }
    SousFetcher.team.create(newTeam)
    return {
      type: ADD_TEAM,
      team: newTeam
    };
  }
}

function deleteTeam(teamId) {
  return {
    type: DELETE_TEAM,
    teamId: teamId
  }
}

function requestTeams() {
  return {
    type: REQUEST_TEAMS
  }
}

function receiveTeams(teams) {
  return {
    type: RECEIVE_TEAMS,
    teams: teams
  }
}

function errorTeams(errors){
  return {
    type: ERROR_TEAMS,
    errors: errors
  }
}

function fetchTeams(){
  return (dispatch, getState) => {
    let state = getState()
    // this is need to access the session.token
    SousFetcher = new Fetcher(state)
    dispatch(requestTeams())
    return SousFetcher.team.find().then(res => {
      if (res.success === false) {
        dispatch(errorTeams(res.errors))
      } else {
        dispatch(receiveTeams(res))
      }
    })
  }
}

export default function TeamActions(){
  return {
    GET_TEAMS,
    REQUEST_TEAMS,
    RECEIVE_TEAMS,
    ERROR_TEAMS,
    ADD_TEAM,
    DELETE_TEAM,
    getTeams,
    fetchTeams,
    addTeam,
    deleteTeam
  }
}
