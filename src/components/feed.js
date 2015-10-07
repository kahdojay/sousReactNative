var { Icon, } = require('react-native-icons');
const React = require('react-native');
const AddMessageForm = require('./addMessageForm');
import { mainBackgroundColor } from '../utilities/colors';
// import MessageRow from './messageIndexRow';

const {
  ActivityIndicatorIOS,
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableHighlight,
  PropTypes,
} = React;

class Feed extends React.Component {
  render() {
    const { messages } = this.props;
    // let fetching =  <ActivityIndicatorIOS
    //                     animating={true}
    //                     color={'#808080'}
    //                     size={'small'} />

    // add the messages for listing
    let messagesList = [];
    let messageKeys = Object.keys(messages.data);
    messageKeys.forEach((messageKey) => {
      let message = messages.data[messageKey];
      messagesList.push(
        // <MessageRow
        //   key={messageKey} // just for React, not visible as prop in child
        //   message={message}
        //   tasks={tasks}
        //   onPress={() => this.props.navigator.push({
        //     name: 'StationView',
        //     messageKey: message.key
        //   })}
        // />
        <View key={message.key}><Text>{message.key} - {message.message}</Text></View>
      )
    })

    return (
      <View style={styles.container}>
        <View style={styles.messageContainer}>
          {messages.isFetching ? fetching : <View/>}
          <ScrollView
            style={styles.scrollView}
            contentInset={{bottom:49}}
            automaticallyAdjustContentInsets={false}
            >
            { messagesList }
          </ScrollView>
          <AddMessageForm placeholder="Message..." onSubmit={this.props.onSendMessage.bind(this)}/>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageContainer: {
    flex: 14
  },
  scrollView: {
    backgroundColor: '#f7f7f7',
    height: 500,
    paddingLeft: 20,
    paddingRight: 0,
    marginTop: 0,
    paddingTop: 0
  },
});

Feed.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
};

module.exports = Feed;
