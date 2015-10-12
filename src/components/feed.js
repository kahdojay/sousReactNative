import { Icon } from 'react-native-icons';
import React from 'react-native';
import AddMessageForm from './addMessageForm';
import { mainBackgroundColor } from '../utilities/colors';
import InvertibleScrollView from 'react-native-invertible-scroll-view';

const {
  ScrollView,
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
  }

  componentDidUpdate(){
    this.scrollToBottom();
  }

  scrollToBottom() {
    if(this.refs.hasOwnProperty('scrollview'))
      this.refs.scrollview.scrollTo(0)
  }

  onHandleSubmit(msg) {
    this.props.onCreateMessage([{
      author: this.props.userEmail,
      message: msg,
      teamKey: this.props.teamKey
    }]);
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
          {messages.isFetching ? fetching : <View/>}
          <InvertibleScrollView
            style={styles.scrollView}
            contentInset={{bottom:49}}
            automaticallyAdjustContentInsets={false}
            inverted
            ref='scrollview'
          >
            { this.props.messages.data.map((msg, index) => {
              let date = new Date(msg.createdAt["$date"]).toLocaleTimeString();
              let time = date.substring(date.length-3, date.length)
              return (
                <View>
                  <View key={index} style={styles.message}>
                    <Icon name='fontawesome|user' size={30} color='#0075FD' style={styles.avatar}/>
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
                  <View style={styles.separator} />
                </View>
              )
            }).reverse() }
          </InvertibleScrollView>
        <AddMessageForm
          placeholder="Message..."
          onSubmit={this.onHandleSubmit.bind(this)}
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
    flex: 9
  },
  messageTextContainer: {
    flex: 1,
    flexDirection: 'row',
    // alignItems: 'stretch'
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
    // margin: 7,
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
    paddingLeft: 20,
    paddingRight: 0,
    marginTop: 0,
    paddingTop: 0
  },
  separator: {
    height: 5,
    borderBottomColor: '#bbb',
    borderBottomWidth: 1,
  },
});

Feed.propTypes = {
  onCreateMessage: PropTypes.func.isRequired,
};

module.exports = Feed;
