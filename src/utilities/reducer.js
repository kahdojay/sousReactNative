import _ from 'lodash'

function getIdx(currentDataState, findId){
  // console.log('getIdx currentDataState: ', currentDataState)
  return _.findIndex(currentDataState, (item, idx) => {
    // console.log('getIdx item: ', item)
    if (item !== undefined) {
      return item.id == findId;
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

function updateDataState(currentDataState, attributes){
  // cleanup for the data passed to mongo
  if(attributes.hasOwnProperty('_id')){
    attributes.id = attributes._id;
    delete attributes._id
  }
  if(attributes.hasOwnProperty('id') === true) {
    var idx = getIdx(currentDataState, attributes.id);
    currentDataState = updateByIdx(currentDataState, idx, attributes)
  }
  return currentDataState;
}

export default {
  'getIdx': getIdx,
  'updateByIdx': updateByIdx,
  'updateDataState': updateDataState
}
