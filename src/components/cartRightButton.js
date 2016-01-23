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

class CartRightButton extends React.Component {
  constructor(props) {
    super(props)
  }

  handlePress(e) {
    this.props.onNavToCart()
  }

  render() {
    const { cartItems } = this.props;
    
    let badgeValue = ''
    if(Object.keys(cartItems).length > 0){
      const actualCartPurveyors = _.filter(cartItems, function (cartPurveyor) {
        return Object.keys(cartPurveyor).length > 0
      })
      if(actualCartPurveyors.length > 0){
        badgeValue = _.sum(actualCartPurveyors, function (cartPurveyor) {
          return Object.keys(cartPurveyor).length
        })
      }
    }
    // ...

    return (
      <TouchableHighlight
        underlayColor='transparent'
        onPress={::this.handlePress} >
        <Icon name='material|shopping-cart' size={30} color={Colors.lightBlue} style={styles.cart}>
          {badgeValue !== '' ? <Icon name='material|circle' size={24} color={Colors.red} style={styles.badge}><Text style={styles.badgeText}>{badgeValue}</Text></Icon> : <View/> }
        </Icon>
      </TouchableHighlight>
    );
  }
}

let styles = StyleSheet.create({
  cart: {
    width: 50,
    height: 50,
    marginTop: 12,
    marginRight: 3,
  },
  badge: {
    width: 24,
    height: 24,
    marginTop: 20,
    marginLeft: 26
  },
  badgeText: {
    color: 'white',
    marginTop: 4,
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'center'
  }
})

CartRightButton.propTypes = {
};

export default CartRightButton
