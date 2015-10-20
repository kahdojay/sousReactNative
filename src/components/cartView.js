import { Icon } from 'react-native-icons';
import React from 'react-native';
import Colors from '../utilities/colors';

const {
  View,
  Text,
  ScrollView,
} = React;

class CartView extends React.Component {

  render() {
    let {team, purveyors, appState} = this.props;
    let cart = team.cart
    let products = appState.teams.products;
    console.log('CART PROPS', this.props.team);
    console.log('PURVEYORS', appState);
    return (
      <ScrollView >
        { _.map(purveyors, (purveyor, idx) => {
          if (cart.orders[purveyor.id] != null) {
            let purveyorProducts = _.keys(cart.orders[purveyor.id].products);
            let productName = '';
            let productRows = purveyorProducts.map((purveyorProduct, index) => {
              let appProduct = _.find(products, (product) => {
                return product.id == purveyorProduct
              });
              productName = appProduct.name;
              if (productName)
                return <Text key={index}>{productName}</Text>;
            });
            return (
              <View>
                <Text key={idx}>{purveyor.name}</Text>
                {productRows}
              </View>
            );
          }
        })}
      </ScrollView>
    );
  }
}


export default CartView
