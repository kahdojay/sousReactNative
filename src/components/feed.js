import React from 'react-native';
import FeedListItem from './feedListItem';
import AddMessageForm from './addMessageForm';
import Colors from '../utilities/colors';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
let SideMenu = require('react-native-side-menu');
import Menu from './menu';
import moment from 'moment';

const {
  ActivityIndicatorIOS,
  PropTypes,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
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
      scrollToBottom: false
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
    if(this.props.connected === true){
      this.props.onClearBadge()
    }
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
    if(this.state.messages !== null && this.state.messages.length > 0){
      this.state.messages.forEach((msg, index) => {
        retMessages.push(
          <FeedListItem
            teamsUsers={this.props.teamsUsers}
            key={msg.id}
            msg={msg}
            onNavToOrder={this.props.onNavToOrder}
          />
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
          color={Colors.greyText}
          style={styles.activity}
          size={'large'}
        />
      ))
    }
    if(messageList.length >= 20 && this.props.connected === true){
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
          disabled={(this.props.connected === false)}
          placeholder="Message..."
          onSubmit={this.onHandleSubmit.bind(this)}
          multiline={true}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  notFetching: {
    height: 0
  },
  container: {
    flex: 1,
    backgroundColor: 'teal'
  },
  scrollView: {
    backgroundColor: 'white',
    flex: 1,
    paddingLeft: 10,
    paddingRight: 0,
    marginTop: 0,
    paddingTop: 0
  },
  activity: {
    alignSelf: 'center',
    marginLeft: -(36/2),
    marginBottom: (36/2)
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
