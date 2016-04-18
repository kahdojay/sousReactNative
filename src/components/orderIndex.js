import React from 'react-native';
import { Icon, } from 'react-native-icons';
import _ from 'lodash';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import moment from 'moment';
import Loading from './loading';

const {
  PropTypes,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  SegmentedControlIOS,
  View,
} = React;

class OrderIndex extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      totalOrders: null,
      orderFetching: false,
      orders: null,
      cartItemsOrders: null,
      cartItems: null,
      purveyors: null,
      teamsUsers: null,
      loaded: false,
      showConfirmedOrders: false,
    }
  }

  componentWillMount(){
    this.setState({
      totalOrders: this.props.totalOrders,
      orderFetching: this.props.orderFetching,
      orders: this.props.orders,
      cartItemsOrders: this.props.cartItemsOrders,
      cartItems: this.props.cartItems,
      purveyors: this.props.purveyors,
      teamsUsers: this.props.teamsUsers,
      showConfirmedOrders: this.props.showConfirmedOrders,
      loaded: true,
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      totalOrders: nextProps.totalOrders,
      orderFetching: nextProps.orderFetching,
      orders: nextProps.orders,
      purveyors: nextProps.purveyors,
      teamsUsers: nextProps.teamsUsers,
    })
  }

  render() {
    const { totalOrders, orders, cartItems, cartItemsOrders, purveyors, teamsUsers } = this.state

    if(this.state.loaded === false){
      return (
        <View />
      )
    }

    let openOrders = _.filter(orders, (order) => {
      return order.confirm.order === false
    })

    let fullOrders = _.map(orders, (order) => {
      let orderItems = null
      if(cartItemsOrders.hasOwnProperty(order.id) === true){
        orderItems = {}
        Object.keys(cartItemsOrders[order.id]).forEach((cartItemId) => {
          orderItems[cartItemId] = cartItems[cartItemId]
        })
      }
      // const orderItems = (cartItems.hasOwnProperty(order.id) === true) ? cartItems[order.id] : null
      const purveyor = (purveyors.hasOwnProperty(order.purveyorId) === true) ? purveyors[order.purveyorId] : null
      const user = teamsUsers.hasOwnProperty(order.userId) === true ? teamsUsers[order.userId] : null
      return Object.assign({}, order, {
        orderItems: orderItems,
        purveyor: purveyor,
        user: user
      })
    })

    let ordersList = _.map(_.sortBy(fullOrders, 'orderedAt').reverse(), (order) => {
      let show = false
      if(this.state.showConfirmedOrders === false && order.confirm.order === false){
        show = true
      } else if(this.state.showConfirmedOrders === true){
        show = true
      }
      if(show === true) {
        const orderedAtDate = moment(order.orderedAt)
        if(order.orderItems === null || order.purveyor === null){
          return (
            <View style={styles.orderRow}>
              <Text style={[styles.metaInfo, {paddingTop: 7, fontStyle: 'italic'}]}>Order details unavailable.</Text>
            </View>
          )
        }
        const itemCount = Object.keys(order.orderItems).length
        let confirmedOrderStyle = {}
        let confirmedOrderMetaInfoStyle = {}
        // console.log(order.confirm.order)
        if(order.confirm.order === true){
          confirmedOrderStyle = styles.confirmedOrder
          confirmedOrderMetaInfoStyle = styles.confirmedOrderMetaInfo
        }

        let orderUserName = ''
        if(order.user !== null){
          orderUserName = `${order.user.firstName} ${order.user.lastName}`
        }
        // let invoiceIconBackgroundColor = Colors.disabled
        // let invoiceIconCheckmarkColor = 'transparent'

        // if(order.confirm.order === true){
          // invoiceIconBackgroundColor = 'white'
        // }

        // if(order.hasOwnProperty('invoices') === true && order.invoices.length > 0){
          // invoiceIconBackgroundColor = Colors.green
          // invoiceIconCheckmarkColor = 'white'
        // }
        return (
          <TouchableOpacity
            key={order.id}
            underlayColor='transparent'
            onPress={() => {
              this.props.onNavToOrder(order.id)
            }}
          >
            <View style={[confirmedOrderStyle, styles.orderRow]}>
              <View style={styles.purveyorContainer}>
                {/*<View style={styles.confirmedIconContainer}>
                  <Icon name='material|circle' size={20} color={invoiceIconBackgroundColor} style={styles.confirmedIconContainer}>
                    <Icon name='material|check' size={25} color={invoiceIconCheckmarkColor} style={styles.confirmedIconCheckmark} />
                  </Icon>
                </View>*/}
                <Text style={styles.purveyorName}>
                  {order.purveyor ? order.purveyor.name : ''}
                  <Text style={[styles.metaInfo,confirmedOrderMetaInfoStyle]}> ({`${itemCount} Item${itemCount > 1 ? 's' : ''}`})</Text>
                </Text>
                <Text style={[styles.metaInfo, confirmedOrderMetaInfoStyle]}>Ordered {orderedAtDate.format('ddd M/D')} {orderedAtDate.format('h:mma')}</Text>
              </View>
              <View style={styles.iconContainer}>
                <Icon name='material|chevron-right' size={30} color={Colors.lightBlue} style={styles.iconArrow}/>
              </View>
            </View>
            <View style={styles.separator}></View>
          </TouchableOpacity>
        )
      }
    })

    if(fullOrders.length < totalOrders){
      ordersList.push((
        <View key={'get-more'}>
          <TouchableOpacity
            onPress={this.props.onGetMoreOrders}
          >
            <Text style={styles.loadMore}>Load more</Text>
          </TouchableOpacity>
        </View>
      ))
    }

    let headerText = ''
    switch (openOrders.length) {
      case 1:
        headerText = '1 Active Order'
      default:
        headerText = `${openOrders.length} Upcoming Deliveries`
    }

    return (
      <View style={styles.container}>
        <View style={styles.orderDetails}>
          <Text style={styles.orderDetailsText}>{headerText}</Text>
        </View>
        <ScrollView
          automaticallyAdjustContentInsets={false}
          keyboardShouldPersistTaps={false}
          style={styles.scrollView}
        >
          {
            ordersList.length > 0 ?
            ordersList :
            <View style={styles.emptyOrdersContainer}>
              <Text style={styles.emptyOrdersGuidance}>You don't have an order history yet, let us know if we can help with setting up your order guide️ 📋✉️</Text>
            </View>
          }
        </ScrollView>
        { this.state.orderFetching === true ?
          <View style={{padding: 50}}>
            <Loading />
          </View>
        : null }
        <View style={styles.separator} />
        <TouchableHighlight
          onPress={() => {
            this.setState({
              showConfirmedOrders: !this.state.showConfirmedOrders
            }, () => {
              this.props.onProcessShowOrders(this.state.showConfirmedOrders)
            })
          }}
          underlayColor='transparent'
          style={styles.buttonContainerLink}
        >
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>
              { this.state.showConfirmedOrders === false ? 'Show Confirmed Orders' : 'Hide Confirmed Orders' }
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBackgroundColor,
  },
  scrollView: {
    flex: 8,
    backgroundColor: Colors.mainBackgroundColor,
  },
  emptyOrdersContainer: {
    padding: 30,
  },
  emptyOrdersGuidance: {
    textAlign: 'center',
    fontStyle: 'italic',
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
  orderRow: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  orderDetails: {
    flex: 1,
    flexDirection: 'row',
    padding: 5,
    borderBottomWidth: 1,
    borderColor: Colors.lightGrey,
    backgroundColor: Colors.lightBlue,
    alignItems: 'center',
  },
  orderDetailsText: {
    color: 'white',
    fontSize: 25,
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  iconArrow: {
    width: 50,
    height: 50,
  },
  separator: {
    height: 0,
    borderBottomColor: Colors.separatorColor,
    borderBottomWidth: .5,
  },
  confirmedOrder: {
    backgroundColor: Colors.lightGrey,
  },
  purveyorContainer: {
    flex: 5,
  },
  purveyorName: {
    color: 'black',
    fontWeight:'bold',
    fontSize: 16,
  },
  metaInfo: {
    color: Colors.darkGrey,
    fontWeight: 'normal',
    fontSize: 12,
  },
  confirmedOrderMetaInfo: {
    color: Colors.darkGrey,
  },
  buttonContainerLink: {
  },
  buttonContainer: {
    height: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 16,
    paddingBottom: 1,
    color: Colors.lightBlue,
    fontWeight: 'bold',
    fontFamily: 'OpenSans'
  },
  loadMore: {
    marginTop: 2,
    marginBottom: 10,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
    color: '#555',
    alignSelf: 'center',
    backgroundColor: '#f2f2f2',
  },
});

OrderIndex.propTypes = {
};

export default OrderIndex
