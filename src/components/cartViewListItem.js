import React from 'react-native';
import { Icon } from 'react-native-icons';
import Colors from '../utilities/colors';
import { CART } from '../actions/actionTypes';
import Swipeout from 'react-native-swipeout';
import PickerModal from './modal/pickerModal';

const {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

class CartViewListItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      quantity: this.props.cartItem.quantity,
      editQuantity: false,
    }
  }

  render() {
    const {purveyorId, product, cartItem} = this.props;
    let quantity = this.state.quantity * product.amount;
    if(quantity.toString().indexOf('.') !== -1){
      quantity = parseFloat(Math.floor(quantity * 1000)/1000)
    }
    const productName = product.name || '';
    let productUnit = product.unit;
    if(cartItem.quantity > 1){
      if(product.unit === 'bunch'){
        productUnit += 'es';
      } else if(product.unit !== 'ea' && product.unit !== 'dozen' && product.unit !== 'cs'){
        productUnit += 's';
      }
    }

    const buttons = [{
      backgroundColor: 'transparent',
      component: (
        <Icon name='material|close' size={30} color={Colors.lightBlue} style={styles.iconRemove}/>
      ),
      onPress: () => {
        this.props.onUpdateProductInCart(CART.DELETE, cartItem)
      }
    }]

    let quantityItems = []
    quantityItems = quantityItems.concat(_.map(_.range(1, 501), (n, idx) => {
      return {
        key: idx,
        value: n,
        label: n.toString(),
      }
    }))

    let rowDisabled = false
    // let rowDisabledReason = ''
    // if(product.purveyors.indexOf(purveyorId) === -1){
    //   rowDisabled = true
    //   rowDisabledReason = 'Product purveyor changed'
    // }

    return (
      <View>
        <Swipeout
          right={buttons}
          backgroundColor={Colors.mainBackgroundColor}
        >
          <View key={product.id} style={styles.productContainer}>
            <Text style={styles.productTitle}>{productName}</Text>
            <TouchableHighlight
              onPress={() => {
                this.setState({
                  editQuantity: true
                })
              }}
              underlayColor='transparent'
              style={styles.productQuantityContainer}
            >
              <Text style={styles.productQuantity}>{quantity} {productUnit}</Text>
            </TouchableHighlight>
            {rowDisabled === true ?
              <View style={styles.productContainerDisabled}>
                <Text style={styles.productDisabledText}>{rowDisabledReason}</Text>
              </View>
            : null}
          </View>
        </Swipeout>
        <PickerModal
          modalVisible={this.state.editQuantity}
          headerText='Select Amount'
          leftButtonText='Update'
          items={quantityItems}
          pickerType='PickerIOS'
          selectedValue={this.state.quantity}
          onHideModal={() => {
            this.setState({
              editQuantity: false,
            })
          }}
          onSubmitValue={(value) => {
            if(value !== null && value.hasOwnProperty('selectedValue') === true){
              const selectedValue = value.selectedValue
              this.setState({
                quantity: selectedValue,
                editQuantity: false,
              }, () => {
                if (this.state.quantity > .1) {
                  const cartAttributes = Object.assign({}, cartItem, {
                    quantity: this.state.quantity,
                  });
                  this.props.onUpdateProductInCart(CART.UPDATE, cartAttributes)
                }
              })
            }
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  productContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    marginTop: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 5,
    paddingBottom: 5,
    overflow: 'hidden',
  },
  productContainerDisabled: {
    height: 50,
    backgroundColor: 'rgba(50, 50, 50, 0.65)',
    position: 'absolute',
    left: 0,
    right: -10,
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productDisabledText: {
    flex: 1,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  icon: {
    width: 30,
    height: 30,
  },
  iconRemove: {
    flex: 1,
    alignSelf: 'center',
    width: 54,
    height: 40,
    marginLeft: 2,
    marginTop: 7,
    marginBottom: 7,
  },
  picker: {
    width: 260,
    alignSelf: 'center',
    borderTopColor: Colors.separatorColor,
    borderTopWidth: 1,
    borderBottomColor: Colors.separatorColor,
    borderBottomWidth: 1,
  },
  productTitle: {
    flex: 2,
    paddingTop: 10,
    paddingLeft: 5,
    paddingBottom: 10,
    fontFamily: 'OpenSans',
    fontSize: 14,
  },
  productQuantityContainer: {
    flex: 1,
  },
  productQuantity: {
    padding: 5,
    textAlign: 'right',
  },
})


export default CartViewListItem
