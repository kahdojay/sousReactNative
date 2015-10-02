import { ADD_STATION } from './actionTypes'

function addStation(name) {
  return {
    type: ADD_STATION,
    name: name
  };
}

export default {
  ADD_STATION,
  addStation
}
