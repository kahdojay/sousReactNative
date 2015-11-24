import React from 'react-native';
import _ from 'lodash';
import { Icon } from 'react-native-icons';
import Colors from '../utilities/colors';
import { nameSort } from '../utilities/utils';
import {
  CART
} from '../actions/actionTypes';

const {
  AlertIOS,
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  StyleSheet,
} = React;

class CartView extends React.Component {
  constructor(props) {
    super(props)
    const numberOfOrders = Object.keys(this.props.team.cart.orders).length
    this.state = {
      numberOfOrders: numberOfOrders
    }
  }

  componentWillReceiveProps(nextProps) {
    const numberOfOrders = Object.keys(nextProps.team.cart.orders).length
    this.setState({
      numberOfOrders: numberOfOrders
    })
  }

  handleSubmitPress(cartPurveyors) {
    if (this.state.numberOfOrders > 0) {
      AlertIOS.alert(
        'Confirm',
        'Are you sure you want to send order?',
        [
          {
            text: 'No',
            onPress: () => {
              // console.log('Order not sent')
            }
          },
          {
            text: 'Yes',
            onPress: () => {
              const cartPurveyorsString = _.pluck(cartPurveyors, 'name').join(', ');
              if(this.state.numberOfOrders > 0){
                this.props.onSubmitOrder('Order sent to ' + cartPurveyorsString);
              }
            }
          }
        ]
      )
    }
    // TODO: handle empty cart error
  }

  renderPurveyorProducts(purveyorId, cart, products) {
    const purveyorProducts = cart.orders[purveyorId].products
    const cartPurveyorProductIds = Object.keys(purveyorProducts)
    const cartPurveyorProducts = _.map(cartPurveyorProductIds, (productId) => {
      return _.filter(products, {id: productId})[0]
    })
    cartPurveyorProducts.sort(nameSort)

    return cartPurveyorProducts.map((product) => {
      let quantity = purveyorProducts[product.id].quantity * product.amount
      const productName = product.name || '';
      return (
        <View key={product.id} style={styles.productContainer}>
          <Text style={styles.productTitle}>{productName}</Text>
          <Text style={styles.productQuantity}>{quantity} {product.unit}{(quantity > 1) ? 's' : ''}</Text>
          {/* * /}<TouchableHighlight
            key={'decrement'}
            onPress={() => {
              if (quantity > 1) {
                const cartAttributes = {
                  purveyorId: purveyorId,
                  productId: product.id,
                  quantity: quantity - 1,
                };
                this.props.onUpdateProductInCart(CART.ADD, cartAttributes)
              }
            }}
            style={{width: 40, alignItems: 'center'}}
            underlayColor='transparent'
          >
            <Icon
              name='fontawesome|minus-circle'
              size={30}
              color='#aaa'
              style={styles.icon}
            />
          </TouchableHighlight>
          <TouchableHighlight
            key={'increment'}
            onPress={() => {
              const cartAttributes = {
                purveyorId: purveyorId,
                productId: product.id,
                quantity: quantity + 1,
              };
              this.props.onUpdateProductInCart(CART.ADD, cartAttributes)
            }}
            style={{width: 40, alignItems: 'center'}}
            underlayColor='transparent'
          >
            <Icon
              name='fontawesome|plus-circle'
              size={30}
              color='#aaa'
              style={styles.icon}
            />
        </TouchableHighlight>{/* */}
          <TouchableHighlight
            onPress={() => {
              this.props.onDeleteProduct(purveyorId, product.id)
            }}
            style={{width: 40, alignItems: 'center'}}
            underlayColor='transparent'
          >
            <Icon
              name='fontawesome|times'
              size={25}
              color='#999'
              style={styles.iconRemove}
            />
          </TouchableHighlight>
        </View>
      )
    });
  }

  render() {
    const {team, purveyors, products} = this.props
    const cart = team.cart
    const cartPurveyorIds = Object.keys(cart.orders)
    const cartPurveyors = _.map(cartPurveyorIds, (purveyorId) => {
      return _.filter(purveyors, {id: purveyorId})[0]
    })
    cartPurveyors.sort(nameSort)

    return (
      <ScrollView style={styles.scrollView}>
        {
          _.map(cartPurveyors, (purveyor) => {
            return (
              <View key={purveyor.id} style={styles.purveyorContainer}>
                <Text style={styles.purveyorTitle}>{purveyor.name}</Text>
                {this.renderPurveyorProducts(purveyor.id, cart, products)}
              </View>
            );
          })
        }
        <TouchableHighlight
          onPress={this.handleSubmitPress.bind(this, cartPurveyors)}
          style={[
            styles.button,
            this.state.numberOfOrders === 0 && styles.buttonDisabled
          ]}
          underlayColor={Colors.disabled}
        >
          <Text style={styles.buttonText}>Submit Order</Text>
        </TouchableHighlight>
      </ScrollView>
    );
  }
}

let styles = StyleSheet.create({
  purveyorContainer: {
    marginLeft: 10,
    marginRight: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
  iconRemove: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: '#999',
    borderRadius: 4,
  },
  productContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    marginTop: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 5,
  },
  purveyorTitle: {
    backgroundColor: Colors.lightBlue,
    borderRadius: 2,
    fontWeight: 'bold',
    padding: 10,
    color: 'white',
    marginTop: 1,
    fontFamily: 'OpenSans',
    fontSize: 18,
  },
  productTitle: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 5,
    paddingBottom: 10,
    fontFamily: 'OpenSans',
    fontSize: 14,
  },
  productQuantity: {
    width: 50,
    margin: 5,
    textAlign: 'right',
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'OpenSans'
  },
  button: {
    height: 56,
    backgroundColor: '#F5A623',
    alignSelf: 'center',
    width: 200,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    borderRadius: 3,
  },
  buttonDisabled: {
    backgroundColor: Colors.disabled,
  },
  scrollView: {
    backgroundColor: '#f2f2f2',
    flex: 1,
  },
})

export default CartView
