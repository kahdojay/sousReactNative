import slug from 'slug'
import { generateId } from '../utilities/utils'
import { getIdx } from '../utilities/reducer'
import {
  RESET_PURVEYORS,
  GET_PURVEYORS,
  REQUEST_PURVEYORS,
  RECEIVE_PURVEYORS,
  ERROR_PURVEYORS,
  ADD_PURVEYOR,
  UPDATE_PURVEYOR,
  DELETE_PURVEYOR,
  ORDER_PURVEYOR_PRODUCT
} from './actionTypes'

export default function PurveyorActions(allActions){

  const {
    connectActions,
    messageActions,
  } = allActions

  function resetPurveyors(teamId = null){
    return {
      teamId: teamId,
      type: RESET_PURVEYORS,
    }
  }

  function addPurveyor(purveyorAttributes) {
    return (dispatch, getState) => {
      const { teams, session } = getState();
      const sessionTeamId = session.teamId
      const teamIdx = getIdx(teams.data, sessionTeamId);
      const purveyorId = generateId()
      let purveyorCode = slug(purveyorAttributes.name, {
        replacement: '',
      })
      purveyorCode = purveyorCode.toUpperCase()
      var newPurveyorAttributes = {
        _id: purveyorId,
        teamId: sessionTeamId,
        purveyorCode: `${teams.data[teamIdx].teamCode}-${purveyorCode}`,
        teamCode: teams.data[teamIdx].teamCode,
        name: purveyorAttributes.name,
        company: purveyorAttributes.name,
        city: null,
        state: null,
        zipCode: null,
        timeZone: teams.data[teamIdx].timeZone,
        orderCutoffTime: '',
        orderMinimum: '',
        deliveryDays: '',
        notes: '',
        email: '',
        orderEmails: '',
        phone: '',
        orderContact: '',
        description: '',
        sendEmail: false,
        sendFax: false,
        fax: '',
        uploadToFTP: false,
        deleted: false,
      }
      dispatch({
        type: ADD_PURVEYOR,
        purveyorId: purveyorId,
        purveyor: Object.assign({}, newPurveyorAttributes, {
          id: purveyorId,
        })
      })
      dispatch(connectActions.ddpCall('createPurveyor', [Object.assign({}, newPurveyorAttributes), session.userId]))
    }
  }

  function updatePurveyor(purveyorId, purveyorAttributes){
    return (dispatch, getState) => {
      const { purveyors, session } = getState();
      const sessionTeamId = session.teamId;
      if(purveyors.teams.hasOwnProperty(sessionTeamId) === true){
        if(purveyors.teams[sessionTeamId].hasOwnProperty(purveyorId) === true){
          dispatch({
            type: UPDATE_PURVEYOR,
            purveyorId: purveyorId,
            purveyor: Object.assign({}, purveyors.teams[sessionTeamId][purveyorId], purveyorAttributes),
          })
          dispatch(connectActions.ddpCall('updatePurveyor', [purveyorId, purveyorAttributes]))
        } else {
          // dispatch(errorActions.createError('update-purveyor', 'Unable to update purveyor'))
        }
      }
    }
  }

  function deletePurveyor(purveyorId) {
    return (dispatch, getState) => {
      const { purveyors, session } = getState()
      const sessionTeamId = session.teamId;
      if(purveyors.teams.hasOwnProperty(sessionTeamId) === true){
        if(purveyors.teams[sessionTeamId].hasOwnProperty(purveyorId) === true){
          const deletePurveyorAttributes = Object.assign({}, purveyors.teams[sessionTeamId][purveyorId], {
            deleted: true,
            deletedBy: session.userId,
            deletedAt: (new Date()).toISOString(),
          })
          dispatch({
            type: DELETE_PURVEYOR,
            purveyor: deletePurveyorAttributes,
          })
          dispatch(connectActions.ddpCall('deletePurveyor', [purveyorId, deletePurveyorAttributes]))
        } else {
          // dispatch(errorActions.createError('update-category', 'Unable to update category'))
        }
      }
    }
  }

  function requestPurveyors() {
    return {
      type: REQUEST_PURVEYORS
    }
  }

  function errorPurveyors(errors){
    return {
      type: ERROR_PURVEYORS,
      errors: errors
    }
  }

  function receivePurveyors(purveyor) {
    // console.log(RECEIVE_PURVEYORS, purveyor);
    return {
      type: RECEIVE_PURVEYORS,
      purveyor: purveyor
    }
  }

  return {
    RESET_PURVEYORS,
    GET_PURVEYORS,
    REQUEST_PURVEYORS,
    RECEIVE_PURVEYORS,
    ERROR_PURVEYORS,
    ADD_PURVEYOR,
    UPDATE_PURVEYOR,
    DELETE_PURVEYOR,
    addPurveyor,
    updatePurveyor,
    deletePurveyor,
    receivePurveyors,
    resetPurveyors,
  }
}
