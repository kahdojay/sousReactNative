import React from 'react-native';
import _ from 'lodash';
import { Icon } from 'react-native-icons';
import Colors from '../utilities/colors';
import CartViewListItem from './cartViewListItem';
import GenericModal from './modal/genericModal';
import ConfirmationModal from './modal/confirmationModal';

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
    this.state = {
      numberOfProducts: 0,
      numberOfOrders: 0,
      purveyorIds: [],
      showPurveyorInfo: false,
      purveyor: null,
      showConfirmationModal: false,
      confirmationMessage: 'Send order?',
      navigateToFeed: true,
    }
  }

  getCounts(props) {
    const numberOfOrders = Object.keys(props.cartItems)
    const numberOfProducts = _.reduce(_.map(numberOfOrders, (orderId) => {
      const filteredProducts = _.filter(Object.keys(props.cartItems[orderId]), (cartItemId) => {
        const cartItem = props.cartItems[orderId][cartItemId]
        return cartItem.status === 'NEW'
      })
      return filteredProducts.length
    }), (total, n) => {
      return total + n
    })
    return {
      numberOfOrders,
      numberOfProducts
    }
  }

  shouldComponentUpdate(nextProps) {
    const {numberOfOrdersUpdated, numberOfProductsUpdated} = this.getCounts(nextProps)
    if(nextProps.connected !== false){
      return true;
    } else if(numberOfOrdersUpdated.length !== this.state.numberOfOrders){
      return true;
    } else if(numberOfProductsUpdated !== this.state.numberOfProducts){
      return true;
    }
    return false;
  }

  componentWillMount() {
    const {numberOfOrders, numberOfProducts} = this.getCounts(this.props)
    this.setState({
      numberOfOrders: numberOfOrders.length,
      numberOfProducts: numberOfProducts,
    })
  }

  componentWillReceiveProps(nextProps) {
    const {numberOfOrders, numberOfProducts} = this.getCounts(nextProps)
    this.setState({
      numberOfOrders: numberOfOrders.length,
      numberOfProducts: numberOfProducts,
    })
  }

  handleSubmitPress(cartPurveyors, singlePurveyor) {
    if (this.props.connected === true && this.state.numberOfOrders > 0) {
      let confirmationMessage = cartPurveyors.length > 1 ? `Send orders to ${cartPurveyors.length} purveyors?` : `Send order to ${cartPurveyors[0].name}?`
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
    const cartItemIds = _.filter(Object.keys(cartItems[purveyorId]), (cartItemId) => {
      return cartItems[purveyorId][cartItemId].status === 'NEW'
    })
    const purveyorCartItems = _.sortBy(_.map(cartItemIds, (cartItemId) => {
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
      <ConfirmationModal
        modalVisible={this.state.showConfirmationModal}
        confirmationMessage={this.state.confirmationMessage}
        onHideModal={() => {
          this.setState({
            showConfirmationModal: false
          })
        }}
        onConfirmNo={() => {
          this.setState({
            showConfirmationModal: false
          })
        }}
        onConfirmYes={() => {
          this.setState({
            showConfirmationModal: false,
          }, () => {
            if(this.state.numberOfOrders > 0){
              // console.log(this.state.purveyorIds);
              this.props.onSubmitOrder(this.state.purveyorIds, this.state.navigateToFeed);
            }
          })
        }}
      />
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
          <Text style={styles.buttonText}>Submit All Orders</Text>
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
    height: 60,
    borderTopColor: Colors.separatorColor,
    borderTopWidth: 1,
    backgroundColor: Colors.gold,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    padding: 10,
    paddingBottom: 11,
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
