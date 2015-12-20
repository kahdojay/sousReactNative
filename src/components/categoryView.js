import React from 'react-native';
import _ from 'lodash';
import ProductList from '../components/productList';
import { BackBtn } from '../utilities/navigation';
import { NavigationBarStyles } from '../utilities/styles';
import AddForm from './addForm';
import Colors from '../utilities/colors';

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
    const {cart, category, products, purveyors} = this.props;
    return (
      <View style={styles.container}>
        <ProductList
          cart={cart}
          products={products}
          purveyors={purveyors}
          onProductEdit={this.props.onProductEdit}
          onProductDelete={this.props.onProductDelete}
          onUpdateProductInCart={this.props.onUpdateProductInCart}
        />
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBackgroundColor,
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
