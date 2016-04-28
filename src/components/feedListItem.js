import React from 'react-native';
import { Icon } from 'react-native-icons';
import messageUtils from '../utilities/message';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import AvatarUtils from '../utilities/avatar';

const {
  Image,
  PropTypes,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

class FeedListItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      msg: null
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // only update if this.state.loaded === false
    return !this.state.loaded
  }

  componentWillMount() {
    this.setState({
      msg: this.props.msg
    })
  }

  componentDidMount() {
    this.setState({
      loaded: true
    });
  }

  getMessageString(msg) {
    const messageString = messageUtils.formatMessage(msg)
    if(msg.hasOwnProperty('orderId') === true && msg.orderId){
      return (
        <TouchableHighlight
          underlayColor='transparent'
          onPress={() => {
            this.props.onNavToOrder(msg.orderId)
          }}
        >
          {messageString}
        </TouchableHighlight>
      )
    }
    return messageString
  }

  render() {
    const {msg} = this.state
    let msgDisplayDate = ''

    if(msg === null){
      return (<View />);
    } else {
      msgDisplayDate = messageUtils.formatMessageTimeStamp(msg)
    }

    let user = null
    if(msg.userId && this.props.teamsUsers.hasOwnProperty(msg.userId) === true){
      user = this.props.teamsUsers[msg.userId]
    } else if(msg.imageUrl) {
      user = {
        imageUrl: msg.imageUrl,
        updatedAt: (new Date()).toISOString(),
      }
    }

    if(msg.imageUrl && ['order', 'demo-welcome', 'welcome', 'error'].indexOf(msg.type) !== -1) {
      user = {
        imageUrl: msg.imageUrl,
        updatedAt: (new Date()).toISOString(),
      }
    }

    let icon = AvatarUtils.getAvatar(user, 40)
    let superUserIndicator = <View/>;
    // if(this.props.teamsUsers.hasOwnProperty(msg.userId) === true && this.props.teamsUsers[msg.userId].superUser === true){
    //   superUserIndicator = <Text style={{position: 'absolute', top: 7, left: 2, color: darkBlue, backgroundColor: 'transparent'}}>*</Text>;
    // }
    return (
      <View key={msg.id} style={styles.messageContainer}>
        <View style={styles.message}>
          {superUserIndicator}
          {icon}
          <View style={styles.messageContentContainer}>
            <View style={styles.messageTextContainer}>
              <Text style={styles.messageAuthor}>{msg.author}</Text>
              <Text style={styles.messageTimestamp}>{msgDisplayDate}</Text>
            </View>
            {this.getMessageString(msg)}

          </View>
        </View>
        <View style={styles.separator} />
      </View>
    )
  }

}

const styles = StyleSheet.create({
  messageContainer: {
    flex: 1,
  },
  message: {
    flexDirection: 'row',
    paddingTop: 10,
  },
  messageContentContainer: {
    flex: 9,
    paddingLeft: 10,
    paddingRight: 10,
  },
  messageTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 5,
    paddingLeft: 5,
  },
  messageAuthor: {
    fontSize: 16,
    marginRight: 10,
    fontWeight: 'bold',
    fontFamily: 'OpenSans',
  },
  messageTimestamp: {
    fontSize: 12,
    fontFamily: 'OpenSans',
    color: Colors.lightGrey,
    marginBottom: 1,
  },
  separator: {
    height: 5,
    borderBottomColor: '#f1f1f1',
    borderBottomWidth: 1,
  },
})


FeedListItem.propTypes = {
  msg: PropTypes.object.isRequired
}

export default FeedListItem
