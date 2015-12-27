import React from 'react-native';
import _ from 'lodash';
import Colors from '../utilities/colors';
import CartViewListItem from './cartViewListItem';

const {
  AlertIOS,
  Modal,
  PickerIOS,
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
    const numberOfOrders = Object.keys(this.props.team.cart.orders).length
    const numberOfProducts = _.reduce(_.map(numberOfOrders, (orderId) => {
      return Object.keys(this.props.team.cart.orders[orderId].products).length
    }), (total, n) => {
      return total + n
    })
    this.state = {
      numberOfProducts: numberOfProducts,
      numberOfOrders: numberOfOrders,
      showPurveyorInfo: false,
      purveyor: null,
    }
  }

  shouldComponentUpdate(nextProps) {
    const numberOfOrdersUpdated = Object.keys(nextProps.team.cart.orders)
    const numberOfProductsUpdated = _.reduce(_.map(numberOfOrdersUpdated, (orderId) => {
      return Object.keys(nextProps.team.cart.orders[orderId].products).length
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
    const numberOfOrders = Object.keys(nextProps.team.cart.orders)
    const numberOfProducts = _.reduce(_.map(numberOfOrders, (orderId) => {
      return Object.keys(nextProps.team.cart.orders[orderId].products).length
    }), (total, n) => {
      return total + n
    })
    this.setState({
      numberOfOrders: numberOfOrders.length,
      numberOfProducts: numberOfProducts,
    })
  }

  handleSubmitPress(cartPurveyors) {
    if (this.props.connected === true && this.state.numberOfOrders > 0) {
      AlertIOS.alert(
        'Confirm',
        'Are you sure you want to send order?',
        [
          {
            text: 'No',
            onPress: () => {
              // console.log('Order not sent')
            }
          },
          {
            text: 'Yes',
            onPress: () => {
              if(this.state.numberOfOrders > 0){
                this.props.onSubmitOrder();
              }
            }
          }
        ]
      )
    }
  }

  renderPurveyorProducts(purveyorId, cart, products) {
    const cartProducts = cart.orders[purveyorId].products
    const cartPurveyorProductIds = Object.keys(cartProducts)
    const cartPurveyorProducts = _.sortBy(_.map(cartPurveyorProductIds, (productId) => {
      return products[productId]
    }), 'name')

    return cartPurveyorProducts.map((product) => {
      const cartProduct = cartProducts[product.id];
      return (
        <CartViewListItem
          key={product.id}
          purveyorId={purveyorId}
          product={product}
          cartProduct={cartProduct}
          onUpdateProductInCart={this.props.onUpdateProductInCart}
          onDeleteProduct={this.props.onDeleteProduct}
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
    const {team, cartPurveyors, products} = this.props

    const modal = (
      <Modal
        animated={true}
        transparent={true}
        visible={this.state.showPurveyorInfo}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalInnerContainer}>
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
            <View style={styles.separator} />
            <TouchableHighlight
              onPress={() => {
                this.setState({
                  showPurveyorInfo: false,
                  purveyor: null,
                })
              }}
              underlayColor='transparent'
            >
              <Text style={styles.modalButtonText}>Ok</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    )

    return (
      <ScrollView style={styles.scrollView}>
        {
          _.map(cartPurveyors, (purveyor) => {
            return (
              <View key={purveyor.id} style={styles.purveyorContainer}>
                <View style={styles.purveyorInfo}>
                  <View style={styles.purveyorInfoLeft}>
                    <Text style={styles.purveyorTitle}>{purveyor.name}</Text>
                  </View>
                  <View style={styles.purveyorInfoRight}>
                    <TouchableHighlight
                      onPress={() => {
                        this.setState({
                          showPurveyorInfo: true,
                          purveyor: purveyor,
                        })
                      }}
                      underlayColor='transparent'
                    >
                      <Text style={styles.purveyorInfoDetails}>Show details</Text>
                    </TouchableHighlight>
                  </View>
                </View>
                {this.renderPurveyorProducts(purveyor.id, team.cart, products)}
              </View>
            );
          })
        }
        <TouchableOpacity
          onPress={this.handleSubmitPress.bind(this, cartPurveyors)}
          style={[
            styles.button,
            (this.props.connected === false || this.state.numberOfOrders === 0) && styles.buttonDisabled
          ]}
          activeOpacity={.75}
        >
          <Text style={styles.buttonText}>Submit Order</Text>
        </TouchableOpacity>
        {modal}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#f2f2f2',
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
    padding: 10,
    flexDirection: 'row'
  },
  purveyorInfoLeft: {
    flex: 2
  },
  purveyorInfoRight: {
    flex: 1
  },
  purveyorTitle: {
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'OpenSans',
    fontSize: 18,
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
  purveyorInfoDetails: {
    flex: 1,
    fontFamily: 'OpenSans',
    fontSize: 14,
    color: '#fff',
    textAlign: 'right',
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'OpenSans'
  },
  button: {
    height: 56,
    backgroundColor: Colors.gold,
    alignSelf: 'center',
    width: 200,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    borderRadius: 3,
  },
  buttonDisabled: {
    backgroundColor: Colors.disabled,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalInnerContainer: {
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 20,
  },
  modalButtonText: {
    textAlign: 'center',
    color: Colors.lightBlue,
    paddingTop: 15,
  },
  separator: {
    marginTop: 10,
    height: 0,
    borderBottomColor: Colors.separatorColor,
    borderBottomWidth: 1,
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
  }
})

export default CartView
