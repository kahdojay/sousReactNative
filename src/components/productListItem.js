import { Icon } from 'react-native-icons';
import React from 'react-native'
import CheckBox from 'react-native-checkbox'
import { greyText, productCompletedBackgroundColor } from '../utilities/colors';

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
    // this.updateStateFromCart(this.props.cart.orders)
  }
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
    if (this.state.added === true) {
      this.props.onUpdateProductInCart(
        this.state.purveyorId, 
        this.props.product.id, 
        {
          quantity: this.state.quantity,
          note: this.state.note
        }
      )
    }
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
    this.setState({
      added: !this.state.added
    }, this.updateCartFromState.bind(this))
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={[
          styles.row,
          this.state.added && styles.rowCompleted
        ]}>
          <View style={styles.checkboxContainer}>
            <CheckBox
              label=''
              onChange={this.handleOrderProduct.bind(this)}
              checked={this.state.added}
            />
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
              <Text style={[
                styles.text,
                this.state.added && styles.textCompleted
              ]}>
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
  rowCompleted: {
    backgroundColor: productCompletedBackgroundColor,
  },
  checkboxContainer: {
    flex: 1,
    alignItems: 'center',
  },
  main: {
    flex: 4,
  },
  text: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 20
  },
  textCompleted: {
    color: '#777',
  },
});

ProductListItem.propTypes = {
  product: PropTypes.object.isRequired
};

export default ProductListItem
