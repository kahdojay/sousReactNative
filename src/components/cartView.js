import React from 'react-native';
import _ from 'lodash';
import { Icon } from 'react-native-icons';
import Colors from '../utilities/colors';
import CartViewListItem from './cartViewListItem';
import GenericModal from './modal/genericModal';

const {
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} = React;

class CartView extends React.Component {
  constructor(props) {
    super(props)
    const numberOfOrders = Object.keys(this.props.cartItems).length
    const numberOfProducts = _.reduce(_.map(numberOfOrders, (orderId) => {
      return Object.keys(this.props.cartItems[orderId]).length
    }), (total, n) => {
      return total + n
    })
    this.state = {
      numberOfProducts: numberOfProducts,
      numberOfOrders: numberOfOrders,
      purveyorIds: [],
      showPurveyorInfo: false,
      purveyor: null,
      showConfirmationModal: false,
      confirmationMessage: 'Send order?',
      navigateToFeed: true,
    }
  }

  shouldComponentUpdate(nextProps) {
    const numberOfOrdersUpdated = Object.keys(nextProps.cartItems)
    const numberOfProductsUpdated = _.reduce(_.map(numberOfOrdersUpdated, (orderId) => {
      return Object.keys(nextProps.cartItems[orderId]).length
    }), (total, n) => {
      return total + n
    })
    if(nextProps.connected !== false){
      return true;
    } else if(numberOfOrdersUpdated.length !== this.state.numberOfOrders){
      return true;
    } else if(numberOfProductsUpdated !== this.state.numberOfProducts){
      return true;
    }
    return false;
  }

  componentWillReceiveProps(nextProps) {
    const numberOfOrders = Object.keys(nextProps.cartItems)
    const numberOfProducts = _.reduce(_.map(numberOfOrders, (orderId) => {
      return Object.keys(nextProps.cartItems[orderId]).length
    }), (total, n) => {
      return total + n
    })
    this.setState({
      numberOfOrders: numberOfOrders.length,
      numberOfProducts: numberOfProducts,
    })
  }

  handleSubmitPress(cartPurveyors, singlePurveyor) {
    if (this.props.connected === true && this.state.numberOfOrders > 0) {
      let confirmationMessage = 'Send orders to all purveyors?'
      let navigateToFeed = true
      if(singlePurveyor === true){
        confirmationMessage = `Send order to ${cartPurveyors[0].name}?`
        if(this.props.cartPurveyors.length > cartPurveyors.length){
          navigateToFeed = false
        }
      }
      const purveyorIds = _.pluck(cartPurveyors, 'id');
      this.setState({
        purveyorIds: purveyorIds,
        showConfirmationModal: true,
        confirmationMessage: confirmationMessage,
        navigateToFeed: navigateToFeed,
      })
    }
  }

  renderPurveyorProducts(purveyorId, cartItems, products) {
    const purveyorCartItems = _.sortBy(_.map(Object.keys(cartItems[purveyorId]), (cartItemId) => {
      const product = products[cartItems[purveyorId][cartItemId].productId]
      return {
        cartItem: cartItems[purveyorId][cartItemId],
        product: product
      }
    }), 'product.name')

    return purveyorCartItems.map((cartItemPkg) => {
      return (
        <CartViewListItem
          key={cartItemPkg.cartItem.id}
          purveyorId={cartItemPkg.cartItem.purveyorId}
          product={cartItemPkg.product}
          cartItem={cartItemPkg.cartItem}
          onUpdateProductInCart={this.props.onUpdateProductInCart}
        />
      )
    });
  }

  renderDeliveryDays() {
    if(this.state.purveyor === null){
      return <View />
    }
    const daysOfWeek = ['Su','Mo','Tu','We','Th','Fr','Sa']
    const renderedDaysOfWeek = daysOfWeek.map((dow) => {
      let dowStyle = [styles.dayOfWeek]
      if(this.state.purveyor.deliveryDays.indexOf(dow) !== -1){
        dowStyle.push(styles.dayOfWeekActive)
      }
      return (
        <Text key={dow} style={dowStyle}>{dow}</Text>
      )
    })
    return (
      <View style={styles.dayOfWeekContainer}>
        {renderedDaysOfWeek}
      </View>
    )
  }

  render() {
    const {cartItems, cartPurveyors, products} = this.props

    const purveyorInfoDismiss = () => {
      this.setState({
        showPurveyorInfo: false,
        purveyor: null,
      })
    }
    const modal = (
      <GenericModal
        modalVisible={this.state.showPurveyorInfo}
        onHideModal={purveyorInfoDismiss}
        modalHeaderText={this.state.purveyor ? this.state.purveyor.name : ''}
        leftButton={{
          text: 'Ok',
          onPress: purveyorInfoDismiss
        }}
      >
        { this.state.purveyor !== null ?
          <View>
            <View style={styles.purveyorInfoRow}>
              <Text style={styles.purveyorInfoLabel}>Order Cutoff Time</Text>
              <Text style={styles.purveyorInfoData}>{this.state.purveyor.orderCutoffTime}</Text>
            </View>
            <View style={styles.purveyorInfoRow}>
              <Text style={styles.purveyorInfoLabel}>Order Minimum</Text>
              <Text style={styles.purveyorInfoData}>{this.state.purveyor.orderMinimum}</Text>
            </View>
            <View style={styles.purveyorInfoRow}>
              <Text style={styles.purveyorInfoLabel}>Delivery Days</Text>
              {this.renderDeliveryDays()}
            </View>
            {/* * /}<View style={styles.purveyorInfoRow}>
              <Text style={styles.purveyorInfoLabel}>Notes</Text>
              <Text style={styles.purveyorInfoData}>{this.state.purveyor.notes}</Text>
            </View>{/**/}
          </View>
        : <Text>Loading ...</Text> }
      </GenericModal>
    )
    const confirmationModal = (
      <GenericModal
        modalVisible={this.state.showConfirmationModal}
        onHideModal={() => {
          this.setState({
            showConfirmationModal: false
          })
        }}
        leftButton={{
          text: 'No',
          onPress: () => {
            this.setState({
              showConfirmationModal: false
            })
          }
        }}
        rightButton={{
          text: 'Yes',
          onPress: () => {
            this.setState({
              showConfirmationModal: false,
            }, () => {
              if(this.state.numberOfOrders > 0){
                // console.log(this.state.purveyorIds);
                this.props.onSubmitOrder(this.state.purveyorIds, this.state.navigateToFeed);
              }
            })
          }
        }}
      >
        <View>
          <Text style={[styles.centeredText, styles.boldText, {fontFamily: 'OpenSans'}]}>Confirm</Text>
          <Text style={[styles.centeredText, {margin: 15, fontSize: 12,fontFamily: 'OpenSans'}]}>{this.state.confirmationMessage}</Text>
        </View>
      </GenericModal>
    )

    let cartViewDetails = (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyContainerText}>Your cart is empty - add items from your Order Guide to start an order.</Text>
      </View>
    )
    if(this.state.numberOfOrders > 0){
      cartViewDetails = _.map(cartPurveyors, (purveyor) => {
        return (
          <View key={purveyor.id} style={styles.purveyorContainer}>
            <View style={styles.purveyorInfo}>
              <View style={styles.purveyorInfoLeft}>
                <TouchableHighlight
                  onPress={() => {
                    this.setState({
                      showPurveyorInfo: true,
                      purveyor: purveyor,
                    })
                  }}
                  underlayColor='transparent'
                >
                  <View style={styles.purveyorTitleContainer}>
                    <Icon name='material|info' size={20} color='white' style={styles.detailsIcon} />
                    <Text style={styles.purveyorTitle}>{purveyor.name}</Text>
                  </View>
                </TouchableHighlight>
              </View>
              <View style={styles.purveyorInfoRight}>
                <TouchableHighlight
                  underlayColor='transparent'
                  onPress={() => {
                    const singlePurveyor = true
                    this.handleSubmitPress([purveyor], singlePurveyor)
                  }}
                >
                  <Icon name='material|check-circle' size={30} color='white' style={styles.submitOrderIcon} />
                </TouchableHighlight>
              </View>
            </View>
            {this.renderPurveyorProducts(purveyor.id, cartItems, products)}
          </View>
        );
      })
    }

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {cartViewDetails}
        </ScrollView>
        <TouchableOpacity
          onPress={this.handleSubmitPress.bind(this, cartPurveyors)}
          style={[
            styles.button,
            (this.props.connected === false || this.state.numberOfOrders === 0) && styles.buttonDisabled
          ]}
          activeOpacity={.75}
        >
          <Text style={styles.buttonText}>Submit Orders</Text>
        </TouchableOpacity>
        {modal}
        {confirmationModal}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBackgroundColor,
  },
  scrollView: {
    backgroundColor: Colors.mainBackgroundColor,
    flex: 1,
  },
  purveyorContainer: {
    marginLeft: 10,
    marginRight: 10,
  },
  purveyorInfo: {
    backgroundColor: Colors.darkBlue,
    borderRadius: 2,
    marginTop: 1,
    flexDirection: 'row'
  },
  purveyorInfoLeft: {
    flex: 3,
  },
  purveyorInfoRight: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  purveyorTitleContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  purveyorTitle: {
    flex: 7,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'OpenSans',
    fontSize: 18,
    lineHeight: 26,
  },
  detailsIcon: {
    flex: 1,
    height: 26,
  },
  purveyorInfoRow: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  purveyorInfoLabel: {
    flex: 1,
    fontFamily: 'OpenSans',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  purveyorInfoData: {
    flex: 2,
    fontFamily: 'OpenSans',
    fontSize: 12,
    textAlign: 'right',
  },
  submitOrderIcon: {
    width: 50,
    height: 50,
  },
  button: {
    borderTopColor: Colors.separatorColor,
    borderTopWidth: 1,
    backgroundColor: Colors.gold,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    padding: 10,
    fontFamily: 'OpenSans',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: Colors.disabled,
  },
  dayOfWeekContainer: {
    flexDirection: 'row',
    flex:2,
    alignItems: 'center'
  },
  dayOfWeek: {
    flex: 1,
    textAlign: 'center',
    margin: 3,
    color: '#aaa',
    backgroundColor: '#ddd',
  },
  dayOfWeekActive: {
    color: '#222',
    backgroundColor: Colors.gold
  },
  centeredText: {
    textAlign: 'center',
  },
  boldText: {
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 25,
  },
  emptyContainerText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'OpenSans',
    color: Colors.lightGrey,
  },
})

export default CartView
