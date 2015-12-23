import React from 'react-native';
import _ from 'lodash';
import CheckBox from './checkbox';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';

const {
  PropTypes,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

class OrderListItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      orderConfirm: null,
      product: null,
      productDetails: null,
      productConfirm: null,
      loaded: false
    }
  }

  componentWillMount(){
    this.setState({
      orderConfirm: this.props.orderConfirm,
      product: this.props.product,
      productDetails: this.props.productDetails,
      productConfirm: this.props.productConfirm,
      loaded: true
    })
  }

  render() {
    const {orderConfirm, product, productDetails, productConfirm} = this.state
    let productRow = null
    if(this.state.loaded === false){
      productRow = (
        <Text>Loading...</Text>
      )
    } else {
      productRow = (
        <View style={styles.row}>
          <Text style={styles.quantity}>{productDetails.quantity}</Text>
          <View style={styles.productInfo}>
            <Text>{product.name}</Text>
            <Text>{product.amount} {product.unit}</Text>
          </View>
          <View style={styles.confirmCheckbox}>
            <CheckBox
              checked={productConfirm}
              label=''
              disabled={orderConfirm.order === true ? true : orderConfirm.order}
              iconColor={orderConfirm.order === false ? 'black' : Colors.disabled}
              onChange={(checked) => {
                if(orderConfirm.order === false){
                  this.setState({
                    productConfirm: !productConfirm
                  },() => {
                    this.props.onHandleProductConfirm(product.id, this.state.productConfirm)
                  })
                }
              }}
            />
          </View>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        {productRow}
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flex: 1,
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

OrderListItem.propTypes = {
}

export default OrderListItem
