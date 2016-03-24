import React from 'react-native';
import _ from 'lodash';
import moment from 'moment';
import { Icon } from 'react-native-icons';
import Colors from '../utilities/colors';
import CartViewListItem from './cartViewListItem';
import GenericModal from './modal/genericModal';
import ConfirmationModal from './modal/confirmationModal';
import MiniCalendar from 'react-native-minicalendar';

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
      purveyorDeliveryDates: {},
      purveyor: null,
      showPurveyorInfo: false,
      showConfirmationModal: false,
      showDeliveryDateCalendar: false,
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
    } else if(numberOfOrdersUpdated && numberOfOrdersUpdated.length !== this.state.numberOfOrders){
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
    if (this.props.connected === true && this.props.offlineQueueCount === 0 && this.state.numberOfOrders > 0) {
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

  onDateSelect(date) {
    let purveyorDeliveryDates = Object.assign({}, this.state.purveyorDeliveryDates)
    purveyorDeliveryDates[this.state.purveyor.id] = date
    this.setState({
      purveyorDeliveryDates: purveyorDeliveryDates
    })
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
    const {cartItems, cartPurveyors, products, connected, teamBetaAccess, offlineQueueCount} = this.props

    if(connected === false){
      return (
        <View style={styles.container}>
          <Text style={styles.inaccessible}>Cart inaccessible in offline mode</Text>
        </View>
      )
    }

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
              this.props.onSendCart({
                purveyorIds: this.state.purveyorIds,
                purveyorDeliveryDates: this.state.purveyorDeliveryDates,
              }, this.state.navigateToFeed);
            }
          })
        }}
      />
    )
    const purveyorCalendarDismiss = (setDate) => {
      let purveyorDeliveryDates = Object.assign({}, this.state.purveyorDeliveryDates)
      if(setDate === false){
        delete purveyorDeliveryDates[this.state.purveyor.id]
      }
      this.setState({
        purveyorDeliveryDates: purveyorDeliveryDates,
        showDeliveryDateCalendar: false,
        purveyor: null,
      })
    }
    const calendarModal = (
      <GenericModal
        modalVisible={this.state.showDeliveryDateCalendar}
        onHideModal={purveyorCalendarDismiss.bind(this, false)}
        modalHeaderText={`Request Delivery Date (optional)`}
        modalSubHeaderText={`Today's Date: ${moment().format('ddd M/DD')}`}
        leftButton={{
          text: 'Clear',
          onPress: purveyorCalendarDismiss.bind(this, false)
        }}
        rightButton={{
          text: 'Set',
          onPress: purveyorCalendarDismiss.bind(this, true)
        }}
      >
        <MiniCalendar
          dayHeadings={['Su','Mo','Tu','We','Th','Fr','Sa']}
          onDateSelect={::this.onDateSelect}
          startDate={moment().format('YYYY-MM-DD')}
          selectedDate={(this.state.purveyor && this.state.purveyorDeliveryDates.hasOwnProperty(this.state.purveyor.id) === true) ? moment(this.state.purveyorDeliveryDates[this.state.purveyor.id]).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')}
          numberOfDaysToShow={14}
          enabledDaysOfTheWeek={this.state.purveyor ? this.state.purveyor.deliveryDays.split(',') : []}
          headingStyle={{backgroundColor: Colors.blue}}
          activeDayStyle={{backgroundColor: Colors.lightBlue, color: 'white'}}
          disabledDayStyle={{backgroundColor: Colors.disabled, color: Colors.darkGrey}}
          selectedDayStyle={{backgroundColor: Colors.gold}}
        />
      </GenericModal>
    )

    let cartViewDetails = (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyContainerText}>Your cart is empty - add items from your Order Guide to start an order.</Text>
      </View>
    )
    if(this.state.numberOfOrders > 0){
      let submitOrderIconColor = 'white'
      if(connected === false || offlineQueueCount !== 0){
        submitOrderIconColor =  Colors.darkGrey
      }
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
                    <Icon name='material|info' size={30} color='white' style={styles.detailsIcon} />
                    <Text style={styles.purveyorTitle}>{purveyor.name}</Text>
                  </View>
                </TouchableHighlight>
              </View>
              <View style={styles.purveyorInfoRight}>
                { teamBetaAccess.hasOwnProperty('showDeliveryDate') === true && teamBetaAccess.showDeliveryDate === true ?
                  <TouchableHighlight
                    underlayColor='transparent'
                    onPress={() => {
                      this.setState({
                        showDeliveryDateCalendar: true,
                        purveyor: purveyor,
                      })
                    }}
                  >
                    <Icon name='material|calendar' size={30} color={ this.state.purveyorDeliveryDates.hasOwnProperty(purveyor.id) === true ? Colors.gold : 'white'} style={styles.calendarIcon} />
                  </TouchableHighlight>
                : null }
                <TouchableHighlight
                  underlayColor='transparent'
                  onPress={() => {
                    const singlePurveyor = true
                    this.handleSubmitPress([purveyor], singlePurveyor)
                  }}
                >
                  <Icon name='material|check-circle' size={30} color={submitOrderIconColor} style={styles.submitOrderIcon} />
                </TouchableHighlight>
              </View>
            </View>
            {this.renderPurveyorProducts(purveyor.id, cartItems, products)}
          </View>
        );
      })

      if(cartItems.hasOwnProperty(null) === true){
        cartViewDetails.push((
          <View key={'no-purveyor'} style={styles.purveyorContainer}>
            <View style={[styles.purveyorInfo, {backgroundColor: Colors.disabled}]}>
              <View style={styles.purveyorInfoLeft}>
                <View style={styles.purveyorTitleContainer}>
                  <Text style={styles.purveyorTitle}>Missing data</Text>
                </View>
              </View>
            </View>
            {this.renderPurveyorProducts(null, cartItems, products)}
          </View>
        ))
      }
    }

    let buttonDisabled = {}
    let buttonDisabledFlag = false
    if(connected === false || offlineQueueCount !== 0 || this.state.numberOfOrders === 0 || cartPurveyors.length === 0){
      buttonDisabled = styles.buttonDisabled
      buttonDisabledFlag = true
    }

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {cartViewDetails}
        </ScrollView>
        <TouchableOpacity
          onPress={() => {
            if(buttonDisabledFlag === false){
              this.handleSubmitPress(cartPurveyors)
            }
          }}
          style={[
            styles.button,
            buttonDisabled
          ]}
          activeOpacity={.75}
        >
          <Text style={styles.buttonText}>Submit All Orders</Text>
        </TouchableOpacity>
        {modal}
        {confirmationModal}
        {calendarModal}
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
    flexDirection: 'row',
    flex: 3,
    justifyContent: 'flex-start',
  },
  purveyorInfoRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  purveyorTitleContainer: {
    flexDirection: 'row',
    paddingLeft: 5,
  },
  purveyorTitle: {
    flex: 7,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'OpenSans',
    fontSize: 18,
    lineHeight: 26,
    paddingTop: 10,
  },
  detailsIcon: {
    width: 36,
    height: 50,
  },
  calendarIcon: {
    width: 50,
    height: 50,
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
    paddingBottom: 1,
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
  inaccessible: {
    color: Colors.disabled,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'OpenSans',
    paddingTop: 25,
  },
})

export default CartView
