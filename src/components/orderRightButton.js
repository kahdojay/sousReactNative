import React from 'react-native';
import { Icon } from 'react-native-icons';
import Colors from '../utilities/colors';

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

    if(purveyor === null){
      return (
        <View style={styles.iconContainer}>
        </View>
      )
    }

    return (
      <View style={styles.iconContainer}>
        <TouchableHighlight
          underlayColor='white'
          onPress={() => {
            this.handlePress('email')
          }}
        >
          <Icon
            name='material|email'
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
            name='material|phone'
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
    marginTop: 12,
    marginRight: 3,
  },
  icon: {
    width: 50,
    height: 50,
  },
})

OrderRightButton.propTypes = {
};

export default OrderRightButton
