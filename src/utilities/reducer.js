import _ from 'lodash'

function getIdx(currentDataState, findId){
  // console.log('getIdx currentDataState: ', currentDataState)
  return _.findIndex(currentDataState, (item, idx) => {
    // console.log('getIdx item: ', item)
    if (item !== undefined) {
      return item.id === findId;
    } else {
      return false
    }
  });
}

function updateByIdx(currentDataState, idx, attributes){
  if(idx === -1){
    currentDataState.push(attributes);
  } else {
    currentDataState = [
      ...currentDataState.slice(0, idx),
      Object.assign({}, currentDataState[idx], attributes),
      ...currentDataState.slice(idx + 1)
    ]
  }
  return currentDataState
}

function cleanupAttributes(attributes){
  // cleanup for the data passed to mongo
  if(attributes.hasOwnProperty('_id')){
    attributes.id = attributes._id;
    delete attributes._id
  }
  return attributes
}

function updateDataState(currentDataState, attributes){
  attributes = cleanupAttributes(attributes)
  if(attributes.hasOwnProperty('id') === true) {
    var idx = getIdx(currentDataState, attributes.id);
    // console.log(currentDataState, idx, attributes)
    currentDataState = updateByIdx(currentDataState, idx, attributes)
  }
  return currentDataState;
}

export default {
  'cleanupAttributes': cleanupAttributes,
  'getIdx': getIdx,
  'updateByIdx': updateByIdx,
  'updateDataState': updateDataState
}
