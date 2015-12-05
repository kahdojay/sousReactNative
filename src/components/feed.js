import { Icon } from 'react-native-icons';
import React from 'react-native';
import AddMessageForm from './addMessageForm';
import { mainBackgroundColor, darkBlue } from '../utilities/colors';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
let SideMenu = require('react-native-side-menu');
import Menu from './menu';
import moment from 'moment';
const {
  ScrollView,
  ActivityIndicatorIOS,
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  PropTypes,
} = React;

// class Button extends React.Component {
//   handlePress(e) {
//     this.context.menuActions.toggle();
//     if (this.props.onPress) {
//       this.props.onPress(e);
//     }
//   }
//
//   render() {
//     return (
//       <View>
//         <TouchableOpacity
//           onPress={this.handlePress.bind(this)}
//           style={this.props.style}
//         >
//           <Text>{this.props.children}</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }
// }
//
// Button.contextTypes = {
//   menuActions: React.PropTypes.object.isRequired
// };

class Feed extends React.Component {
  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      // touchToClose: false,
      // open: false,
      lastMessageCreatedAt: null,
      messages: null,
      scrollToBottom: false,
    }
  }

  // handleOpenWithTouchToClose() {
  //   this.setState({
  //     touchToClose: true,
  //     open: true,
  //   });
  // }
  //
  // handleChange(isOpen) {
  //   if (!isOpen) {
  //     this.setState({
  //       touchToClose: false,
  //       open: false,
  //     });
  //   }
  // }

  componentWillReceiveProps(nextProps) {
    // if(this.state.lastMessageCreatedAt === null){
    //   lastMessageCreatedAt
    // }
    this.processMessages(nextProps.messages)
  }

  componentDidMount() {
    this.processMessages(this.props.messages, true)
    this.props.onGetNewMessages();
  }

  componentDidUpdate(){
    if(this.state.scrollToBottom === true){
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    if(this.refs.hasOwnProperty('scrollview')) {
      this.refs.scrollview.scrollTo(0)
    }
  }

  processMessages(propMessages, stagger = false) {
    let messageKeys = Object.keys(propMessages)
    if(messageKeys.length > 0){
      // sort at runtime
      messageKeys.sort((a, b) => {
        return moment(propMessages[a].createdAt).isBefore(propMessages[b].createdAt) ? 1 : -1;
      })
      const messages = messageKeys.map((msgId) => {
        return propMessages[msgId];
      })

      let lastMessageCreatedAt = messages[messages.length - 1].createdAt;
      let scrollToBottom = false;
      // if(this.state.lastMessageCreatedAt !== null && this.state.messages !== null && this.state.messages.length > 0){
      //   const lastStateMessageCreatedAt = this.state.messages[this.state.messages.length - 1].createdAt;
      //   if(moment(lastMessageCreatedAt).diff(moment(lastStateMessageCreatedAt)) < 0){
      //     scrollToBottom = true;
      //   }
      // }

      this.setState({
        lastMessageCreatedAt: lastMessageCreatedAt,
        scrollToBottom: scrollToBottom
      });

      if(stagger === false){
        this.setState({
          messages: messages
        })
      } else {
        this.setState({
          messages: messages.slice(0,20)
        })

        if(messages.length > 20){
          setTimeout(() => {
            this.setState({
              messages: messages.slice(0,40)
            })
          }, 500)
        }
        if(messages.length > 40){
          setTimeout(() => {
            this.setState({
              messages: messages.slice(0,80)
            })
          }, 900)
        }
        if(messages.length > 80){
          setTimeout(() => {
            this.setState({
              messages: messages
            })
          }, 1300)
        }
      }
    } else {
      this.setState({
        messages: null
      })
    }
  }

  onHandleSubmit(msg) {
    this.props.onCreateMessage(msg);
  }

  getMessages() {
    let retMessages = []
    const now = new Date()
    const aDayAgo = -(1000 * 60 * 60 * 24)
    if(this.state.messages !== null && this.state.messages.length > 0){
      this.state.messages.forEach((msg, index) => {
        // let date = new Date(msg.createdAt).toLocaleTimeString();
        // let time = date.substring(date.length-3, date.length)
        // {date.substring(0, date.length-6)}{time}
        const msgDate = moment(msg.createdAt)
        let displayDate = `Today, ${msgDate.format("h:mm a")}`;
        if(moment(msg.createdAt).diff(now) < aDayAgo){
          displayDate = msgDate.format("ddd, M/D - h:mm a")
        }
        let icon = <Icon name='fontawesome|user' size={40} color='#aaa' style={styles.avatar}/>
        if (msg.imageUrl) {
          icon = <Image source={{uri: msg.imageUrl}} style={styles.avatarImage} />
        }
        let messageString = '';
        if (msg.type === 'taskCompletion') {
          // msg.message is task name
          messageString = (
            <Text style={styles.messageText}>{msg.author} completed
              <Text style={{fontWeight: 'bold'}}> {msg.message}</Text>
            </Text>
          );
        } else if (msg.type === 'order') {
          messageString = (
            <Text style={styles.messageText}>Order sent to
              <Text style={{fontWeight: 'bold'}}> {msg.purveyor}</Text>
            </Text>
          );
        } else {
          messageString = (
            <Text style={styles.messageText} >{msg.message}</Text>
          );
        }
        let superUserIndicator = <View/>;
        if(this.props.teamsUsers.hasOwnProperty(msg.userId) === true && this.props.teamsUsers[msg.userId].superUser === true){
          superUserIndicator = <Text style={{position: 'absolute', top: 7, left: 2, color: darkBlue, backgroundColor: 'transparent'}}>*</Text>;
        }
        retMessages.push(
          <View key={msg.id} style={styles.messageContainer}>
            <View style={styles.message}>
              {superUserIndicator}
              {icon}
              <View style={styles.messageContentContainer}>
                <View style={styles.messageTextContainer}>
                  <Text style={styles.messageAuthor}>{msg.author}</Text>
                  <Text style={styles.messageTimestamp}>
                    {displayDate}
                  </Text>
                </View>
                {messageString}
              </View>
            </View>
            <View style={styles.separator} />
          </View>
        )
      });
    }
    return retMessages;
  }

  render() {
    let { messagesFetching } = this.props;
    let messageList = []
    if(this.state.messages !== null){
      messageList = this.getMessages();
    }
    if(messagesFetching === true){
      messageList.push((
        <ActivityIndicatorIOS
          key={'loading'}
          animating={true}
          color={'#808080'}
          style={styles.activity}
          size={'large'}
        />
      ))
    }
    if(messageList.length >= 20){
      messageList.push((
        <View key={'get-more'}>
          <TouchableOpacity
            onPress={this.props.onGetMoreMessages}
          >
            <Text style={styles.loadMore}>Load more</Text>
          </TouchableOpacity>
        </View>
      ))
    }
    return (
      <View style={styles.container}>
        <InvertibleScrollView
          style={styles.scrollView}
          keyboardShouldPersistTaps={false}
          automaticallyAdjustContentInsets={false}
          inverted
          ref='scrollview'
        >
          {messageList}
        </InvertibleScrollView>
        <AddMessageForm
          placeholder="Message..."
          onSubmit={this.onHandleSubmit.bind(this)}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  message: {
    flexDirection: 'row'
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'OpenSans',
    marginLeft: 5,
    marginBottom: 10
  },
  messageContentContainer: {
    flex: 9,
    marginLeft: 10,
    paddingRight: 10,
  },
  messageTextContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  messageAuthor: {
    fontSize: 14,
    margin: 5,
    fontWeight: 'bold',
    fontFamily: 'OpenSans',
  },
  messageTimestamp: {
    fontSize: 12,
    fontFamily: 'OpenSans',
    marginTop: 9,
    marginLeft: 6,
    fontWeight: 'bold',
    color: "#ddd"
  },
  notFetching: {
    height: 0
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignSelf: 'center',
    backgroundColor: '#eee'
  },
  avatarImage: {
    width: 40,
    marginTop: 10,
    height: 40,
    borderRadius: 20,
  },
  container: {
    flex: 1,
    backgroundColor: 'teal'
  },
  messageContainer: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: 'white',
    flex: 1,
    paddingLeft: 10,
    paddingRight: 0,
    marginTop: 0,
    paddingTop: 0
  },
  separator: {
    height: 5,
    borderBottomColor: '#f1f1f1',
    borderBottomWidth: 1,
  },
  activity: {
    alignSelf: 'center',
    marginLeft: -(36/2),
    marginBottom: (36/2)
  },
  button: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: 'red',
    borderRadius: 20,
  },
  button2: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'red',
    borderRadius: 20,
  },
  caption: {
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  loadMore: {
    marginTop: 2,
    marginBottom: 10,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
    color: '#555',
    alignSelf: 'center',
    backgroundColor: '#f2f2f2',
  },
});

Feed.propTypes = {
  onCreateMessage: PropTypes.func.isRequired,
};

module.exports = Feed;
