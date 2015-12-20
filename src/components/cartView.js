import React from 'react-native';
import _ from 'lodash';
import Colors from '../utilities/colors';
import CartViewListItem from './cartViewListItem';

const {
  AlertIOS,
  PickerIOS,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
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
              if(this.state.numberOfOrders > 0){
                this.props.onSubmitOrder();
              }
            }
          }
        ]
      )
    }
    // TODO: handle empty cart error
  }

  renderPurveyorProducts(purveyorId, cart, products) {
    const cartProducts = cart.orders[purveyorId].products
    const cartPurveyorProductIds = Object.keys(cartProducts)
    const cartPurveyorProducts = _.sortBy(_.map(cartPurveyorProductIds, (productId) => {
      return products[productId]
    }), 'name')

    return cartPurveyorProducts.map((product) => {
      const cartProduct = cartProducts[product.id];
      return (
        <CartViewListItem
          purveyorId={purveyorId}
          product={product}
          cartProduct={cartProduct}
          onUpdateProductInCart={this.props.onUpdateProductInCart}
          onDeleteProduct={this.props.onDeleteProduct}
        />
      )
    });
  }

  render() {
    const {team, cartPurveyors, products} = this.props

    return (
      <ScrollView style={styles.scrollView}>
        {
          _.map(cartPurveyors, (purveyor) => {
            return (
              <View key={purveyor.id} style={styles.purveyorContainer}>
                <View style={styles.purveyorInfo}>
                  <Text style={styles.purveyorTitle}>{purveyor.name}</Text>
                  <View style={{flex: 1}}>
                    <Text style={styles.orderCutoffTime}>{purveyor.orderCutoffTime}</Text>
                    <Text style={styles.orderMinimum}>{purveyor.orderMinimum}</Text>
                    <Text style={styles.orderTotal}>{team.cart.total}</Text>
                  </View>
                </View>
                {this.renderPurveyorProducts(purveyor.id, team.cart, products)}
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

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#f2f2f2',
    flex: 1,
  },
  purveyorContainer: {
    marginLeft: 10,
    marginRight: 10,
  },
  purveyorInfo: {
    backgroundColor: Colors.darkBlue,
    borderRadius: 2,
    marginTop: 1,
    padding: 10,
    flexDirection: 'row'
  },
  purveyorTitle: {
    flex: 2,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'OpenSans',
    fontSize: 18,
  },
  orderCutoffTime: {
    color: 'white',
    fontFamily: 'OpenSans',
    fontSize: 12,
    textAlign: 'right',
  },
  orderMinimum: {
    color: 'white',
    fontFamily: 'OpenSans',
    fontSize: 12,
    textAlign: 'right',
  },
  orderTotal: {
    color: 'white',
    fontFamily: 'OpenSans',
    fontSize: 12,
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
})

export default CartView
