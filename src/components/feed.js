import { Icon } from 'react-native-icons';
import React from 'react-native';
import AddMessageForm from './addMessageForm';
import { mainBackgroundColor } from '../utilities/colors';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
let SideMenu = require('react-native-side-menu');
import Menu from './menu';
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

class Button extends React.Component {
  handlePress(e) {
    this.context.menuActions.toggle();
    if (this.props.onPress) {
      this.props.onPress(e);
    }
  }

  render() {
    return (
      <TouchableOpacity
        onPress={this.handlePress.bind(this)}
        style={this.props.style}>
        <Text>{this.props.children}</Text>
      </TouchableOpacity>
    );
  }
}

Button.contextTypes = {
  menuActions: React.PropTypes.object.isRequired
};

class Feed extends React.Component {
  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      touchToClose: false,
      open: false,
    }
  }

  handleOpenWithTouchToClose() {
    this.setState({
      touchToClose: true,
      open: true,
    });
  }

  handleChange(isOpen) {
    if (!isOpen) {
      this.setState({
        touchToClose: false,
        open: false,
      });
    }
  }

  componentDidUpdate(){
    this.scrollToBottom();
  }

  scrollToBottom() {
    if(this.refs.hasOwnProperty('scrollview')) {
      this.refs.scrollview.scrollTo(0)
    }
  }

  onHandleSubmit(msg) {
    this.props.onCreateMessage(msg);
  }

  render() {
    let { messages } = this.props;
    let fetching =  <ActivityIndicatorIOS
                        animating={true}
                        color={'#808080'}
                        style={styles.activity}
                        size={'large'} />
    return (

          <View style={styles.container}>
            <View style={styles.messageContainer}>
              {messages.isFetching ? fetching : <View style={styles.notFetching}/>}
              <InvertibleScrollView
                style={styles.scrollView}
                contentInset={{bottom:49}}
                keyboardShouldPersistTaps={false}
                automaticallyAdjustContentInsets={false}
                inverted
                ref='scrollview'>
                { this.props.messages.data.map((msg, index) => {
                  // let date = new Date(msg.createdAt["$date"]).toLocaleTimeString();
                  let date = new Date(msg.createdAt).toLocaleTimeString();
                  let time = date.substring(date.length-3, date.length)
                  return (
                    <View key={index} style={styles.messageContainer}>
                      <View style={styles.message}>
                        <Icon name='fontawesome|user' size={30} color='#f7f7f7' style={styles.avatar}/>
                        <View style={styles.messageContentContainer}>
                          <View style={styles.messageTextContainer}>
                            <Text style={styles.messageAuthor}>{msg.author}</Text>
                            <Text style={styles.messageTimestamp}>
                              {date.substring(0, date.length-6)}{time}
                            </Text>
                          </View>
                          <Text style={styles.messageText} key={index}>{msg.message}</Text>
                        </View>
                      </View>
                      <View style={styles.separator} />
                    </View>
                  )
                }).reverse()
              }
            </InvertibleScrollView>
            <AddMessageForm
              placeholder="Message..."
              onSubmit={this.onHandleSubmit.bind(this)}/>
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
    fontSize: 14,
    fontFamily: 'OpenSans',
    marginLeft: 5,
    marginBottom: 10
  },
  messageContentContainer: {
    flex: 9,
    marginLeft: 10
  },
  messageContainer: {
    padding: 0,
    margin: 0,
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
    width: 60,
    height: 60,
    borderRadius: 30,
    alignSelf: 'center',
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
    height: 0,
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
});

Feed.propTypes = {
  onCreateMessage: PropTypes.func.isRequired,
};

module.exports = Feed;
