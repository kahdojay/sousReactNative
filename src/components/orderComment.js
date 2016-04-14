import React from 'react-native';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import messageUtils from '../utilities/message';

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
    return (
      <View>
        <View style={styles.commentContainer}>
          <View>
            <Text style={styles.message}>{message.text}</Text>
          </View>
          <View style={styles.commentFooter}>
            <Text><Text style={styles.author}>{message.author || 'Sous Support'}</Text><Text style={styles.timeStamp}>, {messageUtils.formatMessageTimeStamp(message)}</Text></Text>
          </View>
        </View>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  commentContainer: {
    backgroundColor: Colors.rowColor,
    borderColor: Colors.rowColor,
    borderWidth: 1,
    borderRadius: 15,
    margin: 5,
    padding: 15,
  },
  author: {
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
  },
  timeStamp: {
    color: Colors.darkGrey,
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