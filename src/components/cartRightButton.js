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

  getCounts(props) {
    const numberOfOrders = Object.keys(props.cartItems)
    const numberOfProducts = _.reduce(_.map(numberOfOrders, (orderId) => {
      const filteredProducts = _.filter(Object.keys(props.cartItems[orderId]), (cartItemId) => {
        const cartItem = props.cartItems[orderId][cartItemId]
        return cartItem.status === 'NEW'
      })
      return filteredProducts.length
    }), (total, n) => {
      return total + n
    })
    return {
      numberOfOrders,
      numberOfProducts
    }
  }

  render() {
    const { cartItems } = this.props;

    let badgeValue = ''
    const {numberOfOrders, numberOfProducts} = this.getCounts(this.props)
    if(numberOfOrders.length > 0){
      badgeValue = numberOfProducts
    }
    // ...

    return (
      <View style={styles.iconContainer}>
        <TouchableHighlight
          underlayColor='transparent'
          onPress={this.props.onCreateProduct} >
          <Icon name='material|plus' size={30} color={Colors.navIcon} style={[styles.add, styles.navIcon]}/>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor='transparent'
          onPress={::this.handlePress} >
          <Icon name='material|shopping-cart' size={30} color={Colors.navIcon} style={styles.navIcon}>
            {badgeValue !== '' ? <Icon name='material|circle' size={24} color={Colors.red} style={styles.badge}><Text style={styles.badgeText}>{badgeValue}</Text></Icon> : <View/> }
          </Icon>
        </TouchableHighlight>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
  },
  cart: {
    fontWeight: 'bold',
  },
  navIcon: {
    width: 50,
    height: 50,
    marginTop: 12,
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
