import React from 'react-native';
import _ from 'lodash';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import OrderListItem from './orderListItem';
import KeyboardSpacer from 'react-native-keyboard-spacer';
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

    let productsList = null
    let modal = null

    if(this.state.loaded === true){
      productsList = _.map(products, (productPkg) => {
        const product = productPkg.product
        const cartItem = productPkg.cartItem
        const productConfirm = (cartItem.status === 'RECEIVED')
        return (
          <OrderListItem
            key={product.id}
            orderConfirm={order.confirm}
            product={product}
            cartItem={cartItem}
            productConfirm={productConfirm}
            onHandleProductConfirm={this.props.onConfirmOrderProduct}
          />
        )
      })

      if(order.confirm.order === false){
        modal = (
          <GenericModal
            ref='errorModal'
            modalVisible={this.state.showConfirm}
            modalHeaderText='Confirmation Message'
            onHideModal={() => {
              this.setState({
                showAddEmailAddress: false,
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

    return (
      <View style={styles.container}>
        { this.state.loaded === true ?
          <View style={styles.container}>
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
                  <Text style={[styles.buttonText, buttonTextDisabledStyle]}>Confirm Delivery</Text>
                </View>
              </TouchableHighlight>
            :
              <View style={[styles.buttonContainerLink, styles.buttonContainer, buttonDisabledStyle]}>
                <Text style={[styles.confirmedText]}>Delivery confirmed by: {`${confirmUser.firstName} ${confirmUser.lastName[0]}.`}</Text>
                <Text style={[styles.confirmedText]}>{order.confirm.confirmedAt !== null ? moment(order.confirm.confirmedAt).format('M/D/YY h:mm a') : ''}</Text>
              </View>
            }
            {modal}
            <View style={styles.separator} />
            <ScrollView
              automaticallyAdjustContentInsets={false}
              keyboardShouldPersistTaps={false}
              style={styles.scrollView}
            >
              {productsList}
            </ScrollView>
          </View>
        : <Text>Loading...</Text> }
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
    color: '#333',
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
    color: Colors.blue
  },
  inputWrapper: {
    borderBottomColor: Colors.inputUnderline,
    borderBottomWidth: 1,
  },
  input: {
    flex: 1,
    padding: 4,
    fontSize: 14,
    color: '#333',
    fontFamily: 'OpenSans',
    height: 40,
  },
});

OrderView.propTypes = {
};

export default OrderView
