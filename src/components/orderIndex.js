import React from 'react-native';
import { Icon, } from 'react-native-icons';
import _ from 'lodash';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import moment from 'moment';

const {
  PropTypes,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  SegmentedControlIOS,
  View,
} = React;

class OrderIndex extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
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
      orders: nextProps.orders,
      purveyors: nextProps.purveyors,
      teamsUsers: nextProps.teamsUsers,
    })
  }

  render() {
    const { orders, cartItems, cartItemsOrders, purveyors, teamsUsers } = this.state

    if(this.state.loaded === false){
      return (
        <View />
      )
    }

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
            <View style={styles.row}>
              <View style={{flex:2}}>
                <Text style={[styles.metaInfo, {paddingTop: 7, fontStyle: 'italic'}]}>Order details unavailable.</Text></View>
              <View style={{flex:1}}>
                <Text style={[styles.metaInfo, styles.bold, styles.rightAlign]}>{orderedAtDate.format('M/D/YY')}</Text>
                <Text style={[styles.metaInfo, styles.rightAlign]}>{orderedAtDate.format('h:mm a')}</Text>
              </View>
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
        let invoiceIconBackgroundColor = Colors.disabled
        let invoiceIconCheckmarkColor = 'transparent'
        let invoiceButtonTextColor = 'white'

        if(order.confirm.order === true){
          invoiceIconBackgroundColor = 'white'
        }

        // if(true){
        if(order.hasOwnProperty('invoices') === true && order.invoices.length > 0){
          invoiceIconBackgroundColor = Colors.green
          invoiceIconCheckmarkColor = 'white'
          invoiceButtonTextColor = Colors.lightBlue
        }
        return (
          <TouchableHighlight
            key={order.id}
            underlayColor='transparent'
            onPress={() => {
              this.props.onNavToOrder(order.id)
            }}
          >
            <View style={[styles.row, confirmedOrderStyle]}>
              <View style={styles.confirmedIconContainer}>
                <Icon name='material|circle' size={20} color={invoiceIconBackgroundColor} style={styles.confirmedIconContainer}>
                  <Icon name='material|check' size={25} color={invoiceIconCheckmarkColor} style={styles.confirmedIconCheckmark} />
                </Icon>
              </View>
              <View style={{flex:2}}>
                <Text style={[styles.purveyorName, styles.bold]}>
                  {order.purveyor ? order.purveyor.name : ''}
                  <Text style={[styles.metaInfo,confirmedOrderMetaInfoStyle]}> {`${itemCount} Item${itemCount > 1 ? 's' : ''}`}</Text>
                </Text>
                <Text style={[styles.metaInfo,confirmedOrderMetaInfoStyle]}>{orderUserName}</Text>
              </View>
              <View style={{flex:1}}>
                <Text style={[styles.metaInfo, styles.bold, styles.rightAlign,confirmedOrderMetaInfoStyle]}>{orderedAtDate.format('M/D/YY')}</Text>
                <Text style={[styles.metaInfo, styles.rightAlign,confirmedOrderMetaInfoStyle]}>{orderedAtDate.format('h:mm a')}</Text>
              </View>
            </View>
          </TouchableHighlight>
        )
      }
    })

    return (
      <View style={styles.container}>
        <ScrollView
          automaticallyAdjustContentInsets={false}
          keyboardShouldPersistTaps={false}
          style={styles.scrollView}
        >
          {ordersList}
        </ScrollView>
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
              { this.state.showConfirmedOrders === false ? 'See Complete History' : 'Hide Confirmed Orders' }
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
  scrollView: {
    flex: 1,
    backgroundColor: Colors.mainBackgroundColor,
  },
  separator: {
    height: 0,
    borderBottomColor: Colors.separatorColor,
    borderBottomWidth: 1,
  },
  row: {
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
  },
  confirmedOrder: {
    backgroundColor: Colors.sky,
  },
  purveyorName: {
    color: 'black',
    fontSize: 14
  },
  metaInfo: {
    color: '#999',
    fontWeight: 'normal',
    fontSize: 12,
  },
  confirmedOrderMetaInfo: {
    color: '#333',
  },
  bold: {
    fontWeight: 'bold'
  },
  rightAlign: {
    textAlign: 'right'
  },
  buttonContainerLink: {
  },
  buttonContainer: {
    backgroundColor: 'white',
    padding: 10,
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 16,
    color: Colors.lightBlue,
    fontWeight: 'bold',
    fontFamily: 'OpenSans'
  },
});

OrderIndex.propTypes = {
};

export default OrderIndex
