import React from 'react-native';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import messageUtils from '../utilities/message';
import AvatarUtils from '../utilities/avatar';

const {
  PropTypes,
  StyleSheet,
  Text,
  View,
} = React;

class OrderComment extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const {message} = this.props
    let icon = AvatarUtils.getAvatar({imageUrl: this.props.imgUrl})

    return (
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          {icon}
        </View>
        <View style={styles.commentOuterContainer}>
          <Text style={styles.author}>{message.author}</Text>
          <View style={styles.commentContainer}>
            <Text style={styles.message}>{message.text}</Text>
          </View>
          <View style={styles.commentFooter}>
            <Text style={styles.timeStamp}>{messageUtils.formatMessageTimeStamp(message)}</Text>
          </View>
        </View>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 15,
  },
  avatarContainer: {
    flex: 1,
    alignItems: 'center',
  },
  commentOuterContainer: {
    flex: 5,
  },
  commentContainer: {
    justifyContent: 'center',
    backgroundColor: Colors.rowColor,
    borderColor: Colors.rowColor,
    borderWidth: 1,
    borderRadius: 10,
    margin: 5,
    padding: 10,
  },
  commentFooter: {
    paddingLeft: 10,
  },
  author: {
    marginLeft: 10,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
  },
  timeStamp: {
    color: Colors.darkGrey,
    fontStyle: 'italic',
  },
  separator: {
    height: 0,
    borderBottomColor: Colors.separatorColor,
    borderBottomWidth: .5,
  },
})

OrderComment.propTypes = {
};

export default OrderComment