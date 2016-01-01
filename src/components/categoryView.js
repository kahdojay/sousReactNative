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
    const {cartItems, category, products, purveyors} = this.props;
    return (
      <View style={styles.container}>
        <ProductList
          cartItems={cartItems}
          products={products}
          purveyors={purveyors}
          showPurveyorInfo={true}
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
