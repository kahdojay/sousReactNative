import React from 'react-native';
import ProductListItem from './productListItem';
import { greyText, productCompletedBackgroundColor } from '../utilities/colors';

const {
  ListView,
  PropTypes,
  Text,
  View,
} = React;

class ProductList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      products: null,
      allowScroll: true,
    }
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => {
      return r1 !== r2
    }});
  }

  shouldComponentUpdate(nextProps) {
    if(nextProps.products.length !== this.state.products.length){
      return true;
    }
    return false;
  }

  componentWillReceiveProps(nextProps) {
    // this.setState({
    //   products: []
    // }, () => {
    //
    // })

    this.setState({
      products: this.ds.cloneWithRows(nextProps.products)
    })
  }

  componentWillMount() {
    this.setState({
      products: this.ds.cloneWithRows(this.props.products)
    })
  }

  renderRow(product, sectionID, rowID, highlightRow) {
    const {categories, cartItems, purveyors, showPurveyorInfo, showCategoryInfo} = this.props

    let cartItem = null
    let cartPurveyorId = ''
    let specificPurveyors = {}
    product.purveyors.map((purveyorId) => {
      if(purveyors.hasOwnProperty(purveyorId) === true){
        specificPurveyors[purveyorId] = purveyors[purveyorId]
      }
      if (cartItems.hasOwnProperty(purveyorId) === true && cartItems[purveyorId].hasOwnProperty(product.id) === true) {
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
      loadDelay: 0,
      key: product.id,
      product: product,
      showCategoryInfo: showCategoryInfo,
      category: productCategory,
      showPurveyorInfo: showPurveyorInfo,
      purveyors: specificPurveyors,
      onProductEdit: () => {
        this.props.onProductEdit(product)
      },
      onProductDelete: () => {
        let products = _.filter(this.props.products, (tmpProd) => {
          return tmpProd.deleted !== true && tmpProd.id !== product.id
        })
        // TODO: Optimize this for larger lists, perhaps just delete from hashmap
        // and then process?
        this.setState({
          products: this.ds.cloneWithRows(products),
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

    return React.createElement(ProductListItem, props)
  }

  render() {

    if(this.state.products === null){
      return <View></View>
    }

    return (
      <ListView
        contentInset={{bottom:10}}
        automaticallyAdjustContentInsets={false}
        dataSource={this.state.products}
        renderRow={::this.renderRow}
        style={{margin: 0}}
      />
    );
  }
}

ProductList.propTypes = {
};

export default ProductList
