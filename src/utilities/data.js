
function validateEmailAddress(email){
  if(email !== '' && email !== null){
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  return false;
}

function formatPhoneNumber(contactNumber) {
  let newNumber = contactNumber
  if(newNumber){
    let pat = /(\(|\)|\s|\-)/g
    newNumber = contactNumber.replace(pat, '').toString()
    if (newNumber.length > 10){
      const originalPhoneNumber = newNumber
      newNumber = newNumber.slice(-10)
      const prefix = `${originalPhoneNumber.replace(newNumber, '')}`
      newNumber = `${prefix} ${splitPhoneNumber(newNumber)}`
    } else {
      newNumber = splitPhoneNumber(newNumber)
    }
  }
  return newNumber
}

function splitPhoneNumber(phoneNumber){
  return phoneNumber.slice(0,3) + '.' + phoneNumber.slice(3,6) + '.' + phoneNumber.slice(6,10)
}

export default {
  'validateEmailAddress': validateEmailAddress,
  'formatPhoneNumber': formatPhoneNumber,
}
