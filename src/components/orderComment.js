import React from 'react-native';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import messageUtils from '../utilities/message';

const {
  // Dimensions,
  PropTypes,
  StyleSheet,
  Text,
  View,
} = React;

// const window = Dimensions.get('window');

class OrderComment extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const {message, author, createdAt} = this.props
    return (
      <View>
        <View style={styles.commentContainer}>
          <View style={styles.commentHeader}>
            <Text style={styles.author}>{author || 'Sous Support'}</Text>
          </View>
          <View style={styles.commentBody}>
            <Text>{message}</Text>
          </View>
          <View style={styles.commentFooter}>
            <Text>{messageUtils.formatMessageTimeStamp(message)}</Text>
          </View>
        </View>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  commentContainer: {
    paddingLeft: 40,
    marginBottom: 15,
  },
  commentHeader: {
  },
  author: {
    fontWeight: 'bold',
  },
  commentBody: {

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