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
      <Text style={styles.messageText}>
        <Text style={{fontWeight: 'bold'}}>{msg.purveyor} </Text>
        order received.
        { message !== '' ?
          <Text>
            {'\n'}
            <Text style={{color: Colors.gold, fontStyle: 'italic'}}>Note:</Text>
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
          Welcome to Sous! If you haven’t already set up your <Text style={{fontWeight: 'bold'}}>order guide</Text>, we can help set that up.{'\n\n'}
        </Text>
        <Text style={styles.welcomeText}>
          Whenever you send a message or a purveyor order, your team gets notified here. View <Text style={{fontWeight: 'bold'}}>Team Members</Text> in the left menu to edit your team.{'\n\n'}
        </Text>
        <Text style={styles.welcomeText}>
          We’re in beta and we love feedback. Chat with us here or email <Text style={{fontWeight: 'bold'}}>sous@sousapp.com</Text> with any questions, issues, or ideas on how we can improve Sous.
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
    fontSize: 12,
    fontFamily: 'OpenSans',
    marginLeft: 5,
    marginBottom: 5
  },
  welcomeText: {
    marginVertical: 5,
  },
});

export default {
  'formatMessage': formatMessage,
}
