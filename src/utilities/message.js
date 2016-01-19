import React from 'react-native';
import Colors from './colors';
import { Icon } from 'react-native-icons';

const {
  View,
  StyleSheet,
  Text,
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
        {'\n'}
        <Text style={{color: 'blue'}}>View Order Details</Text>
      </Text>
    );
  } else if (msg.type === 'orderConfirmation') {
    messageString = (
        <Text style={styles.messageText}>
          <Text style={{fontWeight: 'bold'}}>{msg.purveyor} </Text>
          order received.
          {'\n'}
          <Text style={{color: 'blue'}}>View Order Details</Text>
          { message !== '' ?
            <Text>
              {'\n'}
              <Text style={{fontStyle: 'italic'}}>Note:</Text>
              {' '}
              {message}
            </Text>
          : null }
        </Text>
    );
    if (messageLength !== null)
      messageString = <Text><Text style={{fontWeight: 'bold'}}>{msg.purveyor} </Text>
        order received.</Text>
  } else if (msg.type === 'welcome') {
    messageString = (
      <Text style={styles.welcomeTextContainer}>
        <Text style={styles.welcomeText}>
          Welcome to Sous! If your haven't already uploaded your <Text style={{fontWeight: 'bold'}}>order guide</Text>, we can help you set it up.{'\n\n'}
        </Text>
        <Text style={styles.welcomeText}>
          When an order is placed, it will notify the team in this window.  You can also use this space to send messages to your team - tap <Text style={{fontWeight: 'bold'}}>Team Members</Text> on the navigation bar to see who's using the app.{'\n\n'}
        </Text>
        <Text style={styles.welcomeText}>
          Finally, you can contact us at Sous Support <Text style={{fontWeight: 'bold'}}>24/7</Text> with any issues you may have.
          Feel free to message us in the app, and feel free to e-mail us at
          <Text style={{fontWeight: 'bold'}}> sous@sousapp.com </Text>
          with any advice on how we can improve.
        </Text>
      </Text>
    );
    if (messageLength !== null)
      messageString = <Text>Welcome to Sous!</Text>
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
    fontSize: 16,
    marginLeft: 5,
    marginBottom: 5
  },
  welcomeTextContainer: {
    fontSize: 16,
    marginLeft: 5,
    marginBottom: 5,
  },
});

export default {
  'formatMessage': formatMessage,
}
