import React from 'react-native';
import ProductListItem from './productListItem';
import { greyText, productCompletedBackgroundColor } from '../utilities/colors';

const {
  PropTypes,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} = React;

class ProductList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      products: null
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   this.setState({
  //     products: []
  //   }, () => {
  //     this.setState({
  //       products: nextProps.products
  //     })
  //   })
  // }

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
    const {categories, cartItems, purveyors, showPurveyorInfo, showCategoryInfo} = this.props

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
          if (cartItems.hasOwnProperty(purveyorId) === true && cartItems[purveyorId].hasOwnProperty(product.id)) {
            cartPurveyorId = purveyorId
            cartItem = cartItems[purveyorId][product.id]
          }
        })

        let productCategory = null
        if(showCategoryInfo === true){
          Object.keys(categories).forEach((categoryId) => {
            const category = categories[categoryId]
            if(productCategory === null && category.products.indexOf(product.id) !== -1){
              productCategory = category
            }
          })
        }

        const props = {
          cartItem: cartItem,
          cartPurveyorId: cartPurveyorId,
          loadDelay: loadDelay,
          key: idx,
          product: product,
          category: (showCategoryInfo === true) ? productCategory : null,
          purveyors: (showPurveyorInfo === true) ? purveyors: null,
          onProductEdit: () => {
            this.props.onProductEdit(product)
          },
          onProductDelete: () => {
            this.props.onProductDelete(product.id)
          },
          onUpdateProductInCart: this.props.onUpdateProductInCart,
        }

        productList.push(React.createElement(ProductListItem, props))
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

ProductList.propTypes = {
};

export default ProductList
