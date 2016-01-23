import React from 'react-native';

const {
  Image,
} = React;

function getAvatar(user, size = 40) {
  let avatar = null
  if(user && user.hasOwnProperty('imageUrl') === true && user.imageUrl){
    let avatarUrl = user.imageUrl;
    let updatedAt = user.hasOwnProperty(updatedAt) === true ? user.updatedAt : (new Date()).toISOString();

    if(avatarUrl.indexOf('data:image') === -1){
      avatarUrl = `${user.imageUrl}?cb=${updatedAt}`
    }

    avatar = (
      <Image
        source={{uri: avatarUrl}}
        style={{
          width: size,
          height: size,
          borderRadius: (size/2),
        }}
      />
    )
  }

  return avatar;
}

export default {
  'getAvatar': getAvatar
}
