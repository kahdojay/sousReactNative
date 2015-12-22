import React from 'react-native';
import _ from 'lodash';
import ProductList from '../components/productList';
import Colors from '../utilities/colors';

const {
  PropTypes,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
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
});

CategoryView.propTypes = {
};

export default CategoryView
