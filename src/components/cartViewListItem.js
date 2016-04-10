import React from 'react-native';
import { Icon } from 'react-native-icons';
import Colors from '../utilities/colors';
import { CART } from '../actions/actionTypes';
import Swipeout from 'react-native-swipeout';
import PickerModal from './modal/pickerModal';

const {
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

const window = Dimensions.get('window');

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
        <Icon name='material|edit' size={30} color={Colors.lightBlue} style={styles.iconEdit}/>
      ),
      onPress: () => {
       this.props.onProductEdit(product)
      }
    },
    {
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
          <View style={styles.productContainer}>
            <View key={product.id} style={styles.productDetails}>
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
                <View style={styles.productQuantityInnerContainer}>
                  <Text style={styles.productQuantity}>{quantity} {productUnit}</Text>
                  <View style={styles.caretContainer}>
                    <Icon name='material|caret-up' size={13} color='black' style={styles.iconCaret} />
                    <Icon name='material|caret-down' size={13} color='black' style={styles.iconCaret} />
                  </View>
                </View>
              </TouchableHighlight>
              {rowDisabled === true ?
                <View style={styles.productContainerDisabled}>
                  <Text style={styles.productDisabledText}>{rowDisabledReason}</Text>
                </View>
              : null}
            </View>
            {!!product.description.trim() ? (
                <View>
                  <Text style={styles.productNoteText}>"{product.description}" 
                  </Text>
                </View>
              ) : (<View></View>)}
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
    backgroundColor: 'white',
    borderRadius: 3,
    marginTop: 1,
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
  productDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productDisabledText: {
    flex: 1,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  productNoteText: {
    width: window.width * .85,
    color: Colors.darkGrey,
    fontSize: 12,
    fontStyle: 'italic',
  },
  icon: {
    width: 30,
    height: 30,
  },
  iconEdit: {
    flex: 1,
    alignSelf: 'center',
    width: 54,
    height: 40,
    marginLeft: 2,
    marginTop: 7,
    marginBottom: 7,
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
    fontFamily: 'OpenSans',
    fontSize: 14,
  },
  productQuantityContainer: {
    flex: 1,
  },
  productQuantityInnerContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  productQuantity: {
    padding: 5,
    textAlign: 'right',
  },
  caretContainer: {
    alignSelf: 'center',
  },
  iconCaret: {
    width: 8,
    height: 8,
  },
})


export default CartViewListItem
