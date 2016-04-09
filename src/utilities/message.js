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
        {msg.hasOwnProperty('orderId') === true && msg.orderId ? (
          <Text style={{fontSize: 11}}>
            {'\n'}
            <Text style={{color: Colors.lightBlue}}>View Order Details</Text>
          </Text>
        ) : <Text style={{fontSize: 11}}>{'\n'}</Text>}
      </Text>
    );
    if (messageLength !== null)
      messageString = (
        <Text>Order sent to
          <Text style={{fontWeight: 'bold'}}> {msg.purveyor}</Text>
        </Text>
      )
  } else if (msg.type === 'orderConfirmation') {
    messageString = (
        <Text style={styles.messageText}>
          <Text style={{fontWeight: 'bold'}}>{msg.purveyor} </Text>
          order received.
          {'\n'}
          { message !== '' ?
            <Text style={{fontSize: 13}}>
              (<Text style={{fontStyle: 'italic', color: Colors.gold}}>Note:</Text>
              {' '}
              {message})
              {'\n'}
            </Text>
          : null }
          <Text style={{color: Colors.lightBlue, fontSize: 11}}>View Order Details</Text>
        </Text>
    );
    if (messageLength !== null)
      messageString = (
        <Text>
          <Text style={{fontWeight: 'bold'}}>{msg.purveyor} </Text>
          order received.
        </Text>
      )
  } else if (msg.type === 'welcome') {
    messageString = (
      <Text style={styles.welcomeTextContainer}>
        <Text style={styles.welcomeText}>
          Welcome to Sous! If you haven't already, you can setup your <Text style={{fontWeight: 'bold'}}>Order Guide</Text> by accessing the menu or contacting us.{'\n\n'}
        </Text>
        <Text style={styles.welcomeText}>
          You can communicate with your team here. Orders placed/received will appear here as well.{'\n\n'}
        </Text>
        <Text style={styles.welcomeText}>
          If you have any questions or feedback, message us here, or e-mail us at <Text style={{fontWeight: 'bold'}}> sous@sousapp.com </Text>
        </Text>
      </Text>
    );
    if (messageLength !== null)
      messageString = <Text>Welcome to Sous!</Text>
  } else if (msg.type === 'demo-welcome') {
    messageString = (
      <Text style={styles.welcomeTextContainer}>
        <Text style={styles.welcomeText}>
          Welcome to Sous! We've created this Demo Team for you to explore.{'\n\n'}
        </Text>
        {/*<Text style={styles.welcomeText}>
          This is your Team Feed - use this space to communicate with your team. Add members by tapping the invite button within <Text style={{fontWeight: 'bold'}}>Team Members</Text>.{'\n\n'}
        </Text>*/}
        <Text style={styles.welcomeText}>
          Feel free to create and submit dummy orders (don't worry, they won't go to anybody).{'\n\n'}
        </Text>
        <Text style={styles.welcomeText}>
          If you haven't already, you can setup your <Text style={{fontWeight: 'bold'}}>Order Guide</Text> by accessing the menu, or simply message us here or email us at sous@sousapp.com.
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
    fontFamily: 'OpenSans',
    fontSize: 15,
    marginLeft: 5,
    marginBottom: 5
  },
  welcomeTextContainer: {
    fontFamily: 'OpenSans',
    fontSize: 15,
    marginLeft: 5,
    marginBottom: 5,
  },
});

export default {
  'formatMessage': formatMessage,
}
