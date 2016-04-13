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
  Dimensions,
  PropTypes,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} = React;

const window = Dimensions.get('window');

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
      teamsUsers: null,
      loaded: false,
      selectAll: false,
      showConfirm: false,
      confirmationMessage: null,
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
    _.each(this.state.products, (productPkg, idx) => {
      const cartItem = productPkg.cartItem
      const productConfirmed = (cartItem.status === 'RECEIVED')
      const updateCartItem = Object.assign({}, cartItem, {
        status: 'RECEIVED'
      })
      this.props.onConfirmOrderProduct(updateCartItem)
    })
  }

  getNumberSelected() {
    let count = 0
    this.state.products.forEach(function(product) {
      count += product.cartItem.status === 'RECEIVED' ? 1 : 0
    })
    return count
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
        text: `${this.getNumberSelected()} of ${this.state.products.length} delivered. ${this.state.confirmationMessage || ''}`,
        orderId: this.state.order.id,
      });
      this.props.onNavToInvoices(this.state.order.id)
    })
  }

  render() {
    const {
      order,
      purveyor,
      products,
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
    let invoiceButtonTextColor = 'white'
    if(order.hasOwnProperty('invoices') === true && order.invoices.length > 0){
      invoiceIconBackgroundColor = Colors.green
      invoiceIconCheckmarkColor = 'white'
      invoiceButtonText = 'View Invoice(s)'
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
                <Text style={[styles.confirmedText]}>Ordered: {order.orderedAt !== null ? moment(order.orderedAt).format('ddd M/D, h:mma') : ''} ({orderUser.firstName})</Text>
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
{/* ===Order Contents=== */}
            <View style={styles.sectionHeader}>
              <TouchableHighlight
                underlayColor='transparent'
                onPress={() => {
                  this.setState({
                    showOrderContents: !this.state.showOrderContents
                  })
                }}
              >
                <Text style={[styles.sectionHeaderText]}>{'Order Contents'}</Text>
              </TouchableHighlight>
              <View style={styles.separator} />
            </View>
            <View style={styles.orderContentsContainer}>
              {this.state.showOrderContents === true ? (
                <View>
                  <View style={styles.sectionSubHeader}>
                    <Text># Rcvd</Text>
                    { order.confirm.order === false ? 
                      <TouchableHighlight
                        onPress={::this.selectAllProducts}                      
                        underlayColor='transparent'
                      >
                        <Text style={styles.buttonSelectAll}>Select All</Text>
                      </TouchableHighlight>
                      : null }
                  </View>
                  <ScrollView
                    automaticallyAdjustContentInsets={false}
                    keyboardShouldPersistTaps={false}
                    style={styles.scrollView}
                  >
                    {productsList}
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
                  </ScrollView>
                </View>
              ) : <View/>
              }
            </View>
            <View style={styles.sectionHeader}>
              <TouchableHighlight
                underlayColor='transparent'
                onPress={() => {
                  this.props.onNavToInvoices(order.id)
                }}
              >
                <Text style={[styles.sectionHeaderText]}>{'Invoice/Photos'}</Text>
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
                <Text style={[styles.sectionHeaderText]}>{'Discussion'}</Text>
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
          </View>
        : <Text style={[styles.text, styles.textCentered, {padding: 25}]}>Loading, please wait.</Text> }
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  confirmedContainer: {
    flexDirection: 'row',
    padding: 5,
  },
  confirmationDetails: {
    justifyContent: 'center',
    height: 60,
    flex: 3,
  },
  purveyorName: {
    fontSize: 20,
  },
  confirmedText: {
    fontSize: 13,
    fontFamily: 'OpenSans',
  },
  purveyorContactContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
  },
  purveyorContactText: {
    fontSize: 15,
  },
  purveyorContactSubText: {
    fontSize: 10,
  },
  contactIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
  },
  iconContact: {
    borderWidth: .5,
    borderRadius: 12.5,
    width: 25,
    height: 25,
  },
  sectionHeader: {
    backgroundColor: Colors.lightBlue,
    justifyContent: 'center',
  },
  sectionHeaderText: {
    color: 'white',
    alignSelf: 'center',
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
  invoiceButtonText: {
    alignSelf: 'center',
    color: 'black',
    fontFamily: 'OpenSans',
  },
  buttonContainerLink: {
  },
  buttonContainer: {
    borderRadius: Sizes.rowBorderRadius,
    alignSelf: 'center',
    width: window.width * .9,
    height: 40,
    backgroundColor: Colors.gold,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: Colors.disabled,
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 16,
    paddingBottom: 1,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'OpenSans',
  },
  buttonTextDisabled: {
    color: Colors.greyText,
  },
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
  orderText: {
    fontWeight: 'bold',
    color: Colors.blue,
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
  inputWrapper: {
    // alignItems: 'center',
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
  textCentered: {
    textAlign: 'center',
  },
  row: {
    flex: 1,
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
