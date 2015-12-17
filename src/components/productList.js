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
      products: this.props.products.slice(0,15)
    })
  }

  componentDidMount() {
    if(this.props.products.length > 15){
      setTimeout(() => {
        this.setState({
          products: this.props.products.slice(0,30)
        })
      }, 300)
    }
    if(this.props.products.length > 30){
      setTimeout(() => {
        this.setState({
          products: this.props.products.slice(0,60)
        })
      }, 500)
    }
    if(this.props.products.length > 60){
      setTimeout(() => {
        this.setState({
          products: this.props.products
        })
      }, 700)
    }
  }

  render() {
    const {cart, purveyors} = this.props
    let productList = []
    if(this.state.products !== null){
      _.forEach(_.filter(this.state.products, (product) => {
        return product.deleted !== true
      }), (product, idx) => {
        if(product === null){
          return;
        }
        let loadDelay = 250
        // for everything off screen
        // - index greater than 15
        if(idx > 130){
          loadDelay = 1000
        } else if(idx > 80){
          loadDelay = 900
        } else if(idx > 50){
          loadDelay = 800
        } else if(idx > 30){
          loadDelay = 700
        } else if(idx > 20) {
          loadDelay = 600
        } else if(idx > 15) {
          loadDelay = 500
        }

        let cartItem = null
        let cartPurveyorId = ''
        product.purveyors.map((purveyorId) => {
          if (cart.orders.hasOwnProperty(purveyorId) === true && cart.orders[purveyorId].products.hasOwnProperty(product.id)) {
            cartPurveyorId = purveyorId
            cartItem = cart.orders[purveyorId].products[product.id]
          }
        })
        productList.push((
          <ProductListItem
            cartItem={cartItem}
            cartPurveyorId={cartPurveyorId}
            loadDelay={loadDelay}
            key={idx}
            product={product}
            purveyors={purveyors}
            onProductEdit={() => {
              this.props.onProductEdit(product)
            }}
            onUpdateProductInCart={(cartAction, cartAttributes) => {
              this.props.onUpdateProductInCart(cartAction, cartAttributes)
            }}
          />
        ))
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
