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
    let {purveyor} = this.props
    let productsOrdered = _.filter(purveyor.products, { ordered: true, deleted: false })
      .map((product, idx) => {
           return <ProductListItem
            product={product}
            key={idx}
            purveyorId={purveyor.id}
            navigator={this.props.navigator}
            onUpdateProduct={(productAttributes) => {
              this.props.onUpdatePurveyorProduct(purveyor.id, product.productId, productAttributes);
            }} />
        })
    let productsUnordered = _.filter(purveyor.products, { ordered: false, deleted: false })
      .map((product, idx) => {
          return <ProductListItem
            product={product}
            key={idx}
            purveyorId={purveyor.id}
            navigator={this.props.navigator}
            onUpdateProduct={(productAttributes) => {
              this.props.onUpdatePurveyorProduct(purveyor.id, product.productId, productAttributes);
            }} />
        })
    return (
      <View>
        {productsUnordered}
        <TouchableHighlight
          onPress={this.handlePress.bind(this)}
        >
          <View style={styles.container}>
            <View style={styles.roundedCorners}>
              <Text style={styles.text}>{productsOrdered.length} Ordered</Text>
            </View>
          </View>
        </TouchableHighlight>
        {this.state.showCompleted ? productsOrdered : <View />}
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
  // onUpdatePurveyorProduct: PropTypes.func.isRequired,
  // products: PropTypes.arrayOf(PropTypes.shape({
    // ordered: PropTypes.bool.isRequired
  // }).isRequired).isRequired
};
