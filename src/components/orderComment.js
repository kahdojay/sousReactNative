import React from 'react-native';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import moment from 'moment';

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
      <View style={styles.commentContainer}>
        <Text>{message}</Text>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  commentContainer: {
    // backgroundColor: 'orange',
  },
})

OrderComment.propTypes = {
};

export default OrderComment