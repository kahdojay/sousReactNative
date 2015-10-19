import React from 'react-native';
import { Icon } from 'react-native-icons'
import ProductList from '../components/productList';
import { BackBtn } from '../utilities/navigation';
import { NavigationBarStyles } from '../utilities/styles';
import AddForm from './addForm';
import { mainBackgroundColor, navbarColor } from '../utilities/colors';
import _ from 'lodash'

const {
  ActionSheetIOS,
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
    const {cart, category} = this.props
    let products = _.filter(this.props.products, (product) => {
      if (category.products.indexOf(product.id) !== -1)
        return product
    })

    if(this.props.ui.keyboard.visible === true){
      // navBar = <View/>
    }
    return (
      <View style={styles.container}>
        {/*<AddForm
          placeholder="Add a Product..."
          onSubmit={(productName) => {
            this.props.onAddNewProduct(category.id, productName)
          }}
        />*/}
        <ProductList
          navigator={this.props.navigator}
          cart={cart}
          products={products}
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
  }
});

CategoryView.propTypes = {
};

export default CategoryView