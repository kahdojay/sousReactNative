import Shortid from 'shortid'

function generateId (len = 17) {

  let id = '';
  id += Shortid.generate();
  id += Shortid.generate();
  if(id.length < len){
    id += Shortid.generate();
  }
  let tempId = '';
  if(id.indexOf('-') !== -1){
    tempId = Shortid.generate();
    id = id.replace(/-/g, tempId[Math.floor(Math.random()*tempId.length)])
  }
  if(id.indexOf('_') !== -1){
    tempId = Shortid.generate();
    id = id.replace(/_/g, tempId[Math.floor(Math.random()*tempId.length)])
  }
  return id.substring(0, len);
}

export default {
  'generateId': generateId
}
