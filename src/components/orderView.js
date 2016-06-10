import React from 'react-native';
import { Icon, } from 'react-native-icons';
import Communications from 'react-native-communications';
import _ from 'lodash';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import OrderContentsView from './orderContentsView';
import OrderComment from './orderComment';
import AddCommentForm from './addMessageForm';
import moment from 'moment';
import GenericModal from './modal/genericModal';
import Loading from './loading';

const {
  Dimensions,
  PropTypes,
  ScrollView,
  StyleSheet,
  Text,
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
      hideOrderHeader: false,
      stateUpdated: false,
    }
    this.commentTimeoutId = null
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(this.state.stateUpdated === true || nextState.stateUpdated === true){
      return true
    }
    return false
  }

  componentWillReceiveProps(nextProps) {
    if(['RECEIVE_ORDERS', 'UPDATE_ORDER'].indexOf(nextProps.actionType) !== -1){
      console.log(nextProps.actionType)
      this.setState({
        orderId: nextProps.orderId,
        orderFetching: nextProps.orderFetching,
        order: nextProps.order,
        purveyor: nextProps.purveyor,
        products: nextProps.products,
        stateUpdated: true,
      }, () => {
        this.checkForOrderDetails()
        this.setState({
          stateUpdated: false,
        })
      })

    }
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
      stateUpdated: true,
    }, () => {
      if(this.checkMissingData() === true){
        this.props.onGetOrderDetails(this.state.orderId)
      }
      this.setState({
        stateUpdated: false,
      })
    })
  }

  componentDidMount() {
    this.checkForOrderDetails()
  }

  componentWillUnmount() {
    clearTimeout(this.commentTimeoutId)
  }

  checkForOrderDetails() {
    clearTimeout(this.commentTimeoutId)
    this.commentTimeoutId = setTimeout(() =>{
      this.props.onGetOrderDetails(this.state.orderId)
    }, 500)
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
        break
      case 'email':
        let timeZone = 'UTC';
        if(purveyor.hasOwnProperty('timeZone') && purveyor.timeZone){
          timeZone = purveyor.timeZone;
        }
        const orderDate = moment(order.orderedAt).tz(timeZone);
        const to = purveyor.orderEmails.split(',')
        const cc = ['orders@sousapp.com']
        const subject = `Order Comment from ${team.name} (Ref: ${order.orderRef || order.createdAt})`
        let body = `Order Ref: ${order.orderRef || order.createdAt}`
        // orderProducts.forEach(function(o) {
        //   body += `\n ${o.cartItem.productName} x ${o.cartItem.amount * o.cartItem.quantity} ${o.cartItem.unit}`
        // })
        Communications.email(to, cc, null, subject, body)
        break
      case 'text':
        Communications.text(purveyor.phone)
        break
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
      imageUrl: this.props.userImgUrl,
      text: msg.text,
      createdAt: new Date().toISOString()
    })
    this.setState({
      order: Object.assign({}, this.state.order, {
        comments: orderComments,
      }),
      stateUpdated: true,
    }, () => {
      this.props.onUpdateOrder(this.state.order)
      this.setState({
        stateUpdated: false,
      })
    })
  }

  // Scroll a component into view. Just pass the component ref string.
  inputFocused(refName) {
    // console.log(this.refs)
    setTimeout(() => {
      let scrollResponder = this.refs.scrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        React.findNodeHandle(this.refs[refName]),
        100, //additionalOffset
        true
      );
    }, 20);
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
    let numberOfInvoices = order.invoices ? order.invoices.length : 0
    let invoiceButtonText = 'Upload Invoice / Photo'
    switch (numberOfInvoices) {
      case 0:
        invoiceButtonText = 'Upload Invoice / Photo'
        break
      case 1:
        invoiceButtonText = '1 Invoice / Photo'
        break
      default:
        invoiceButtonText = `${numberOfInvoices} Invoices / Photos`
        break
    }

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
            imgUrl={comment.imageUrl}
          />
        )
      })
    }
    return (
      <View style={styles.container}>
        { this.state.loaded === true ?
          <View style={styles.container}>
            { this.state.hideOrderHeader === false ?
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
            : null }
            <View style={styles.scrollViewContainer}>
              <ScrollView
                ref='scrollView'
                automaticallyAdjustContentInsets={false}
                keyboardShouldPersistTaps={false}
                style={styles.scrollView}
              >
                <View style={styles.optionsContainer}>
                  <TouchableHighlight
                    underlayColor='transparent'
                    onPress={() => {
                      this.props.onNavToOrderContents()
                    }}
                  >
                    <View style={styles.option}>
                      <View style={styles.optionInnerContainer}>
                          <View>
                            <Text style={[styles.optionText]}>Review Order <Text style={[styles.optionSubText]}>{`(${this.getNumberConfirmed().count} / ${this.getNumberConfirmed().total} items)`}</Text></Text>
                          </View>
                      </View>
                      <View style={styles.iconArrowContainer}>
                        <Icon name='material|chevron-right' size={27.5} color={Colors.lightBlue} style={styles.iconArrow}/>
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
                          <Text style={[styles.optionText]}>{invoiceButtonText}</Text>
                      </View>
                      <View style={styles.iconArrowContainer}>
                        <Icon name='material|chevron-right' size={27.5} color={Colors.lightBlue} style={styles.iconArrow}/>
                      </View>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight
                    onPress={() => {
                      this.setState({
                        showPurveyorContact: !this.state.showPurveyorContact,
                        stateUpdated: true,
                      }, () => {
                        this.setState({
                          stateUpdated: false,
                        })
                      })
                    }}
                    underlayColor='transparent'
                  >
                    <View style={styles.option}>
                      <View style={styles.optionInnerContainer}>
                        <Text style={styles.optionText}>Contact Rep</Text>
                      </View>
                      <View style={styles.iconArrowContainer}>
                        <Icon name='material|caret-down' size={27.5} color={Colors.lightBlue} style={styles.iconArrow} />
                      </View>
                    </View>
                  </TouchableHighlight>
                  { this.state.showPurveyorContact ?
                    <View style={styles.purveyorContactContainer}>
                      <Text style={styles.purveyorRepName}>{this.props.purveyor.orderContact || ''}</Text>
                      <View style={styles.iconContactContainer}>
                        <TouchableHighlight
                          underlayColor='white'
                          onPress={() => {
                            this.handleContactPress('email')
                          }}
                        >
                          <Icon name='material|email' size={27} color={Colors.gold} style={styles.iconContact}/>
                        </TouchableHighlight>
                        <TouchableHighlight
                          underlayColor='white'
                          onPress={() => {
                            this.handleContactPress('phone')
                          }}
                        >
                          <Icon name='material|phone' size={27} color={Colors.gold} style={styles.iconContact}/>
                        </TouchableHighlight>
                        <TouchableHighlight
                          underlayColor='white'
                          onPress={() => {
                            this.handleContactPress('text')
                          }}
                        >
                          <Icon name='material|smartphone-iphone' size={27} color={Colors.gold} style={styles.iconContact}/>
                        </TouchableHighlight>
                      </View>
                    </View>
                    : <View/>
                  }
                </View>
                <View style={styles.commentsContainer}>
                  <View style={styles.inputContainer}>
                    <AddCommentForm
                      ref='comment'
                      placeholder='Comment on this order..'
                      onSubmit={::this.handleCommentSubmit}
                      multiline={false}
                      onFocus={() => {
                        this.setState({
                          hideOrderHeader: true,
                          stateUpdated: true,
                        }, () => {
                          this.setState({
                            stateUpdated: false,
                          })
                        })
                        this.inputFocused('comment')
                      }}
                      onBlur={() => {
                        this.setState({
                          hideOrderHeader: false,
                          stateUpdated: true,
                        }, () => {
                          this.setState({
                            stateUpdated: false,
                          })
                        })
                      }}
                    />
                  </View>
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
  scrollViewContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 5,
  },
  optionsContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    padding: 5,
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 3,
    marginBottom: 3,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionSubText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: Colors.darkGrey,
    fontWeight: 'normal',
  },
  optionInnerContainer: {
    flex: 13,
    alignItems: 'stretch',
  },
  iconArrowContainer: {
    flex: 1,
  },
  iconArrow: {
    width: 20,
    height: 20,
  },
  purveyorContactContainer: {
    borderRadius: 4,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: 'white',
  },
  purveyorRepName: {
    alignSelf: 'center',
    fontSize: 18,
  },
  iconContactContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-around',
    width: window.width * .75,
    backgroundColor: 'white',
    padding: 10,
  },
  iconContact: {
    borderWidth: 2,
    borderRadius: 26,
    borderColor: Colors.gold,
    width: 50,
    height: 50,
  },
  commentsContainer: {
    backgroundColor: '#f3f3f3',
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
