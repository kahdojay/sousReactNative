import React from 'react-native';
import Colors from './colors';
import { Icon } from 'react-native-icons';

const {
  View,
  Text,
  StyleSheet,
} = React;

function formatMessage(msg, messageLength = null) {
  let messageString = <View />;
  let message = msg.message;
  if (msg.type === 'taskCompletion') {
    const preMessage = `${msg.author} completed`
    if(messageLength !== null){
      messageLength = messageLength - (preMessage.length)
      if(message.length > messageLength){
        message = message.substring(0, messageLength) + '...'
      }
    }
    messageString = (
      <Text style={styles.messageText}>{preMessage}
        <Text style={{fontWeight: 'bold'}}> {message}</Text>
      </Text>
    );
  } else if (msg.type === 'order') {
    messageString = (
      <Text style={styles.messageText}>Order sent to
        <Text style={{fontWeight: 'bold'}}> {msg.purveyor}</Text>
      </Text>
    );
  } else if (msg.type === 'orderConfirmation') {
    messageString = (
      <Text>
        <Text style={styles.messageText}>
          <Text style={{fontWeight: 'bold'}}>{msg.purveyor} </Text>
          order checked in.
        </Text>
        { message !== '' ?
          <Text style={styles.messageText}>
            {' '}
            <Text style={{color: Colors.gold, fontStyle: 'italic'}}>Note:</Text>
            {' '}
            {message}
          </Text>
        : null }
      </Text>
    );
  } else {
    if(messageLength !== null && message.length > messageLength){
      message = message.substring(0, messageLength) + '...'
    }
    messageString = (
      <Text style={styles.messageText}>{message}</Text>
    );
  }
  return messageString
}

const styles = StyleSheet.create({
  messageText: {
    fontSize: 14,
    fontFamily: 'OpenSans',
    marginLeft: 5,
    marginBottom: 10
  },
});

export default {
  'formatMessage': formatMessage
}
