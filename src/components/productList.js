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
    this.state = {
      products: null
    }
  }

  componentWillMount() {
    this.setState({
      products: this.props.products.slice(0,10)
    })
  }

  componentDidMount() {
    if(this.props.products.length > 10){
      setTimeout(() => {
        this.setState({
          products: this.props.products.slice(0,21)
        })
      }, 200)
    }
    if(this.props.products.length > 21){
      setTimeout(() => {
        this.setState({
          products: this.props.products.slice(0,50)
        })
      }, 400)
    }
    if(this.props.products.length > 50){
      setTimeout(() => {
        this.setState({
          products: this.props.products
        })
      }, 800)
    }
  }

  render() {
    const {cart} = this.props
    let productList = []
    if(this.state.products !== null){
      productList = _.map(this.state.products, (product, idx) => {
        let loadDelay = 50
        // for everything off screen
        // - index greater than 10
        // - multiplied by fibonacci sequence
        if(idx > 130){
          loadDelay = 900
        } else if(idx > 80){
          loadDelay = 800
        } else if(idx > 50){
          loadDelay = 700
        } else if(idx > 30){
          loadDelay = 600
        } else if(idx > 20) {
          loadDelay = 500
        } else if(idx > 10) {
          loadDelay = 300
        }

        let cartItem = null
        let cartPurveyorId = ''
        product.purveyors.map((purveyorId) => {
          if (cart.orders.hasOwnProperty(purveyorId) === true && cart.orders[purveyorId].products.hasOwnProperty(product.id)) {
            cartPurveyorId = purveyorId
            cartItem = cart.orders[purveyorId].products[product.id]
          }
        })
        return (
          <ProductListItem
            cartItem={cartItem}
            cartPurveyorId={cartPurveyorId}
            loadDelay={loadDelay}
            key={idx}
            product={product}
            purveyors={this.props.purveyors}
            onUpdateProductInCart={(cartAction, cartAttributes) => {
              this.props.onUpdateProductInCart(cartAction, cartAttributes)
            }}
          />
        )
      })
    }
    return (
      <ScrollView
        automaticallyAdjustContentInsets={false}
        keyboardShouldPersistTaps={false}
      >
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
