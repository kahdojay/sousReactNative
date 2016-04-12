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
      selectAll: false,
      showConfirm: false,
      confirmationMessage: '',
      showOrderContents: false,
      showOrderDiscussion: false,
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

  selectAllProducts() {
    this.setState({selectAll: !this.state.selectAll})
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
              teamBetaAccess={this.props.teamBetaAccess}
              orderConfirm={order.confirm}
              product={product}
              cartItem={cartItem}
              productConfirm={this.state.selectAll || productConfirm}
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
    let orderUser = null
    let confirmUser = null
    let confirmUserName = ''
    let confirmTime = ''
    let senderName = null

    if(order.hasOwnProperty('userId')){
      orderUser = teamsUsers[order.userId]
    }

    if(order.hasOwnProperty('sender')){
      senderName = order.sender
    }
    if(order.confirm.order === true){
      buttonDisabledStyle = styles.buttonDisabled
      buttonTextDisabledStyle = styles.buttonTextDisabled
      confirmUser = teamsUsers[order.confirm.userId]
    }

    let invoiceIconBackgroundColor = 'white'
    let invoiceIconCheckmarkColor = 'transparent'
    let invoiceButtonText = 'Upload Invoice(s)'
    let confirmedContainerBackgroundColor = Colors.disabled
    // let invoiceButtonContainerBackgroundColor = Colors.gold
    let invoiceButtonTextColor = 'white'
    // if(true){
    if(order.hasOwnProperty('invoices') === true && order.invoices.length > 0){
      invoiceIconBackgroundColor = Colors.green
      invoiceIconCheckmarkColor = 'white'
      invoiceButtonText = 'View Invoice(s)'
      // invoiceButtonContainerBackgroundColor = 'white'
      invoiceButtonTextColor = Colors.lightBlue
    }
    let receivedBy = ''
    return (
      <View style={styles.container}>
        { this.state.loaded === true ?
          <View style={styles.container}>
            <View style={styles.confirmedContainer}>
              <View style={styles.confirmationDetails}>
                <Text style={styles.purveyorName}>{this.props.purveyor.name}</Text>
                <Text style={[styles.confirmedText]}>Sent: {order.orderedAt !== null ? moment(order.orderedAt).format('ddd M/D, h:mma') : ''} ({orderUser.firstName})</Text>
                {order.confirm.order === true ? (
                    <View>
                      <Text style={[styles.confirmedText]}>{`Received: ${moment(order.confirm.confirmedAt).format('ddd M/D, h:mma')} (${confirmUser.firstName})`}</Text>
                    </View>
                  ) : <View/>
                }
                
              </View>
              <View style={styles.purveyorContactContainer}>
                <Text style={styles.purveyorContactText}>{this.props.purveyor.orderContact} <Text style={styles.purveyorContactSubText}>(rep)</Text></Text>
                <View style={styles.contactIconsContainer}>
                  <Icon name='material|email' size={15} color={'white'} style={styles.iconContact}/>
                  <Icon name='material|phone' size={15} color={'white'} style={styles.iconContact}/>
                  <Icon name='material|smartphone-iphone' size={15} color={'white'} style={styles.iconContact}/>
                </View>
              </View>
            </View>
            <View style={styles.separator} />
            {/* order.confirm.order === true ?
              <View>
                <View style={[styles.confirmedContainer, {backgroundColor: confirmedContainerBackgroundColor}]}>
                  <View style={styles.confirmedIconContainer}>
                    <Icon name='material|circle' size={20} color={invoiceIconBackgroundColor} style={styles.confirmedIconContainer}>
                      <Icon name='material|check' size={25} color={invoiceIconCheckmarkColor} style={styles.confirmedIconCheckmark} />
                    </Icon>
                  </View>
                  <View style={{flex: 9 }}>
                    <Text style={[styles.confirmedText]}>Delivery confirmed by: {confirmUserName}</Text>
                    <Text style={[styles.confirmedText]}>{order.confirm.confirmedAt !== null ? moment(order.confirm.confirmedAt).format('M/D/YY h:mm a') : ''}</Text>
                  </View>
                </View>
                <View style={styles.separator} />
              </View>
            : null */}
            <View style={styles.sectionHeader}>
              <TouchableHighlight
                underlayColor='transparent'
                onPress={() => {
                  this.setState({
                    showOrderContents: !this.state.showOrderContents
                  })
                }}
              >
                <Text style={[styles.invoiceButtonText]}>{'Order Contents'}</Text>
              </TouchableHighlight>
              <View style={styles.separator} />
            </View>
            {this.state.showOrderContents === true ? (
                <ScrollView
                  automaticallyAdjustContentInsets={false}
                  keyboardShouldPersistTaps={false}
                  style={styles.scrollView}
                >
                  <View style={styles.sectionSubHeader}>
                    <Text># Rcvd</Text>
                    <TouchableHighlight
                      onPress={::this.selectAllProducts}                      
                      underlayColor='transparent'
                    >
                      <Text style={styles.buttonSelectAll}>Select All</Text>
                    </TouchableHighlight>
                  </View>
                  <View style={styles.separator} />
                  {productsList}
                </ScrollView>
              ) : <View/>
            }
            <View style={styles.sectionHeader}>
              <TouchableHighlight
                underlayColor='transparent'
                onPress={() => {
                  this.props.onNavToInvoices(order.id)
                }}
              >
                <Text style={[styles.invoiceButtonText]}>{'Invoice/Photos'}</Text>
              </TouchableHighlight>
              <View style={styles.separator} />
            </View>
            <View style={styles.sectionHeader}>
              <TouchableHighlight
                underlayColor='transparent'
                onPress={() => {
                  this.setState({
                    showOrderDiscussion: !this.state.showOrderDiscussion
                  })
                }}
              >
                <Text style={[styles.invoiceButtonText]}>{'Discussion'}</Text>
              </TouchableHighlight>
              <View style={styles.separator} />
            </View>
            {this.state.showOrderDiscussion === true ? (
                <ScrollView
                  automaticallyAdjustContentInsets={false}
                  keyboardShouldPersistTaps={false}
                  style={styles.scrollView}
                >
                  <Text>Order Discussion goes here</Text>
                </ScrollView>
              ) : <View/>
            }
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
                    <Text style={[styles.buttonText, buttonTextDisabledStyle]}>Confirm Delivery</Text>
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
    // backgroundColor: Colors.mainBackgroundColor,
  },
  confirmedContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.lightBlue,
    // backgroundColor: Colors.sky,
    // alignItems: 'center',
    // margin: 10,
    // borderRadius: 3,
    padding: 5,
  },
  confirmationDetails: {
    // backgroundColor: 'red',
    justifyContent: 'center',
    height: 60,
    flex: 3,
  },
  purveyorName: {
    color: 'white',
    fontSize: 20,
  },
  confirmedText: {
    // alignSelf: 'center',
    fontSize: 13,
    color: 'white',
    fontFamily: 'OpenSans',
  },
  purveyorContactContainer: {
    // backgroundColor: 'green',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
  },
  purveyorContactText: {
    fontSize: 15,
    color: 'white',
  },
  purveyorContactSubText: {
    fontSize: 10,
    color: 'white',
  },
  contactIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
  },
  iconContact: {
    // backgroundColor: 'blue',
    borderWidth: .5,
    borderColor: 'white',
    borderRadius: 12.5,
    width: 25,
    height: 25,
  },
  sectionHeader: {
    justifyContent: 'center',
  },
  sectionSubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 5,
    paddingRight: 10,
  },
  buttonSelectAll: {
    color: Colors.lightBlue,
    fontWeight: 'bold',
  },
  // confirmedIconContainer: {
  //   width: 30,
  //   height: 30,
  // },
  // confirmedIconCheckmark: {
  //   width: 25,
  //   height: 25,
  //   backgroundColor: 'transparent',
  //   marginLeft: 6,
  // },
  // invoiceButtonContainer: {
    // height: 60,
    // alignItems: 'center',
    // backgroundColor: Colors.gold,
    // justifyContent: 'center',
  // },
  invoiceButtonText: {
    // color: 'white',
    alignSelf: 'center',
    color: 'black',
    // fontSize: Sizes.inputFieldFontSize,
    fontFamily: 'OpenSans',
    // fontWeight: 'bold',
    // paddingBottom: 1,
  },
  buttonContainerLink: {
  },
  buttonContainer: {
    // height: 60,
    // backgroundColor: 'orange',
    // backgroundColor: 'white',
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
  // orderMessage: {
  //   backgroundColor: 'white',
  //   padding: 5,
  //   margin: 5,
  //   borderRadius: 3,
  // },
  separator: {
    height: 0,
    borderBottomColor: Colors.separatorColor,
    borderBottomWidth: .5,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.mainBackgroundColor,
    paddingTop: 5,
  },
  inputContainer: {
    flex: 1,
    padding: 10,
    // marginBottom: 20,
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
    // marginTop: 5,
    // marginBottom: 5,
    // marginRight: 10,
    // marginLeft: 10,
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
