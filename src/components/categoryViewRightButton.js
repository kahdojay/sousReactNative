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

class CategoryViewRightButton extends React.Component {
  constructor(props) {
    super(props)
  }

  onNavToCreateProduct(e) {
    this.props.onNavToCreateProduct()
  }

  onNavToCart(e) {
    this.props.onNavToCart()
  }

  render() {
    const { cart } = this.props;
    const badgeValue = (Object.keys(cart.orders).length > 0 ?
                          _.sum(cart.orders, function (cartPurveyor) {
                            return Object.keys(cartPurveyor.products).length
                          }) : '')
    // ...

    return (
      <View style={styles.container}>
        <TouchableHighlight
          underlayColor='white'
          onPress={::this.onNavToCart}
          style={styles.navBarItem}
        >
          <Icon name='fontawesome|shopping-cart' size={30} color={Colors.lightBlue} style={styles.plus}>
            {badgeValue !== '' ? <Icon name='fontawesome|circle' size={24} color={Colors.red} style={styles.badge}><Text style={styles.badgeText}>{badgeValue}</Text></Icon> : <View/> }
          </Icon>
        </TouchableHighlight>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  navBarItem: {
    flex: 1
  },
  cart: {
    width: 50,
    height: 50,
    marginTop: 6,
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

CategoryViewRightButton.propTypes = {
};

CategoryViewRightButton.contextTypes = {
  menuActions: React.PropTypes.object.isRequired
}

export default CategoryViewRightButton
