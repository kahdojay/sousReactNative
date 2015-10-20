import { Icon } from 'react-native-icons';
import React from 'react-native';
import Colors from '../utilities/colors';

const {
  View,
  Text,
  ScrollView,
  StyleSheet,
} = React;

class CartView extends React.Component {

  render() {
    let {team, purveyors, appState} = this.props;
    let cart = team.cart
    let products = appState.teams.products;
    console.log('CART PROPS', this.props.team);
    console.log('PURVEYORS', appState);
    return (
      <ScrollView style={styles.scrollView}>
        { _.map(purveyors, (purveyor, idx) => {
          if (cart.orders[purveyor.id] != null) {
            let purveyorProducts = _.keys(cart.orders[purveyor.id].products);
            let productName = '';
            let productRows = purveyorProducts.map((purveyorProduct, index) => {
              console.log('PRODUCT', cart.orders[purveyor.id].products[purveyorProduct])
              let quantity = cart.orders[purveyor.id].products[purveyorProduct].quantity
              let appProduct = _.find(products, (product) => {
                return product.id == purveyorProduct
              });
              productName = appProduct.name;
              if (productName)
                return <Text style={styles.productTitle} key={index}>{quantity} {productName}</Text>;
            });
            return (
              <View style={styles.purveyorContainer}>
                <Text style={styles.purveyorTitle} key={idx}>{purveyor.name}</Text>
                {productRows}
              </View>
            );
          }
        })}
      </ScrollView>
    );
  }
}

let styles = StyleSheet.create({
  purveyorContainer: {
    marginLeft: 10,
    marginRight: 10,
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
  scrollView: {
    backgroundColor: '#f2f2f2',
    flex: 1,
  },
})

export default CartView
