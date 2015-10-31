import React from 'react-native';
import { Icon } from 'react-native-icons'
import ProductList from '../components/productList';
import { BackBtn } from '../utilities/navigation';
import { NavigationBarStyles } from '../utilities/styles';
import AddForm from './addForm';
import { mainBackgroundColor, navbarColor } from '../utilities/colors';
import Colors from '../utilities/colors';
import _ from 'lodash'
import { nameSort } from '../utilities/utils';

const {
  StyleSheet,
  View,
  PropTypes,
  TouchableHighlight,
  TouchableOpacity,
  Text,
  Image
} = React;

class CategoryView extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {cart, category, products} = this.props
    // const products = _.filter(this.props.products, (product) => {
    //   if (category.products.indexOf(product.id) !== -1)
    //     return product
    // })
    // products.sort(nameSort); // sort in-place

    // console.log(products);
    return (
      <View style={styles.container}>
        {/*<AddForm
          placeholder="Add a Product..."
          onSubmit={(productName) => {
            this.props.onAddNewProduct(category.id, productName)
          }}
        />*/}
        {/*<TouchableHighlight
          underlayColor='#eee'
          onPress={() => {
            this.props.onCreateProduct(category.id)
          }}
          style={styles.createButton}
        >
          <Text style={styles.createButtonText}>Create New Product...</Text>
        </TouchableHighlight>*/}
        <ProductList
          cart={cart}
          productsCount={category.products.length}
          products={products}
          purveyors={this.props.purveyors}
          onUpdateProductInCart={this.props.onUpdateProductInCart}
        />
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mainBackgroundColor,
  },
  logoImage: {
    width: 45,
    height: 45,
  },
  iconMore: {
    width: 40,
    height: 40,
  },
  createButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 7,
  },
  createButtonText: {
    color: Colors.navbarIconColor,
    padding: 5,
    marginLeft: 10,
    fontFamily: 'OpenSans',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

CategoryView.propTypes = {
};

export default CategoryView
