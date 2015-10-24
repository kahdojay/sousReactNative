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
      products: this.props.products.slice(0,7)
    })
  }

  componentDidMount() {
    if(this.props.products.length > 7){
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
        // - index greater than 7
        // - multiplied by fibonacci sequence
        if(idx > 91){
          loadDelay = 900
        } else if(idx > 56){
          loadDelay = 800
        } else if(idx > 35){
          loadDelay = 700
        } else if(idx > 21){
          loadDelay = 600
        } else if(idx > 14) {
          loadDelay = 500
        } else {
          loadDelay = 300
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
    }
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
