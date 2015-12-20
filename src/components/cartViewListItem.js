import React from 'react-native';
import { Icon } from 'react-native-icons';
import Colors from '../utilities/colors';
import {
  CART
} from '../actions/actionTypes';
import Swipeout from 'react-native-swipeout';

const {
  Modal,
  PickerIOS,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

class CartViewListItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      quantity: this.props.cartProduct.quantity,
      editQuantity: false,
    }
  }

  render() {
    const {purveyorId, product, cartProduct} = this.props;
    let quantity = this.state.quantity * product.amount;
    if(quantity.toString().indexOf('.') !== -1){
      quantity = parseFloat(Math.floor(quantity * 1000)/1000)
    }
    const productName = product.name || '';
    let productUnit = product.unit;
    if(cartProduct.quantity > 1){
      if(product.unit == 'bunch'){
        productUnit += 'es';
      } else if(product.unit !== 'ea' && product.unit !== 'dozen' && product.unit !== 'cs'){
        productUnit += 's';
      }
    }

    const buttons = [{
      backgroundColor: 'transparent',
      component: (
        <Icon name='material|delete' size={30} color={Colors.lightBlue} style={styles.iconRemove}/>
      ),
      onPress: () => {
        this.props.onDeleteProduct(purveyorId, product.id)
      }
    }]

    const quantities = _.range(1, 501)
    const modal = (
      <Modal
        animated={true}
        transparent={true}
        visible={this.state.editQuantity}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalInnerContainer}>
            <PickerIOS
              selectedValue={this.state.quantity}
              onValueChange={(quantity) => {
                this.setState({
                  quantity: quantity,
                })
              }}
              style={{width: 260, alignSelf: 'center'}}
            >
              {
                quantities.map((n, idx) => {
                  return <PickerIOS.Item key={idx} value={n} label={n.toString()} />
                })
              }
            </PickerIOS>
            <View style={styles.separator} />
            <TouchableHighlight
              onPress={() => {
                this.setState({
                  editQuantity: false,
                }, () => {
                  if (this.state.quantity > .1) {
                    const cartAttributes = {
                      purveyorId: purveyorId,
                      productId: product.id,
                      quantity: this.state.quantity,
                    };
                    this.props.onUpdateProductInCart(CART.ADD, cartAttributes)
                  }
                })
              }}
              underlayColor='transparent'
            >
              <Text style={styles.modalButtonText}>
                {`Update to ${quantity} ${productUnit}`}
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    )

    return (
      <View>
        <Swipeout
          right={buttons}
          close={true}
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
            >
              <Text style={styles.productQuantity}>{quantity} {productUnit}</Text>
            </TouchableHighlight>
          </View>
        </Swipeout>
        {modal}
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
    paddingRight: 5,
  },
  icon: {
    width: 30,
    height: 30,
  },
  iconRemove: {
    flex: 1,
    alignSelf: 'center',
    width: 54,
    height: 30,
    marginLeft: 2,
    marginTop: 7,
    marginBottom: 7,
  },
  productTitle: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 5,
    paddingBottom: 10,
    fontFamily: 'OpenSans',
    fontSize: 14,
  },
  productQuantity: {
    width: 50,
    margin: 5,
    textAlign: 'right',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalInnerContainer: {
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 20,
  },
  modalButtonText: {
    textAlign: 'center',
    color: Colors.lightBlue,
    paddingTop: 15,
  },
  separator: {
    height: 0,
    borderBottomColor: '#bbb',
    borderBottomWidth: 1,
  },
})


export default CartViewListItem
