import { Icon } from 'react-native-icons';
import React from 'react-native'
import CheckBox from 'react-native-checkbox'
import { greyText, productCompletedBackgroundColor } from '../utilities/colors';
import {
  CART
} from '../actions/actionTypes';

const {
  TouchableHighlight,
  PropTypes,
  Text,
  StyleSheet,
  View,
} = React;

class ProductListItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      added: false,
      quantity: 1,
      purveyorId: '',
      note: ''
    }
  }
  componentWillMount() {
    // console.log(this.props);
    // this.updateStateFromCart(this.props.cart.orders)
  }
  // componentDidUpdate(prevProps, prevState) {
  //   // console.log(this.props);
  //   // this.updateStateFromCart(this.props.cart.orders)
  // }
  updateStateFromCart(cartOrders) {
    let cartItem = null
    let cartPurveyorId = ''
    this.props.product.purveyors.map((purveyorId) => {
      if (cartOrders.hasOwnProperty(purveyorId) === true && cartOrders[purveyorId].products.hasOwnProperty(this.props.product.id)) {
        cartPurveyorId = purveyorId
        cartItem = cartOrders[purveyorId].products[this.props.product.id]
      }
    })
    if (cartItem !== null) {
      this.setState({
        added: true,
        quantity: cartItem.quantity,
        purveyorId: cartPurveyorId,
        note: cartItem.note
      })
    }
  }
  updateCartFromState() {
    const cartAttributes = {
      purveyorId: this.state.purveyorId,
      productId: this.props.product.id,
      quantity: this.state.quantity,
      note: this.state.note
    };
    console.log(cartAttributes)
    this.props.onUpdateProductInCart(
      (this.state.added === true ? CART.ADD : CART.REMOVE),
      cartAttributes
    )
  }
  increment() {
    this.setState({
      quantity: this.state.quantity + 1
    }, this.updateCartFromState.bind(this))
  }
  decrement() {
    if (this.state.quantity > 1 ) {
      this.setState({
        quantity: this.state.quantity - 1
      }, this.updateCartFromState.bind(this))
    }
  }
  handleOrderProduct() {
    // default to first purveyor
    // let purveyor = this.props.product.purveyors[0]
    // if product has multiple purveyors, show modal first asking which purveyor
    this.setState({
      added: !this.state.added
      // set the purveyor
    }, this.updateCartFromState.bind(this))
  }
  render() {
    let checkbox
    if (this.props.product.purveyors.length > 1) {
      checkbox =  <CheckBox
                    label=''
                    onChange={this.handleOrderProduct.bind(this)}
                    checked={this.state.added}
                  />
    } else {
      checkbox = <CheckBox
                    label=''
                    onChange={this.handleOrderProduct.bind(this)}
                    checked={this.state.added}
                    dots={true}
                  />
    }
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.checkboxContainer}>
            {checkbox}
          </View>
          {/*<TouchableHighlight
            underlayColor={'#eee'}
            onPress={() => {
              this.props.navigator.push({
                name: 'ProductView',
                productId: this.props.product.productId,
                purveyorId: this.props.purveyorId,
              })
            }}
          >*/}
            <View
              style={styles.main}
            >
              <Text style={styles.productText}>
                {this.props.product.name}
              </Text>
              <Text
                style={{fontSize: 9,  color: '#999'}}
              >
                {this.props.product.price + ' • ' + this.props.product.unit}
              </Text>
            </View>
          {/*</TouchableHighlight>*/}
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
    fontWeight: 'bold',
    color: 'black',
    fontSize: 20
  },
});

ProductListItem.propTypes = {
  product: PropTypes.object.isRequired
};

export default ProductListItem
