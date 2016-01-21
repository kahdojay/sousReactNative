
function validateEmailAddress(email){
  if(email !== '' && email !== null){
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  return false;
}

function formatPhoneNumber(contactNumber) {
  let pat = /(\(|\)|\s|\-)/g
  let newNumber = contactNumber.replace(pat, '').toString()
  if (newNumber.length === 10){
    newNumber = newNumber.slice(0,3) + '.' + newNumber.slice(3,6) + '.' + newNumber.slice(6,10)
  } else if (newNumber.length === 11 && newNumber[0] === '1') {
    newNumber = newNumber.slice(0,1) + '.' + newNumber.slice(1,4) + '.' + newNumber.slice(4,7) + '.' + newNumber.slice(7,11)
  }
  return newNumber
}

export default {
  'validateEmailAddress': validateEmailAddress,
  'formatPhoneNumber': formatPhoneNumber,
}
