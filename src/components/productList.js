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
      products: null,
      allowScroll: true,
    }
  }

  shouldComponentUpdate(nextProps) {
    if(nextProps.products.length !== this.state.products.length){
      return true;
    }
    return false;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      products: []
    }, () => {
      this.setState({
        products: nextProps.products
      })
    })
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
          key: product.id,
          product: product,
          showCategoryInfo: showCategoryInfo,
          category: productCategory,
          showPurveyorInfo: showPurveyorInfo,
          purveyors: purveyors,
          onProductEdit: () => {
            this.props.onProductEdit(product)
          },
          onProductDelete: () => {
            let products = _.filter(this.state.products, (tmpProd) => {
              return tmpProd.deleted !== true && tmpProd.id !== product.id
            })
            this.setState({
              products: products,
            }, () => {
              this.props.onProductDelete(product.id)
            })
          },
          onUpdateProductInCart: this.props.onUpdateProductInCart,
          onAllowScroll: (allowScroll) => {
            this.setState({
              allowScroll: allowScroll,
            })
          }
        }

        productList.push(React.createElement(ProductListItem, props))
      })
    }
    return (
      <ScrollView
        automaticallyAdjustContentInsets={false}
        keyboardShouldPersistTaps={false}
        scrollEnabled={this.state.allowScroll}
      >
        {productList}
      </ScrollView>
    );
  }
}

ProductList.propTypes = {
};

export default ProductList
