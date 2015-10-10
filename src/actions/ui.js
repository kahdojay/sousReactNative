import { DeviceEventEmitter } from 'react-native'
import {
  KEYBOARD_WILL_SHOW,
  KEYBOARD_WILL_HIDE
} from './actionTypes'

export default function UIActions(ddpClient) {

  function bindKeyboard(){
    return (dispatch, getState) => {
      let ui = getState().ui;
      DeviceEventEmitter.addListener('keyboardWillShow', (e) => {
        // console.log('goes from: ', e.startCoordinates.screenY, ' to: ', e.endCoordinates.screenY);
        let delta = e.startCoordinates.screenY - e.endCoordinates.screenY;
        let marginBottom = 0;
        if(ui.keyboard.marginBottom > 0){
          marginBottom += delta;
        } else {
          marginBottom = delta;
        }
        dispatch({
          type: KEYBOARD_WILL_SHOW,
          marginBottom: marginBottom
        })
      })
      DeviceEventEmitter.addListener('keyboardWillHide', (e) => {
        // console.log('goes from: ', e.startCoordinates.screenY, ' to: ', e.endCoordinates.screenY);
        // TODO: fix the delta if switching between inputs turns the autocomplete off
        dispatch({
          type: KEYBOARD_WILL_HIDE,
          marginBottom: 0
        })
      })
    }
  }

  return {
    KEYBOARD_WILL_SHOW,
    KEYBOARD_WILL_HIDE,
    bindKeyboard,
  }
}
