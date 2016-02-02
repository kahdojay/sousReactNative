import React from 'react-native';
import { Icon, } from 'react-native-icons';
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
      cartItem: null,
      productConfirm: null,
      loaded: false
    }
  }

  componentWillMount(){
    this.setState({
      orderConfirm: this.props.orderConfirm,
      product: this.props.product,
      cartItem: this.props.cartItem,
      productConfirm: this.props.productConfirm,
      loaded: true
    })
  }

  render() {
    const {orderConfirm, product, cartItem, productConfirm} = this.state
    let productRow = null
    if(this.state.loaded === false){
      productRow = (
        <View style={styles.row}>
          <View style={{flex: 1}}>
            <Text style={styles.loading}>Loading.</Text>
          </View>
        </View>
      )
    } else if(!product || !cartItem){
      productRow = (
        <View style={styles.row}>
          <View style={{flex: 1}}>
            <Text style={styles.missing}>Product details unavailable.</Text>
          </View>
        </View>
      )
    } else {
      let iconName = 'material|square-o'
      if(productConfirm){
        iconName = 'material|check-square'
      }
      let TouchableWrapper = TouchableHighlight
      let iconColor = 'black'
      if(orderConfirm.order === true){
        TouchableWrapper = View
        iconColor = Colors.disabled
      }
      productRow = (
        <TouchableWrapper
          underlayColor='transparent'
          onPress={() => {
            if(orderConfirm.order === false){
              this.setState({
                productConfirm: !productConfirm
              },() => {
                const updateCartItem = Object.assign({}, cartItem, {
                  status: this.state.productConfirm === true ? 'RECEIVED' : 'ORDERED'
                })
                this.props.onHandleProductConfirm(updateCartItem)
              })
            }
          }}
        >
          <View style={styles.row}>
            <Text style={styles.quantity}>{cartItem.quantity}</Text>
            <View style={styles.productInfo}>
              <Text style={styles.text}>{product.name}</Text>
              <Text style={styles.text}>{product.amount} {product.unit}</Text>
            </View>
            <View style={styles.confirmCheckbox}>
              <View style={[styles.iconContainer]}>
                <Icon name={iconName} size={20} color={iconColor} style={[styles.icon]}/>
              </View>
            </View>
          </View>
        </TouchableWrapper>
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
  text: {
    fontFamily: 'OpenSans',
  },
  loading: {
    textAlign: 'center',
    fontFamily: 'OpenSans',
    fontSize: 12,
    color: Colors.darkGrey,
    fontStyle: 'italic',
  },
  missing: {
    textAlign: 'center',
    fontFamily: 'OpenSans',
    fontSize: 11,
    color: Colors.disabled,
    fontStyle: 'italic',
  },
  productInfo: {
    flex: 6
  },
  confirmCheckbox: {
    flex: 1
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
  },
});

OrderListItem.propTypes = {
}

export default OrderListItem
