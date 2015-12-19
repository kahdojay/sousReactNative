import React from 'react-native'
import ProductToggle from './productToggle'
import { Icon } from 'react-native-icons'
import { greyText, productCompletedBackgroundColor } from '../utilities/colors';
import _ from 'lodash';
import { CART } from '../actions/actionTypes';
import Colors from '../utilities/colors';
import Swipeout from 'react-native-swipeout';

const {
  TouchableHighlight,
  PropTypes,
  Text,
  StyleSheet,
  View,
  Modal,
} = React;

class ProductListItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      product: null,
      purveyors: null,
      added: false,
      quantity: 1,
      purveyorId: '',
      selectedPurveyorId: null,
      note: '',
    }
    this.timeoutId = null
    this.loadTimeoutId = null
  }

  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate = true;
    if(nextProps.cartItem === null && this.props.cartItem === null){
      shouldUpdate = false;
    }
    if(this.state.added === true && nextProps.cartItem === null){
      shouldUpdate = true;
    }
    if(this.state.loaded === false){
      shouldUpdate = true;
    }
    // if(this.state.product !== null){
    //   // console.log(nextProps.product);
    //   if(JSON.stringify(nextProps.product) !== JSON.stringify(this.state.product)){
    //     shouldUpdate = true;
    //   }
    // }
    // console.log(nextState.shouldUpdate);
    return shouldUpdate;
  }

  componentWillReceiveProps(nextProps) {
    // delay update from receiving props
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.localStateUpdateFromCart(nextProps.cartItem, nextProps.cartPurveyorId)
    }, 10);
  }

  componentDidMount() {
    this.loadTimeoutId = setTimeout(() => {
      this.setState(
        {
          loaded: true,
          product: this.props.product,
          purveyors: this.props.purveyors,
          selectedPurveyorId: this.props.product.purveyors[0],
        },
        () => {
          this.localStateUpdateFromCart(this.props.cartItem, this.props.cartPurveyorId)
        }
      )
    }, this.props.loadDelay)
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId)
    clearTimeout(this.loadTimeoutId)
  }

  localStateUpdateFromCart(cartItem, cartPurveyorId) {
    let newState = {}
    if (cartItem !== null) {
      newState = {
        added: true,
        quantity: cartItem.quantity,
        purveyorId: cartPurveyorId,
        note: cartItem.note
      };
    } else {
      newState = {
        added: false,
        quantity: 1,
        purveyorId: cartPurveyorId,
        note: ''
      };
    }
    this.setState(newState);
  }

  cartUpdateFromLocalState() {
    const cartAttributes = {
      purveyorId: this.state.selectedPurveyorId,
      productId: this.state.product.id,
      quantity: this.state.quantity,
      note: this.state.note
    };
    this.props.onUpdateProductInCart(
      (this.state.added === true ? CART.ADD : CART.REMOVE),
      cartAttributes
    );

  }

  increment() {
    this.setState({
      quantity: this.state.quantity + 1
    }, this.cartUpdateFromLocalState.bind(this))
  }

  decrement() {
    if (this.state.quantity > 1 ) {
      this.setState({
        quantity: this.state.quantity - 1
      }, this.cartUpdateFromLocalState.bind(this))
    }
  }

  handleToggleProduct(purveyorId) {
    this.setState({
      added: !this.state.added,
      selectedPurveyorId: purveyorId
    }, this.cartUpdateFromLocalState.bind(this))
  }

  render() {
    const {product} = this.state
    const {purveyors} = this.props;

    let productInfo = (
      <View style={styles.row}>
        <View style={styles.main}>
          <Text style={[styles.productText, {padding: 12}]}>Loading...</Text>
        </View>
      </View>
    );
    if(this.state.product !== null){
      let purveyorString = ""
      if(purveyors.hasOwnProperty(this.state.selectedPurveyorId) === true){
        purveyorString = purveyors[this.state.selectedPurveyorId].name || '-NOT SET-'
      } else {
        // Single purveyor, grab name off props.purveyors
        const purveyorIds = Object.keys(purveyors)
        purveyorString = purveyors[purveyorIds[0]].name
      }
      productInfo = (
        <View style={styles.row}>
          <View style={styles.checkboxContainer}>
            <ProductToggle
              added={this.state.added}
              availablePurveyors={product.purveyors}
              allPurveyors={purveyors}
              currentlySelectedPurveyorId={this.state.selectedPurveyorId}
              onToggleCartProduct={(purveyorId) => {
                this.handleToggleProduct(purveyorId)
              }}
            />
          </View>
          <View style={styles.main}>
            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => {
                // console.log('Add to cart')
                // this.handleToggleProduct(purveyorId)
              }}>
              <View>
                <Text style={styles.productText}>
                  {product.name}
                </Text>
                <Text style={{fontSize: 9,  color: '#999'}} >
                  {product.amount + ' ' + product.unit}
                </Text>
                <Text style={{fontSize: 9,  color: '#999'}} >
                  {purveyorString}
                </Text>
              </View>
            </TouchableHighlight>
          </View>
          { this.state.added === true ?
            [
              <Text key={'quantity'} style={styles.quantity}>
                {this.state.quantity > 1 ? ('X' + this.state.quantity) : ''}
              </Text>,
              <TouchableHighlight
                key={'decrement'}
                underlayColor="transparent"
                onPress={this.decrement.bind(this)}
                style={{flex: 1}}>
                <Icon name='fontawesome|minus-circle' size={30} color='#aaa' style={styles.icon}/>
              </TouchableHighlight>,
              <TouchableHighlight
                key={'increment'}
                underlayColor='transparent'
                onPress={this.increment.bind(this)}
                style={{flex: 1}}>
                <Icon name='fontawesome|plus-circle' size={30} color='#aaa' style={styles.icon}/>
              </TouchableHighlight>
            ] : [
              <View key={'quantity'} style={{flex: 1}} />,
              <View key={'decrement'} style={{flex: 1}} />,
              <View key={'increment'} style={{flex:1}} />
            ]
          }
        </View>
      )
    }

    const buttons = [{
      backgroundColor: 'transparent',
      component: (
        <Icon name='material|edit' size={30} color={Colors.navbarIconColor} style={styles.iconEdit}/>
      ),
      onPress: this.props.onProductEdit
    }, {
      backgroundColor: 'transparent',
      component: (
        <Icon name='material|delete' size={30} color={Colors.navbarIconColor} style={styles.iconEdit}/>
      ),
      onPress: this.props.onProductDelete
    }]

    return (
      <View style={styles.container}>
        <Swipeout
          right={buttons}
          backgroundColor={Colors.mainBackgroundColor}
        >
          {productInfo}
        </Swipeout>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 5,
    paddingLeft: 5,
  },
  icon: {
    width: 40,
    height: 40,
  },
  iconEdit: {
    flex: 1,
    alignSelf: 'center',
    width: 54,
    height: 40,
    marginLeft: 2,
    marginTop: 7,
    marginBottom: 7,
  },
  quantity: {
    flex: 1,
    fontSize: 16
  },
  row: {
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 5,
    alignItems: 'center'
  },
  checkboxContainer: {
    flex: 1,
    alignItems: 'center',
    width: 40
  },
  main: {
    flex: 4,
  },
  productText: {
    color: 'black',
    fontSize: 15
  }
});

ProductListItem.propTypes = {
  product: PropTypes.object.isRequired
};

export default ProductListItem
