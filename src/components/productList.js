import React from 'react-native';
import ProductListItem from './productListItem';
import { greyText, productCompletedBackgroundColor } from '../utilities/colors';

const {
  View,
  PropTypes,
  StyleSheet,
  Text,
  ScrollView,
  TouchableHighlight,
} = React;

class ProductList extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const {cart, products, productsCount} = this.props
    const productList = _.map(products, (product, idx) => {
      let loadDelay = 50
      // for everything off screen
      // - index greater than 7
      // - multiplied by fibonacci sequence
      // - in multiples of 75
      if(idx > 91){
        loadDelay = 625
      } else if(idx > 56){
        loadDelay = 550
      } else if(idx > 35){
        loadDelay = 475
      } else if(idx > 21){
        loadDelay = 400
      } else if(idx > 14) {
        loadDelay = 325
      } else {
        loadDelay = 250
      }
      return (
        <ProductListItem
          cart={cart}
          loadDelay={loadDelay}
          product={product}
          key={idx}
          purveyors={this.props.purveyors}
          onUpdateProductInCart={this.props.onUpdateProductInCart}
        />
      )
    })
    return (
      <ScrollView keyboardShouldPersistTaps={false} >
        {productList}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 5,
  },
  roundedCorners: {
    backgroundColor: productCompletedBackgroundColor,
    width: 150,
    borderRadius: 10,
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    backgroundColor: productCompletedBackgroundColor,
    fontWeight: 'bold',
    color: greyText,
    paddingTop: 5,
    paddingBottom: 3,
    width: 140,
  },
})

ProductList.propTypes = {
};

export default ProductList
