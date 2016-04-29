import React from 'react-native';
import { Icon, } from 'react-native-icons';
import _ from 'lodash';
import s from 'underscore.string';
import CheckBox from './checkbox';
import Swipeout from 'react-native-swipeout';
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
    if(nextProps.actionType === 'RECEIVE_CART_ITEM'){
      // console.log(nextProps.actionType)
      this.setState({
        orderConfirm: nextProps.orderConfirm,
        product: nextProps.product,
        cartItem: nextProps.cartItem,
        productConfirm: nextProps.productConfirm,
        quantityReceived: nextProps.cartItem.quantityReceived || nextProps.cartItem.quantity,
      })
    }
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
    const {teamBetaAccess} = this.props

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

      // let showProductPrices = false
      // if(
      //   teamBetaAccess.hasOwnProperty('showProductPrices') === true
      //   && teamBetaAccess.showProductPrices === true
      // ){
      //   showProductPrices = true
      // }

      productRow = (
        <View style={styles.container}>
          <View style={styles.row}>
            <TouchableWrapper
              underlayColor='transparent'
              onPress={() => {
                this.setState({
                  editQuantity: true,
                })
              }}
              style={{flex: 1.25}}
            >
              <View style={styles.quantityContainer}>
                {this.props.orderConfirm.order === false ?
                  <View style={styles.caretContainer}>
                    <Icon name='material|caret-up' size={13} color='black' style={styles.iconCaret} />
                    <Icon name='material|caret-down' size={13} color='black' style={styles.iconCaret} />
                  </View>
                : <View style={styles.caretContainer}/>}
                <Text style={styles.quantity}>{cartItem.quantityReceived || cartItem.quantity}x</Text>
              </View>
            </TouchableWrapper>
            <TouchableWrapper
              underlayColor='transparent'
              onPress={() => {
                if(orderConfirm.order === false){
                  this.setState({
                    productConfirm: !this.state.productConfirm
                  })
                  const updateCartItem = Object.assign({}, cartItem, {
                    status: this.state.productConfirm === true ? 'ORDERED' : 'RECEIVED'
                  })
                  this.props.onHandleProductConfirm(updateCartItem)
                }
              }}
              style={{flex: 8}}
            >
              <View style={{flexDirection: 'row', alignItems: 'center',}}>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.text}><Text style={{fontStyle: 'italic'}}>Ord.</Text> {cartItem.quantity}x {product.amount}{product.unit} {(product.price && !!product.price.trim()) ? '• $' + s.numberFormat(parseFloat(product.price), 2) : ''}</Text>
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
          <View style={styles.separator} />
        </View>
      )
    }

    let wrappedProductRow = this.props.orderConfirm.order === false ?
      <Swipeout
        right={[{
        backgroundColor: 'white',
        component: (
          <Icon name='material|edit' size={30} color={Colors.lightBlue} style={styles.iconEdit}/>
        ),
        onPress: this.props.onProductEdit
      }]}
      >
        {productRow}
      </Swipeout>
    : productRow
    return (
      <View style={styles.container}>
        {wrappedProductRow}
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
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  quantityContainer: {
    flexDirection: 'row',
  },
  quantity: {
    flex: 3,
    textAlign: 'left',
    fontFamily: 'OpenSans',
    fontSize: 18,
  },
  caretContainer: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
  },
  iconCaret: {
    width: 8,
    height: 8,
  },
  text: {
    fontFamily: 'OpenSans',
  },
  productName: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  iconEdit: {
    flex: 1,
    alignSelf: 'center',
    width: 54,
    height: 40,
    marginLeft: 2,
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
    flex: 6,
    paddingLeft: 5,
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
  separator: {
    height: 0,
    borderBottomColor: Colors.separatorColor,
    borderBottomWidth: 1,
  },
});

OrderListItem.propTypes = {
}

export default OrderListItem
