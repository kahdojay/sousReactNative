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

  handlePress(e) {
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
      <TouchableHighlight
        underlayColor='white'
        onPress={::this.handlePress} >
        <Icon name='fontawesome|shopping-cart' size={30} color={Colors.navbarIconColor} style={styles.cart}>
          {badgeValue !== '' ? <Icon name='fontawesome|circle' size={24} color={Colors.red} style={styles.badge}><Text style={styles.badgeText}>{badgeValue}</Text></Icon> : <View/> }
        </Icon>
      </TouchableHighlight>
    );
  }
}

let styles = StyleSheet.create({
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
