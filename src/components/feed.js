var { Icon, } = require('react-native-icons');
var DDPClient = require("ddp-client");
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
  constructor(props) {
    super(props)
    this.state = {
      messages: []
    }
  }
  componentDidMount(){
    var self = this;
    var ddpClient = new DDPClient({url: 'ws://sous-chat.meteor.com/websocket'});

     ddpClient.connect(function() {
       ddpClient.subscribe('messages');
     });

   // observe the lists collection
   var observer = ddpClient.observe("messages");
    observer.added = function(msg) {console.log("NEW MSG", ddpClient.collections.messages)}
    observer.changed = () => console.log("CHANGED");
    observer.removed = () => this.updateRows(_.cloneDeep(_.values(ddpClient.collections.messages)));
    ddpClient.on('message', function(msg) {
      var message = JSON.parse(msg);
      console.log(message);
      if (message.fields){
        var {messages} = self.state;
        messages.push(message.fields);
        self.setState({messages: messages})
      }
    });
  }


  updateRows(msg) {
    console.log(msg);
  }

  render() {
    let { messages } = this.state;
    // let messagesList = <View></View>
    let messagesList = messages.map(function(msg, index) {
      return <Text key={index}>{msg.message}</Text>
    });


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
