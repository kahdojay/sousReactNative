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
    const {cart, products} = this.props
    let productList = _.map(products, (product, idx) => {
      return (
        <ProductListItem
          cart={cart}
          product={product}
          key={idx}
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
