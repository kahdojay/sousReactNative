import React from 'react-native';
import { Icon } from 'react-native-icons';

const {
  Image,
  StyleSheet,
} = React;

function getAvatar(user, size = 40) {
  let avatar = null
  if(user && user.hasOwnProperty('imageUrl') === true && user.imageUrl){
    let avatarUrl = user.imageUrl;
    let imageChangedAt = user.hasOwnProperty('imageChangedAt') === true ? user.imageChangedAt : null;

    if(avatarUrl.indexOf('data:image') === -1 && imageChangedAt !== null){
      avatarUrl = `${user.imageUrl}?cb=${imageChangedAt}`
    }

    avatar = (
      <Image
        source={{uri: avatarUrl}}
        resizeMode={'contain'}
        style={{
          width: size,
          height: size,
          borderRadius: (size/2),
        }}
      />
    )
  }else{
    avatar =(
      <Icon name='material|account-circle' size={size} color='#aaa' style={{
        width: size,
        height: size,
        borderRadius: (size/2),
      }}/>
    )
  }
  return avatar;
}

const styles = StyleSheet.create({
})

export default {
  'getAvatar': getAvatar
}
