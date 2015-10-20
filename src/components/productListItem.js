import React from 'react-native'
import ProductToggle from './productToggle'
import { Icon } from 'react-native-icons'
import { greyText, productCompletedBackgroundColor } from '../utilities/colors';
import _ from 'lodash';
import {
  CART
} from '../actions/actionTypes';

const {
  TouchableHighlight,
  PropTypes,
  Text,
  StyleSheet,
  View,
  Modal,
} = React;

class ProductListItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      added: false,
      quantity: 1,
      selectedPurveyorId: this.props.product.purveyors[0],
      note: ''
    }
  }

  componentWillMount() {
    // console.log(this.props);
    this.stateUpdateFromCart(this.props.cart.orders)
  }

  stateUpdateFromCart(cartOrders) {
    let cartItem = null
    let cartPurveyorId = ''
    this.props.product.purveyors.map((purveyorId) => {
      if (cartOrders.hasOwnProperty(purveyorId) === true && cartOrders[purveyorId].products.hasOwnProperty(this.props.product.id)) {
        cartPurveyorId = purveyorId
        cartItem = cartOrders[purveyorId].products[this.props.product.id]
      }
    })
    if (cartItem !== null) {
      const newState = {
        added: true,
        quantity: cartItem.quantity,
        purveyorId: cartPurveyorId,
        note: cartItem.note
      };
      // console.log(newState)
      this.setState(newState);
    }
  }

  cartUpdateFromState() {
    const cartAttributes = {
      purveyorId: this.state.selectedPurveyorId,
      productId: this.props.product.id,
      quantity: this.state.quantity,
      note: this.state.note
    };
    // console.log(cartAttributes)
    this.props.onUpdateProductInCart(
      (this.state.added === true ? CART.ADD : CART.REMOVE),
      cartAttributes
    )
  }

  increment() {
    this.setState({
      quantity: this.state.quantity + 1
    }, this.cartUpdateFromState.bind(this))
  }

  decrement() {
    if (this.state.quantity > 1 ) {
      this.setState({
        quantity: this.state.quantity - 1
      }, this.cartUpdateFromState.bind(this))
    }
  }

  handleToggleProduct(id) {
    this.setState({
      added: !this.state.added,
      selectedPurveyorId: id
    }, this.cartUpdateFromState.bind(this))
  }
  render() {
    let {product} = this.props
    console.log('list item product', product)
    const purveyorString = _.find(this.props.purveyors.data, { id: this.state.selectedPurveyorId }).name;

    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.checkboxContainer}>
            <ProductToggle
              added={this.state.added}
              availablePurveyors={product.purveyors}
              allPurveyors={this.props.purveyors}
              currentlySelectedPurveyorId={this.state.selectedPurveyorId}
              onToggleCartProduct={(id) => {
                this.handleToggleProduct(id)
              }}
            />
          </View>
          <View style={styles.main} >
            <Text style={styles.productText}>
              {product.name}
            </Text>
            <Text style={{fontSize: 9,  color: '#999'}} >
              {product.amount + ' ' + product.unit}
            </Text>
            <Text style={{fontSize: 9,  color: '#999'}} >
              {purveyorString}
            </Text>
          </View>
          <Text style={styles.quantity}>
            {this.state.quantity > 1 ? ('X' + this.state.quantity) : ''}
          </Text>
          <TouchableHighlight
            underlayColor="transparent"
            onPress={this.decrement.bind(this)}>
            <Icon name='fontawesome|minus-circle' size={30} color='#aaa' style={styles.icon}/>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor='transparent'
            onPress={this.increment.bind(this)}>
            <Icon name='fontawesome|plus-circle' size={30} color='#aaa' style={styles.icon}/>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 5,
    paddingLeft: 5,
  },
  icon: {
    width: 40,
    height: 40,
  },
  quantity: {
    fontSize: 16
  },
  row: {
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 5,
    alignItems: 'center',
  },
  checkboxContainer: {
    flex: 1,
    alignItems: 'center',
  },
  main: {
    flex: 4,
  },
  productText: {
    color: 'black',
    fontSize: 15
  },
});

ProductListItem.propTypes = {
  product: PropTypes.object.isRequired
};

export default ProductListItem
