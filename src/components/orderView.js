import React from 'react-native';
import _ from 'lodash';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import OrderListItem from './orderListItem';
import moment from 'moment';
import messageUtils from '../utilities/message';
import GenericModal from './modal/genericModal';

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
      order: nextProps.order,
      products: nextProps.products,
    })
  }

  componentWillMount(){
    this.setState({
      userId: this.props.userId,
      order: this.props.order,
      products: this.props.products,
      purveyor: this.props.purveyor,
      // messages: this.props.messages,
      teamsUsers: this.props.teamsUsers,
      loaded: true,
    })
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
      this.props.onNavToOrders()
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

    if(products === null || products.length === 0 || purveyor === null || order === null){
      return (
        <View style={styles.container}>
          <Text style={[styles.text, styles.textCentered, {padding: 25}]}>Order details unavailable.</Text>
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

    if(order.confirm.order === true){
      buttonDisabledStyle = styles.buttonDisabled
      buttonTextDisabledStyle = styles.buttonTextDisabled
      confirmUser = teamsUsers[order.confirm.userId]
    }

    let confirmUserName = ''
    if(confirmUser){
      confirmUserName = `${confirmUser.firstName} ${confirmUser.lastName[0]}.`
    }

    return (
      <View style={styles.container}>
        { this.state.loaded === true ?
          <View style={styles.container}>
            <ScrollView
              automaticallyAdjustContentInsets={false}
              keyboardShouldPersistTaps={false}
              style={styles.scrollView}
            >
              {productsList}
            </ScrollView>
            <View style={styles.separator} />
            {modal}
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
                style={styles.buttonContainerLink}
              >
                <View style={[styles.buttonContainer, buttonDisabledStyle]}>
                  <Text style={[styles.buttonText, buttonTextDisabledStyle]}>Confirm & File Invoice</Text>
                </View>
              </TouchableHighlight>
            :
              <View style={[styles.buttonContainerLink, styles.buttonContainer, buttonDisabledStyle]}>
                <Text style={[styles.confirmedText]}>Delivery confirmed by: {confirmUserName}</Text>
                <Text style={[styles.confirmedText]}>{order.confirm.confirmedAt !== null ? moment(order.confirm.confirmedAt).format('M/D/YY h:mm a') : ''}</Text>
              </View>
            }
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
  buttonContainerLink: {
    margin: 10,
  },
  buttonContainer: {
    backgroundColor: 'white',
    borderRadius: 3,
    padding: 10,
  },
  buttonDisabled: {
    backgroundColor: Colors.disabled,
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 16,
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
});

OrderView.propTypes = {
};

export default OrderView
