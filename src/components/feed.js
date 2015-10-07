var { Icon, } = require('react-native-icons');
var DDPClient = require("ddp-client");
const React = require('react-native');
const AddMessageForm = require('./addMessageForm');
import { mainBackgroundColor } from '../utilities/colors';
import InvertibleScrollView from 'react-native-invertible-scroll-view';

const {
  ActivityIndicatorIOS,
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableHighlight,
  PropTypes,
} = React;

class Feed extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
    }
  }
  componentDidMount(){
    var self = this;
    this.ddpClient = new DDPClient({url: 'ws://sous-chat.meteor.com/websocket'});

    this.ddpClient.connect(() => {
      this.ddpClient.subscribe('messages', ['sous']);
    });

    // observe the lists collection
    var observer = this.ddpClient.observe("messages");
    observer.added = function(msg) {console.log("NEW MSG", ddpClient.collections.messages)}
    observer.changed = () => console.log("CHANGED");
    observer.removed = () => this.updateRows(_.cloneDeep(_.values(ddpClient.collections.messages)));
    this.ddpClient.on('message', function(msg) {
      var message = JSON.parse(msg);
      if (message.fields){
        var {messages} = self.state;
        messages.push(message.fields);
        self.setState({messages: messages})
        self.scrollToBottom()
      }
    });
  }

  scrollToBottom() {
    this.refs.scrollview.scrollTo(0)
  }

  render() {
    let { messages } = this.state;
    let messagesList = messages.map(function(msg, index) {
      let date = new Date(msg.createdAt["$date"]).toLocaleTimeString();
      let time = date.substring(date.length-3, date.length)
      return (
        <View key={index} style={styles.message}>
          <Image style={styles.avatar}
            source={{uri: msg.imageUrl}}
            />
          <View style={styles.messageContentContainer}>
            <View style={styles.messageTextContainer}>
              <Text style={styles.messageAuthor}>{msg.author}</Text>
              <Text style={styles.messageTimestamp}>
                {date.substring(0, date.length-5)}{time}
              </Text>
            </View>
            <Text style={styles.messageText} key={index}>{msg.message}</Text>
          </View>
        </View>
      )
    }).reverse(); // reverse messages here because we use InvertedScrollView

    return (
      <View style={styles.container}>
        <View style={styles.messageContainer}>
          {messages.isFetching ? fetching : <View/>}
          <InvertibleScrollView
            style={styles.scrollView}
            contentInset={{bottom:49}}
            automaticallyAdjustContentInsets={false}
            inverted
            ref='scrollview'
          >
            { messagesList }
          </InvertibleScrollView>
        <AddMessageForm
          placeholder="Message..."
          onSubmit={(msg) => {
            this.scrollToBottom()
            this.ddpClient.call('createMessage', [{
              author: this.props.userEmail,
              message: msg
            }])
          }}
        />
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  message: {
    flexDirection: 'row'
  },
  messageText: {
    fontSize: 18,
    fontFamily: 'OpenSans',
    marginLeft: 5,
    marginBottom: 12
  },
  messageContentContainer: {
    flex: 5
  },
  messageTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch'
  },
  messageAuthor: {
    fontSize: 18,
    margin: 5,
    fontWeight: 'bold',
    fontFamily: 'OpenSans',
  },
  messageTimestamp: {
    fontSize: 14,
    fontFamily: 'OpenSans',
    marginTop: 9,
    marginLeft: 10,
    color: "#777"
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    margin: 7,
    flex: 1
  },
  container: {
    flex: 1,
  },
  messageContainer: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: 'white',
    flex: 1,
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
