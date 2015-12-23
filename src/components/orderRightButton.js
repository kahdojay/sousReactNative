import React from 'react-native';
import { Icon } from 'react-native-icons';
import Colors from '../utilities/colors';
import _ from 'lodash';

const {
  View,
  Text,
  TouchableHighlight,
  PropTypes,
  StyleSheet,
} = React;

class OrderRightButton extends React.Component {
  constructor(props) {
    super(props)
  }

  handlePress(type) {
    this.props.onHandlePress(type)
  }

  render() {
    const { purveyor } = this.props;

    return (
      <View style={styles.iconContainer}>
        <TouchableHighlight
          underlayColor='white'
          onPress={() => {
            this.handlePress('email')
          }}
        >
          <Icon
            name='fontawesome|envelope'
            size={30}
            color={Colors.lightBlue}
            style={styles.icon}
          />
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor='white'
          onPress={() => {
            this.handlePress('call')
          }}
        >
          <Icon
            name='fontawesome|phone'
            size={30}
            color={Colors.lightBlue}
            style={styles.icon}
          />
        </TouchableHighlight>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    marginTop: 11,
    marginRight: 3,
  },
  icon: {
    width: 40,
    height: 40,
  },
})

OrderRightButton.propTypes = {
};

export default OrderRightButton
