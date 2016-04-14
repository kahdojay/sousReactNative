import React from 'react-native';
import { Icon, } from 'react-native-icons';
import Communications from 'react-native-communications';
import _ from 'lodash';
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
      showInvoices: false,
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

  getNumberSelected() {
    let count = 0
    this.state.products.forEach(function(product) {
      count += product.cartItem.status === 'RECEIVED' ? 1 : 0
    })
    return count
  }

  handleCommentSubmit(msg) {
    let orderComments = this.state.order.comments || []
    orderComments.push({
      userId: this.props.userId,
      author: this.props.userName,
      message: msg,
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

  getInvoiceView(order) {
    if (this.state.showInvoices === true) {
      if(order.hasOwnProperty('invoices') === true && order.invoices.length > 0){
        return (
          <View>
            <OrderInvoices
              order={order}
              onNavtoUploadInvoices={console.log('nav')}
            />
          </View>
        )
      } else {
        return (
          <View>
            <OrderInvoiceUpload
              order={order}
              onNavtoUploadInvoices={console.log('nav')}
            />
          </View>
        )
      }
    }
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
    let orderComments = []
    if(order.comments && order.comments.length > 0){
      _.each(order.comments, (comment, idx) => {
        orderComments.push(
          <OrderComment
            key={idx}
            message={comment.message}
            author={comment.author}
            createdAt={comment.createdAt}
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
                  Ordered: {order.orderedAt !== null ? moment(order.orderedAt).format('ddd M/D, h:mma') : ''} {orderUser ? `(${orderUser.firstName})` : ''}</Text>
                {order.confirm.order === true ? (
                    <View>
                      <Text style={[styles.confirmedText]}>Received: {order.confirm.confirmedAt !== null ? moment(order.confirm.confirmedAt).format('ddd M/D, h:mma') : ''} {confirmUser ? `(${confirmUser.firstName})` : ''}</Text>
                    </View>
                  ) : <View/>
                }
                
              </View>
              <View style={styles.purveyorContactContainer}>
                <Text style={styles.purveyorContactText}>{this.props.purveyor.orderContact} <Text style={styles.purveyorContactSubText}>(rep)</Text></Text>
                <View style={styles.contactIconsContainer}>
                  <TouchableHighlight
                    underlayColor='white'
                    onPress={() => {
                      this.handleContactPress('email')
                    }}
                  >
                    <Icon name='material|email' size={15} color={'white'} style={styles.iconContact}/>
                  </TouchableHighlight>
                  <TouchableHighlight
                    underlayColor='white'
                    onPress={() => {
                      this.handleContactPress('phone')
                    }}
                  >
                    <Icon name='material|phone' size={15} color={'white'} style={styles.iconContact}/>
                  </TouchableHighlight>
                  <TouchableHighlight
                    underlayColor='white'
                    onPress={() => {
                      this.handleContactPress('text')
                    }}
                  >
                    <Icon name='material|smartphone-iphone' size={15} color={'white'} style={styles.iconContact}/>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
            <View style={styles.separator} />
            <View style={styles.sectionHeader}>
              <TouchableHighlight
                underlayColor='transparent'
                onPress={() => {
                  this.props.onNavToOrderContents(order, products, this.props.purveyor)
                }}
              >
                <Text style={[styles.sectionHeaderText]}>{'Order Contents'}</Text>
              </TouchableHighlight>
            </View>
            <View style={styles.separator} />
            <View style={styles.sectionHeader}>
              <TouchableHighlight
                underlayColor='transparent'
                onPress={() => {
                  this.setState({
                    showInvoices: !this.state.showInvoices
                  })
                  // this.props.onNavToInvoices(order.id)
                }}
              >
                <Text style={[styles.sectionHeaderText]}>{'Invoice/Photos'}</Text>
              </TouchableHighlight>
            </View>
            <View style={styles.separator} />
            {this.getInvoiceView(order)}
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
            </View>
            <View style={styles.separator} />
            {this.state.showOrderDiscussion === true ? (
              <ScrollView
                automaticallyAdjustContentInsets={false}
                keyboardShouldPersistTaps={false}
              >
                <View style={styles.commentsInnerContainer}>
                  <AddMessageForm
                    placeholder='Comment on this order..'
                    onSubmit={::this.handleCommentSubmit}
                    multiline={false}
                  />
                  {orderComments}
                </View>
              </ScrollView>
              ) : <View/>
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
  },
  confirmedContainer: {
    flexDirection: 'row',
    padding: 5,
  },
  confirmationDetails: {
    justifyContent: 'center',
    flex: 2,
  },
  purveyorName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  confirmedText: {
    fontSize: 13,
    fontFamily: 'OpenSans',
  },
  purveyorContactContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  purveyorContactText: {
    fontSize: 15,
    marginBottom: 10,    
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
    backgroundColor: Colors.gold,
    borderWidth: .5,
    borderRadius: 12.5,
    borderColor: Colors.gold,
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
    backgroundColor: '#f3f3f3',
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
  commentsInnerContainer: {
    backgroundColor: '#f3f3f3',
    paddingTop: 5,
  },
  orderText: {
    fontWeight: 'bold',
    color: Colors.blue,
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
