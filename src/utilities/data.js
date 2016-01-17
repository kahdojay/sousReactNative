
function validateEmailAddress(email){
  if(email !== '' && email !== null){
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  return false;
}

function formatPhoneNumber(contactNumber) {
  let pat = /(\(|\)|\s|\-)/g
  let newNumber = contactNumber.replace(pat, '')
  if (newNumber.toString().length === 10)
    newNumber = newNumber.slice(0,3) + '.' + newNumber.slice(3,6) + '.' + newNumber.slice(6,10)
  return newNumber
}

export default {
  'validateEmailAddress': validateEmailAddress,
  'formatPhoneNumber': formatPhoneNumber,
}
