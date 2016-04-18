import React from 'react-native';
import OrderListItem from './orderListItem';
import GenericModal from './modal/genericModal';
import moment from 'moment';
import { Icon } from 'react-native-icons';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';

const {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} = React;

const window = Dimensions.get('window');

class OrderContentsView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      order: null,
      products: null,
      purveyor: null,
      loaded: false,
      selectAll: this.checkAllReceived(this.props.products),
      showConfirm: false,
      confirmationMessage: null,
      userId: null
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      order: nextProps.order,
      purveyor: nextProps.purveyor,
      products: nextProps.products,
      selectAll: this.checkAllReceived(nextProps.products),
    })
  }

  componentWillMount(){
    this.setState({
      order: this.props.order,
      products: this.props.products,
      purveyor: this.props.purveyor,
      loaded: true,
      userId: this.props.userId,
    }, () => {
      if(this.checkMissingData() === true){
        this.props.onGetOrderDetails(this.state.orderId)
      }
    })
  }

  checkMissingData() {
    const {
      order,
      purveyor,
      products,
    } = this.state;
    return (products === null || products.length === 0 || purveyor === null || order === null)
  }

  getNumberSelected() {
    let count = 0
    this.props.products.forEach(function(product) {
      count += product.cartItem.status === 'RECEIVED' ? 1 : 0
    })
    return count
  }

  checkAllReceived(products) {
    let allChecked = true
    _.each(products, (productPkg, idx) => {
      if (productPkg.cartItem.status !== 'RECEIVED')
        allChecked = false
    })
    return allChecked
  }

  selectAllProducts() {
    this.setState({
      selectAll: !this.state.selectAll
    })
    _.each(this.state.products, (productPkg, idx) => {
      const cartItem = productPkg.cartItem
      const productConfirmed = (cartItem.status === 'RECEIVED')
      const updateCartItem = Object.assign({}, cartItem, {
        status: this.state.selectAll ? 'ORDERED' : 'RECEIVED'
      })
      this.props.onConfirmOrderProduct(updateCartItem)
    })
  }

  confirmOrder() {
    let confirmedOrder = Object.assign({}, this.state.order.confirm)
    confirmedOrder.userId = this.state.userId
    confirmedOrder.order = true
    confirmedOrder.confirmedAt = (new Date()).toISOString()

    let msg = `${this.getNumberSelected()} of ${this.state.products.length} delivered. ${this.state.confirmationMessage || ''}`
    let orderComments = this.state.order.comments || []
    orderComments.unshift({
      userId: this.props.userId,
      author: this.props.userName,
      text: msg,
      createdAt: new Date().toISOString()
    })

    this.setState({
      order: Object.assign({}, this.state.order, {
        confirm: confirmedOrder,
        comments: orderComments,
      })
    }, () => {
      this.props.onUpdateOrder(this.state.order)

      this.props.onSendConfirmationMessage({
        type: 'orderConfirmation',
        purveyor: this.state.purveyor.name,
        text: msg,
        orderId: this.state.order.id,
      });
      this.props.onNavToInvoices(this.state.order.id)
    })
  }

  render() {
    let { products, order, purveyor, } = this.props    
    let productsList = []

    if(this.state.loaded === true){
      let missingProducts = []
      _.each(products, (productPkg, idx) => {
        const product = productPkg.product
        const cartItem = productPkg.cartItem
        const productConfirm = (cartItem.status === 'RECEIVED')
        let productKey = `missing-id-${idx}`
        if(cartItem.hasOwnProperty('id') === true){
          productKey = cartItem.id
        }

        if(!product || !cartItem){
          missingProducts.push(productPkg)
        } else {
          productsList.push(
            <OrderListItem
              key={productKey}
              teamBetaAccess={{}}
              orderConfirm={order.confirm}
              product={product}
              cartItem={cartItem}
              onProductEdit={() => {
                this.props.onProductEdit(product)
              }}
              productConfirm={productConfirm}
              onHandleProductConfirm={(updateCartItem) => {
                this.props.onConfirmOrderProduct(updateCartItem)
              }}
            />
          )
        }
      })
      if(missingProducts.length > 0){
        productsList.push(
          <View style={styles.row}>
            <View style={{flex: 1}}>
              <Text style={styles.missing}>Product details unavailable</Text>
            </View>
          </View>
        )
      }
    }

    let confirmModal = (
      <GenericModal
        ref='errorModal'
        modalVisible={this.state.showConfirm}
        modalHeaderText='Order Delivered'
        modalSubHeaderText='(Only members of your team will be notified)'
        onHideModal={() => {
          this.setState({
            showConfirm: false,
          })
        }}
        leftButton={{
          text: 'Cancel',
          onPress: () => {
            if(order.confirm.order === false){
              this.setState({
                showConfirm: false,
              })
            }
          }
        }}
        rightButton={{
          text: 'Confirm',
          onPress: () => {
            if(order.confirm.order === false){
              this.setState({
                showConfirm: false,
              }, () => {
                this.confirmOrder()
              })
            }
          }
        }}
      >
        <View style={styles.confirmationHeaderContainer}>
          <Text style={styles.confirmationHeaderText}>{purveyor.name} order delivered</Text>
          <Text style={styles.confirmationSubText}>({`${this.getNumberSelected()} of ${this.state.products.length} received`})</Text>
        </View>
        <Text>{' '}</Text>
        <Icon name='material|check-circle' size={50} color={Colors.green} style={styles.iconConfirm}/>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Note to team:</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor={Colors.inputPlaceholderColor}
            value={this.state.confirmationMessage}
            placeholder='"All set"'
            onChangeText={(text) => {
              if(order.confirm.order === false){
                this.setState({
                  confirmationMessage: text
                })
              }
            }}
            onEndEditing={() => {}}
          />
        </View>
      </GenericModal>
    )

    return (
      <View style={styles.orderContentsContainer}>
          <View style={styles.sectionSubHeader}>
            <Text># Rcvd</Text>
            { order.confirm.order === false ? 
              <TouchableHighlight
                onPress={::this.selectAllProducts}                      
                underlayColor='transparent'
              >
                <Text style={styles.buttonSelectAll}>{this.state.selectAll ? 'Unselect All' : 'Select All'}</Text>
              </TouchableHighlight>
              : <Text>Delivered</Text> }
          </View>
          <View style={styles.scrollViewContainer}>
            <ScrollView
              automaticallyAdjustContentInsets={false}
              keyboardShouldPersistTaps={false}
              style={styles.scrollView}
            >
              {productsList}
            </ScrollView>
          </View>
          {confirmModal}
          <View style={styles.separator} />
          { order.confirm.order === false ?
              <TouchableHighlight
                onPress={() => {
                  if(order.confirm.order === false){
                    this.setState({
                      showConfirm: true
                    })
                  }
                }}
                underlayColor='transparent'
                style={styles.buttonConfirmContainer}
              >
                  <Text style={styles.buttonText}>Confirm Delivery</Text>
              </TouchableHighlight>
          : null }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  orderContentsContainer: {
    flex: 1,
    backgroundColor: Colors.mainBackgroundColor,
  },
  sectionSubHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f3f3f3',
    paddingLeft: 5,
    paddingRight: 10,
  },
  buttonSelectAll: {
    color: Colors.lightBlue,
    fontWeight: 'bold',
  },
  scrollViewContainer: {
    flex: 16,
  },
  buttonConfirmContainer: {
    flex: 2,
    justifyContent: 'center',
    borderRadius: Sizes.rowBorderRadius,
    backgroundColor: Colors.gold,
    alignSelf: 'stretch',
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 16,
    paddingBottom: 1,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'OpenSans',
  },
  confirmationHeaderContainer: {
    flex: 1,
    alignItems: 'center',
  },
  confirmationHeaderText: {
    fontSize: 14,
  },
  confirmationSubText: {
    fontSize: 12,
  },
  iconConfirm: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    marginBottom: 10,
  },
  inputContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    width: window.width * .5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  inputLabel: {
    flex: 1,
    fontSize: 12,
  },
  input: {
    flex: 5,
    textAlign: 'center',
    height: 30,
  },
  text: {
    fontFamily: 'OpenSans',
    color: Colors.greyText,
  },
})

export default OrderContentsView;