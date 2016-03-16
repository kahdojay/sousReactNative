import React from 'react-native';
import { Icon, } from 'react-native-icons';
import _ from 'lodash';
import CheckBox from './checkbox';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import PickerModal from './modal/pickerModal';

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
      loaded: false,
      editQuantity: false,
      quantityReceived: null,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      orderConfirm: nextProps.orderConfirm,
      product: nextProps.product,
      cartItem: nextProps.cartItem,
      productConfirm: nextProps.productConfirm,
      quantityReceived: nextProps.cartItem.quantityReceived || nextProps.cartItem.quantity,
    })
  }

  componentWillMount(){
    this.setState({
      orderConfirm: this.props.orderConfirm,
      product: this.props.product,
      cartItem: this.props.cartItem,
      productConfirm: this.props.productConfirm,
      loaded: true,
      quantityReceived: this.props.cartItem.quantityReceived || this.props.cartItem.quantity,
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
      let quantityItems = []
      quantityItems = quantityItems.concat(_.map(_.range(1, 501), (n, idx) => {
        return {
          key: idx,
          value: n,
          label: n.toString(),
        }
      }))
      const modal = (
        <PickerModal
          modalVisible={this.state.editQuantity}
          headerText='Select Quantity Received'
          leftButtonText='Update'
          items={quantityItems}
          pickerType='PickerIOS'
          selectedValue={this.state.quantityReceived}
          onHideModal={() => {
            this.setState({
              editQuantity: false,
            })
          }}
          onSubmitValue={(value) => {
            if(value !== null && value.hasOwnProperty('selectedValue') === true){
              const selectedValue = value.selectedValue
              this.setState({
                quantityReceived: selectedValue,
                editQuantity: false,
              },() => {
                const updateCartItem = Object.assign({}, cartItem, {
                  quantityReceived: this.state.quantityReceived
                })
                this.props.onHandleProductConfirm(updateCartItem)
              })
            }
          }}
        />
      )

      productRow = (
        <View style={styles.row}>
          <TouchableWrapper
            underlayColor='transparent'
            onPress={() => {
              this.setState({
                editQuantity: true,
              })
            }}
            style={{flex: 1}}
          >
            <View style={styles.quantityContainer}>
              <Text style={styles.quantity}>{cartItem.quantityReceived || cartItem.quantity}x</Text>
            </View>
          </TouchableWrapper>
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
            style={{flex: 8}}
          >
            <View style={{flexDirection: 'row', alignItems: 'center',}}>
              <View style={styles.productInfo}>
                <Text style={[styles.text, styles.boldText]}>{product.name}</Text>
                <Text style={styles.text}>Ordered: {cartItem.quantity} x {product.amount} {product.unit}</Text>
              </View>
              <View style={styles.confirmCheckbox}>
                <View style={[styles.iconContainer]}>
                  <Icon name={iconName} size={20} color={iconColor} style={[styles.icon]}/>
                </View>
              </View>
            </View>
          </TouchableWrapper>
          {modal}
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
  quantityContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  quantity: {
    textAlign: 'center',
    fontFamily: 'OpenSans',
    fontSize: 18,
    width: 36,
    borderColor: Colors.lightGrey,
    borderWidth: .5,
    borderRadius: 15,
  },
  text: {
    fontFamily: 'OpenSans',
  },
  boldText: {
    fontWeight: 'bold',
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
