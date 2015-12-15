import React from 'react-native'
import { Icon } from 'react-native-icons'
import moment from 'moment'
import messageUtils from '../utilities/message'

const {
  Image,
  PropTypes,
  Text,
  StyleSheet,
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

  render() {
    const {msg} = this.state

    if(msg === null){
      return (<View />);
    }

    const msgDate = moment(msg.createdAt)
    let displayDate = `Today, ${msgDate.format("h:mm a")}`;
    if(moment(msg.createdAt).diff(this.props.now) < this.props.aDayAgo){
      displayDate = msgDate.format("ddd, M/D - h:mm a")
    }
    let icon = <Icon name='fontawesome|user' size={40} color='#aaa' style={styles.avatar}/>
    if (msg.imageUrl) {
      icon = <Image source={{uri: msg.imageUrl}} style={styles.avatarImage} />
    }
    let messageString = messageUtils.formatMessage(msg);
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
  }

}

const styles = StyleSheet.create({
  messageContainer: {
    flex: 1,
  },
  message: {
    flexDirection: 'row'
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