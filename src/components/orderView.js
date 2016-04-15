import React from 'react-native';
import { Icon, } from 'react-native-icons';
import Communications from 'react-native-communications';
import _ from 'lodash';
import Styles from '../utilities/styles';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import OrderListItem from './orderListItem';
import OrderContentsView from './orderContentsView';
import OrderInvoices from './orderInvoices';
import OrderInvoiceUpload from './orderInvoiceUpload';
import OrderComment from './orderComment';
import AddMessageForm from './addMessageForm';
import moment from 'moment';
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
      showPurveyorContact: false,
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

  handleContactPress(type) {
    const order = this.props.order
    const purveyor = this.props.purveyor
    const team = this.props.team
    const orderProducts = this.props.products
    switch (type) {
      case 'phone':
        Communications.phonecall(purveyor.phone, true)
      case 'email':
        let timeZone = 'UTC';
        if(purveyor.hasOwnProperty('timeZone') && purveyor.timeZone){
          timeZone = purveyor.timeZone;
        }
        const orderDate = moment(order.orderedAt).tz(timeZone);
        const to = purveyor.orderEmails.split(',')
        const cc = ['orders@sousapp.com']
        const subject = `Order Comment from ${team.name} • 's Order on ${orderDate.format('dddd, MMMM D')}`
        let body = 'Order Reference: '
        orderProducts.forEach(function(o) {
          body += `\n ${o.cartItem.productName} x ${o.cartItem.amount * o.cartItem.quantity} ${o.cartItem.unit}`
        })
        Communications.email(to, cc, null, subject, body)
      case 'text':
        Communications.text(purveyor.phone)
    }
  }

  getNumberConfirmed() {
    let count = 0
    let total = 0
    this.state.products.forEach(function(product) {
      count += product.cartItem.status === 'RECEIVED' ? 1 : 0
      total += 1
    })
    return {
      count: count,
      total: total
    }
  }

  handleCommentSubmit(msg) {
    let orderComments = this.state.order.comments || []
    orderComments.unshift({
      userId: this.props.userId,
      author: this.props.userName,
      text: msg,
      createdAt: new Date().toISOString()
    })
    this.setState({
      order: Object.assign({}, this.state.order, {
        comments: orderComments,
      })
    }, () => {
      this.props.onUpdateOrder(this.state.order)
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
          <Text style={[styles.guidance, {padding: 25}]}>Order details unavailable.</Text>
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
      confirmUser = teamsUsers[order.confirm.userId]
    }

    let orderComments = []
    if(order.comments && order.comments.length > 0){
      _.each(order.comments, (comment, idx) => {
        orderComments.push(
          <OrderComment
            key={idx}
            message={comment}
          />
        )
      })
    }

    return (
      <View style={styles.container}>
        { this.state.loaded === true ?
          <View style={styles.container}>
            <View style={styles.confirmedContainer}>
              <View style={styles.confirmationDetails}>
                <Text style={styles.purveyorName}>{this.props.purveyor.name}</Text>
                <Text style={[styles.confirmedText]}>
                  <Text style={{fontStyle: 'italic'}}>Ord.</Text> {order.orderedAt !== null ? moment(order.orderedAt).format('ddd, MMM D, h:mma') : ''} {orderUser ? `- ${orderUser.firstName}` : ''}</Text>
                {order.confirm.order === true ? (
                    <View>
                      <Text style={[styles.confirmedText]}><Text style={{fontStyle: 'italic'}}>Rec.</Text> {order.confirm.confirmedAt !== null ? moment(order.confirm.confirmedAt).format('ddd, MMM D, h:mma') : ''} {confirmUser ? `- ${confirmUser.firstName}` : ''}</Text>
                    </View>
                  ) : <View/>
                }
                
              </View>
            </View>
            <View style={styles.optionsContainer}>
              <View style={styles.separator} />
              <TouchableHighlight
                underlayColor='transparent'
                onPress={() => {
                  this.props.onNavToOrderContents()
                }}
              >
                <View style={styles.option}>
                  <View style={styles.optionInnerContainer}>
                      <View>
                        <Text style={[styles.optionText]}>Review Order</Text>
                        <Text style={[styles.optionSubText]}>{`${this.getNumberConfirmed().count} / ${this.getNumberConfirmed().total} items`}</Text>
                      </View>
                  </View>
                  <View style={styles.iconArrowContainer}>
                    <Icon name='material|chevron-right' size={35} color={Colors.lightBlue} style={styles.iconArrow}/>
                  </View>
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor='transparent'
                onPress={() => {
                  this.props.onNavToInvoices(order.id)
                }}
              >
                <View style={styles.option}>
                  <View style={styles.optionInnerContainer}>
                      <Text style={[styles.optionText]}>{'Invoice/Photos'}</Text>
                  </View>
                  <View style={styles.iconArrowContainer}>
                    <Icon name='material|chevron-right' size={35} color={Colors.lightBlue} style={styles.iconArrow}/>
                  </View>
                </View>
              </TouchableHighlight>
              <View style={styles.option}>
                <View style={styles.optionInnerContainer}>
                  <TouchableHighlight
                    onPress={() => {
                      this.setState({
                        showPurveyorContact: !this.state.showPurveyorContact,
                      })
                    }}
                    underlayColor='transparent'>
                    <View style={styles.purveyorDetailContainer}>
                      <Text style={styles.purveyorContactText}>Contact {this.props.purveyor.orderContact}</Text>
                      <Icon name='material|caret-down' size={35} color={Colors.lightBlue} style={styles.iconCaret} />
                    </View>
                  </TouchableHighlight>
                  { this.state.showPurveyorContact ? 
                    <View>
                      <View style={styles.separator} />
                      <View style={styles.iconContactContainer}>
                        <TouchableHighlight
                          underlayColor='white'
                          onPress={() => {
                            this.handleContactPress('email')
                          }}
                        >
                          <Icon name='material|email' size={32.5} color={Colors.gold} style={styles.iconContact}/>
                        </TouchableHighlight>
                        <TouchableHighlight
                          underlayColor='white'
                          onPress={() => {
                            this.handleContactPress('phone')
                          }}
                        >
                          <Icon name='material|phone' size={32.5} color={Colors.gold} style={styles.iconContact}/>
                        </TouchableHighlight>
                        <TouchableHighlight
                          underlayColor='white'
                          onPress={() => {
                            this.handleContactPress('text')
                          }}
                        >
                          <Icon name='material|smartphone-iphone' size={32.5} color={Colors.gold} style={styles.iconContact}/>
                        </TouchableHighlight>
                      </View>
                    </View>
                    : <View/>
                  }
                </View>
              </View>
            </View>
            <View style={styles.commentsOuterContainer}>
              <AddMessageForm
                placeholder='Comment on this order..'
                onSubmit={::this.handleCommentSubmit}
                multiline={false}
              />
              <ScrollView
                automaticallyAdjustContentInsets={false}
                keyboardShouldPersistTaps={false}
              >
                <View style={styles.commentsInnerContainer}>
                  {orderComments}
                </View>
              </ScrollView>
            </View>
          </View>
        : <Text style={[styles.guidance, {padding: 25}]}>Loading, please wait.</Text> }
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainBackgroundColor,
    flex: 1,
  },
  confirmedContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.lightBlue,
    padding: 5,
  },
  confirmationDetails: {
    flex: 2,
  },
  purveyorName: {
    fontSize: 25,
    color: 'white',
  },
  confirmedText: {
    fontFamily: 'OpenSans',
    color: 'white',
    fontSize: 15,
  },
  optionsContainer: {
    marginTop: 15,
  },
  option: {
    flexDirection: 'row',
    padding: 10,
    margin: 3,
    borderRadius: 4,
    backgroundColor: Colors.rowColor,
  },
  optionText: {
    fontSize: 20,
  },
  optionSubText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: Colors.darkGrey,
  },
  optionInnerContainer: {
    flex: 13,
    alignItems: 'stretch',
  },
  iconArrowContainer: {
    flex: 1,
  },
  iconArrow: {
    width: 35,
    height: 35,
  },
  purveyorDetailContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  purveyorContactText: {
    fontSize: 20,
  },
  iconCaret: {
    width: 35,
    height: 35,
  },
  iconContactContainer: {
    flex: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  iconContact: {
    borderWidth: 1,
    borderRadius: 31,
    borderColor: Colors.gold,
    width: 60,
    height: 60,
  },
  separator: {
    height: 0,
    borderBottomColor: Colors.separatorColor,
    borderBottomWidth: .75,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.mainBackgroundColor,
    paddingTop: 5,
  },
  commentsOuterContainer: {
    flex: 1,
    marginTop: 15,
    padding: 15,
  },
  commentsInnerContainer: {
    backgroundColor: '#f3f3f3',
    paddingTop: 5,
  },
  guidance: {
    textAlign: 'center',
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
