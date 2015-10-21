import { Icon } from 'react-native-icons';
import React from 'react-native';
import Colors from '../utilities/colors';

const {
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

  handleSubmitPress() {
    if(this.state.numberOfOrders > 0){
      this.props.onSubmitOrder();
    }
  }

  nameSort(a, b) {
    if (a.name > b.name) {
      return 1;
    }
    if (a.name < b.name) {
      return -1;
    }
    // a must be equal to b
    return 0;
  }

  renderPurveyorProducts(purveyorId) {

    const {team, purveyors, appState} = this.props
    const cart = team.cart
    const products = appState.teams.products
    const purveyorProducts = cart.orders[purveyorId].products

    const cartPurveyorProductIds = Object.keys(cart.orders[purveyorId].products)
    const cartPurveyorProducts = _.map(cartPurveyorProductIds, (productId) => {
      return _.filter(products, {id: productId})[0]
    })
    cartPurveyorProducts.sort(this.nameSort)

    return cartPurveyorProducts.map((product) => {
      // console.log('PRODUCT', product)
      let quantity = purveyorProducts[product.id].quantity
      const productName = product.name || '';
      return (
        <View key={product.id} style={styles.productContainer}>
          <Text style={styles.productTitle}>{quantity} {productName}</Text>
          <TouchableHighlight
            onPress={() => {
              // console.log('delete ITEM');
              this.props.onDeleteProduct(purveyorId, product.id)
            }}
            underlayColor='transparent'>
            <Icon name='fontawesome|times' size={25} color='#999' style={styles.icon} />
          </TouchableHighlight>
        </View>
      )
    });
  }

  renderPurveyors() {

    const {team, purveyors, appState} = this.props
    const cart = team.cart
    const products = appState.teams.products
    // console.log('CART PROPS', this.props.team)
    // console.log('PURVEYORS', appState)

    const cartPurveyorIds = Object.keys(cart.orders)
    const cartPurveyors = _.map(cartPurveyorIds, (purveyorId) => {
      return _.filter(purveyors, {id: purveyorId})[0]
    })
    cartPurveyors.sort(this.nameSort)

    return _.map(cartPurveyors, (purveyor) => {
      return (
        <View key={purveyor.id} style={styles.purveyorContainer}>
          <Text style={styles.purveyorTitle}>{purveyor.name}</Text>
          {this.renderPurveyorProducts(purveyor.id)}
        </View>
      );
    })
  }

  render() {
    const buttonStyle = this.state.numberOfOrders > 0 ? styles.button : [styles.button,styles.buttonDisabled];

    return (
      <ScrollView style={styles.scrollView}>
        {this.renderPurveyors()}
        <TouchableHighlight
          onPress={::this.handleSubmitPress}
          style={buttonStyle}>
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
    borderWidth: 2,
    borderColor: '#999',
    borderRadius: 4,
    marginTop: 4,
  },
  productContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    marginTop: 1,
    justifyContent: 'space-between',
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
    padding: 8,
    fontFamily: 'OpenSans',
    fontSize: 14,
    backgroundColor: 'white',
    marginTop: 1,
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
    backgroundColor: '#aaaaaa'
  },
  scrollView: {
    backgroundColor: '#f2f2f2',
    flex: 1,
  },
})

export default CartView
