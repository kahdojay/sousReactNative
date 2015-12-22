import React from 'react-native';
import _ from 'lodash';
import CheckBox from './checkbox';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';

const {
  PropTypes,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

class OrderView extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {order, purveyor, products} = this.props;

    const productsList = _.map(products, (product) => {
      const productDetails = order.orderDetails.products[product.id]

      return (
        <View key={product.id} style={styles.row}>
          <Text style={styles.quantity}>{productDetails.quantity}</Text>
          <View style={styles.productInfo}>
            <Text>{product.name}</Text>
            <Text>{product.amount} {product.unit}</Text>
          </View>
          <View style={styles.confirmCheckbox}>
            <CheckBox
              checked={productDetails.confirmed || false}
              label=''
              onChange={(checked) => {
                console.log(checked)
              }}
            />
          </View>
        </View>
      )
    })

    return (
      <View style={styles.container}>
        <TouchableHighlight
          onPress={() => {
            console.log('here')
          }}
        >
          <Text>Confirm Delivery</Text>
        </TouchableHighlight>
        <ScrollView
          automaticallyAdjustContentInsets={false}
          keyboardShouldPersistTaps={false}
          style={styles.scrollView}
        >
          {productsList}
        </ScrollView>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.mainBackgroundColor,
  },
  row: {
    marginTop: 5,
    marginBottom: 5,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: Sizes.rowBorderRadius,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  quantity: {
    textAlign: 'center',
    padding: 2,
    marginRight: 4,
    fontFamily: 'OpenSans',
    fontSize: 18,
    width: 36,
  },
  productInfo: {
    flex: 6
  },
  confirmCheckbox: {
    flex: 1
  }
});

OrderView.propTypes = {
};

export default OrderView
