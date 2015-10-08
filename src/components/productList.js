import React from 'react-native';
import ProductListItem from './productListItem';
import {
  greyText,
  productCompletedBackgroundColor
} from '../utilities/colors';

let {
  View,
  PropTypes,
  StyleSheet,
  Text,
  TouchableHighlight,
} = React;

export default class ProductList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showCompleted: true
    }
  }
  handlePress() {
    this.setState({showCompleted: !this.state.showCompleted})
  }
  render() {
    let products = this.props.products
    let productsCompleted = _.filter(products, { completed: true, deleted: false })
      .map((product, index) => {
           return <ProductListItem
            product={product}
            key={index}
            name={product.name}
            completed={product.completed}
            productId={product.id}
            navigator={this.props.navigator}
            onPress={() => this.props.onProductClick(product.id)}
            onChangeQuantity={this.props.updateProductQuantity} />
        })
    let productsIncomplete = _.filter(products, { completed: false, deleted: false })
      .map((product, index) => {
          return <ProductListItem
            product={product}
            key={index}
            name={product.name}
            quantity={product.quantity}
            completed={product.completed}
            productId={product.id}
            navigator={this.props.navigator}
            onPress={() => this.props.onProductClick(product.id)}
            onChangeQuantity={this.props.updateProductQuantity} />
        })
    return (
      <View>
        {productsIncomplete}
        <TouchableHighlight
          onPress={this.handlePress.bind(this)}
        >
          <View style={styles.container}>
            <View style={styles.roundedCorners}>
              <Text style={styles.text}>{productsCompleted.length} Completed Items</Text>
            </View>
          </View>
        </TouchableHighlight>
        {this.state.showCompleted ? productsCompleted : <View />}
      </View>
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
  // onProductClick: PropTypes.func.isRequired,
  // products: PropTypes.arrayOf(PropTypes.shape({
    // text: PropTypes.string.isRequired,
    // completed: PropTypes.bool.isRequired
  // }).isRequired).isRequired
};
