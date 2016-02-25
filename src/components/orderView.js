import React from 'react-native';
import { Icon, } from 'react-native-icons';
import _ from 'lodash';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import OrderListItem from './orderListItem';
import moment from 'moment';
import messageUtils from '../utilities/message';
import GenericModal from './modal/genericModal';
import Loading from './loading';

const {
  PropTypes,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} = React;

class OrderView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      orderId: null,
      orderFetching: false,
      userId: null,
      order: null,
      products: null,
      purveyor: null,
      // messages: null,
      teamsUsers: null,
      loaded: false,
      showConfirm: false,
      confirmationMessage: '',
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      orderId: nextProps.orderId,
      orderFetching: nextProps.orderFetching,
      order: nextProps.order,
      purveyor: nextProps.purveyor,
      products: nextProps.products,
    })
  }

  componentWillMount(){
    this.setState({
      orderId: this.props.orderId,
      orderFetching: this.props.orderFetching,
      userId: this.props.userId,
      order: this.props.order,
      products: this.props.products,
      purveyor: this.props.purveyor,
      // messages: this.props.messages,
      teamsUsers: this.props.teamsUsers,
      loaded: true,
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

  confirmOrder() {
    let orderConfirm = Object.assign({}, this.state.order.confirm)
    orderConfirm.userId = this.state.userId
    orderConfirm.order = true
    orderConfirm.confirmedAt = (new Date()).toISOString()
    this.setState({
      order: Object.assign({}, this.state.order, {
        confirm: orderConfirm
      })
    }, () => {
      this.props.onConfirmOrder(this.state.order)
      this.props.onSendConfirmationMessage({
        type: 'orderConfirmation',
        purveyor: this.state.purveyor.name,
        text: this.state.confirmationMessage,
        orderId: this.state.order.id,
      });
      // this.props.onNavToOrders()
      this.props.onNavToInvoices(this.state.order.id)
    })
  }

  render() {
    const {
      order,
      purveyor,
      products,
      // messages,
      teamsUsers,
    } = this.state;

    if(this.checkMissingData() === true){
      return (
        <View style={styles.container}>
          <Text style={[styles.text, styles.textCentered, {padding: 25}]}>Order details unavailable.</Text>
          { this.state.orderFetching === true ?
            <Loading />
          :
            <TouchableHighlight
              underlayColor='transparent'
              onPress={() => {
                this.props.onGetOrderDetails(this.state.orderId)
              }}
            >
              <View style={styles.updateOrderContainer}>
                <Text style={styles.updateOrder}>Update</Text>
              </View>
            </TouchableHighlight>
          }
        </View>
      )
    }

    let productsList = null
    let modal = null

    if(this.state.loaded === true){
      productsList = []
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
              orderConfirm={order.confirm}
              product={product}
              cartItem={cartItem}
              productConfirm={productConfirm}
              onHandleProductConfirm={this.props.onConfirmOrderProduct}
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

      if(order.confirm.order === false){
        modal = (
          <GenericModal
            ref='errorModal'
            modalVisible={this.state.showConfirm}
            modalHeaderText='Confirmation Message'
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
            <View style={styles.inputContainer}>
              <Text>
                <Text style={styles.orderText}>{purveyor.name}</Text> order checked in.
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  multiline={true}
                  style={styles.input}
                  placeholderTextColor={Colors.inputPlaceholderColor}
                  value={this.state.confirmationMessage}
                  placeholder='Add a note to the message.'
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
            </View>
          </GenericModal>
        )
      }
    }

    let buttonDisabledStyle = []
    let buttonTextDisabledStyle = []
    let confirmUser = null
    let senderName = null

    if(order.hasOwnProperty('sender')){
      senderName = order.sender
    }
    if(order.confirm.order === true){
      buttonDisabledStyle = styles.buttonDisabled
      buttonTextDisabledStyle = styles.buttonTextDisabled
      confirmUser = teamsUsers[order.confirm.userId]
    }

    let confirmUserName = ''
    if(confirmUser){
      confirmUserName = `${confirmUser.firstName} ${confirmUser.lastName[0]}.`
    }

    let invoiceIconBackgroundColor = 'white'
    let invoiceIconCheckmarkColor = 'transparent'
    let invoiceButtonText = 'Upload Invoice(s)'
    let confirmedContainerBackgroundColor = Colors.disabled
    let invoiceButtonContainerBackgroundColor = Colors.gold
    let invoiceButtonTextColor = 'white'
    // if(true){
    if(order.hasOwnProperty('invoices') === true && order.invoices.length > 0){
      invoiceIconBackgroundColor = Colors.green
      invoiceIconCheckmarkColor = 'white'
      invoiceButtonText = 'View Invoice(s)'
      invoiceButtonContainerBackgroundColor = 'white'
      invoiceButtonTextColor = Colors.lightBlue
    }
    if(order.confirm.order === true){
      confirmedContainerBackgroundColor = Colors.sky
    }

    return (
      <View style={styles.container}>
        { this.state.loaded === true ?
          <View style={styles.container}>
            { order.confirm.order === true ?
              <View>
                <View style={[styles.confirmedContainer, styles.buttonContainerLink, styles.buttonContainer, {backgroundColor: confirmedContainerBackgroundColor}]}>
                  <View style={styles.confirmedIconContainer}>
                    <Icon name='material|circle' size={20} color={invoiceIconBackgroundColor} style={styles.confirmedIconContainer}>
                      <Icon name='material|check' size={25} color={invoiceIconCheckmarkColor} style={styles.confirmedIconCheckmark} />
                    </Icon>
                  </View>
                  <View style={{flex: 9 }}>
                    {senderName ? <Text style={[styles.confirmedText]}>Order sent by: {senderName}</Text> : <View/>}
                    <Text style={[styles.confirmedText]}>Delivery confirmed by: {confirmUserName}</Text>
                    <Text style={[styles.confirmedText]}>{order.confirm.confirmedAt !== null ? moment(order.confirm.confirmedAt).format('M/D/YY h:mm a') : ''}</Text>
                  </View>
                </View>
                <View style={styles.separator} />
              </View>
            : null }
            { order.confirm.order === true ?
              <View>
                <TouchableHighlight
                  underlayColor='transparent'
                  onPress={() => {
                    this.props.onNavToInvoices(order.id)
                  }}
                >
                  <View style={[styles.invoiceButtonContainer, {backgroundColor: invoiceButtonContainerBackgroundColor}]}>
                    <Text style={[styles.invoiceButtonText, {color: invoiceButtonTextColor}]}>{invoiceButtonText}</Text>
                  </View>
                </TouchableHighlight>
                <View style={styles.separator} />
              </View>
            : null }
            <ScrollView
              automaticallyAdjustContentInsets={false}
              keyboardShouldPersistTaps={false}
              style={styles.scrollView}
            >
              {productsList}
            </ScrollView>
            {modal}
            { order.confirm.order === false ?
              <View>
                <View style={styles.separator} />
                <TouchableHighlight
                  onPress={() => {
                    if(order.confirm.order === false){
                      this.setState({
                        showConfirm: true
                      })
                    }
                  }}
                  underlayColor='transparent'
                  style={styles.buttonContainerLink}
                >
                  <View style={[styles.buttonContainer, buttonDisabledStyle]}>
                    <Text style={[styles.buttonText, buttonTextDisabledStyle]}>Confirm & Upload Invoice</Text>
                  </View>
                </TouchableHighlight>
              </View>
            : null }
          </View>
        : <Text style={[styles.text, styles.textCentered, {padding: 25}]}>Loading, please wait.</Text> }
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBackgroundColor,
  },
  confirmedContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.sky,
    alignItems: 'center',
    margin: 10,
    borderRadius: 3,
    padding: 8,
  },
  confirmedIconContainer: {
    width: 30,
    height: 30,
  },
  confirmedIconCheckmark: {
    width: 25,
    height: 25,
    backgroundColor: 'transparent',
    marginLeft: 6,
  },
  invoiceButtonContainer: {
    height: 60,
    alignItems: 'center',
    backgroundColor: Colors.gold,
    justifyContent: 'center',
  },
  invoiceButtonText: {
    color: 'white',
    fontSize: Sizes.inputFieldFontSize,
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
    paddingBottom: 1,
  },
  buttonContainerLink: {
  },
  buttonContainer: {
    height: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: Colors.disabled,
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 16,
    paddingBottom: 1,
    color: Colors.lightBlue,
    fontWeight: 'bold',
    fontFamily: 'OpenSans',
  },
  buttonTextDisabled: {
    color: Colors.greyText,
  },
  confirmedText: {
    alignSelf: 'center',
    fontSize: 14,
    color: Colors.inputTextColor,
    fontFamily: 'OpenSans',
  },
  orderMessage: {
    backgroundColor: 'white',
    padding: 5,
    margin: 5,
    borderRadius: 3,
  },
  separator: {
    height: 0,
    borderBottomColor: Colors.separatorColor,
    borderBottomWidth: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.mainBackgroundColor,
    paddingTop: 5,
  },
  inputContainer: {
    flex: 1,
    padding: 10,
    marginBottom: 20,
  },
  orderText: {
    fontWeight: 'bold',
    color: Colors.blue,
  },
  inputWrapper: {
    borderBottomColor: Colors.inputUnderline,
    borderBottomWidth: 1,
  },
  input: {
    flex: 1,
    padding: 4,
    fontSize: Sizes.inputFieldFontSize,
    color: Colors.inputTextColor,
    fontFamily: 'OpenSans',
    textAlign: 'center',
    height: 40,
  },
  text: {
    fontFamily: 'OpenSans',
    color: Colors.greyText,
  },
  textCentered: {
    textAlign: 'center',
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
  missing: {
    textAlign: 'center',
    fontFamily: 'OpenSans',
    fontSize: 11,
    color: Colors.disabled,
    fontStyle: 'italic',
  },
  updateOrderContainer: {
    alignSelf: 'center',
    backgroundColor: 'white',
    width: 100,
    padding: 10,
    borderRadius: Sizes.inputBorderRadius,
  },
  updateOrder: {
    textAlign: 'center',
    fontFamily: 'OpenSans',
    color: Colors.lightBlue,
    fontSize: 12,
  },
});

OrderView.propTypes = {
};

export default OrderView
