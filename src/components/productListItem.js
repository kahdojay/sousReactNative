import React from 'react-native';
import ProductToggle from './productToggle';
import { Icon } from 'react-native-icons';
import _ from 'lodash';
import { CART } from '../actions/actionTypes';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import Swipeout from 'react-native-swipeout';

const {
  Modal,
  PickerIOS,
  PropTypes,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
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
      editQuantity: false,
      cartItem: null,
    }
    this.timeoutId = null
    this.loadTimeoutId = null
  }

  shouldComponentUpdate(nextProps, nextState) {
    // if(nextProps.cartItem === null && this.props.cartItem === null){
    //   return false;
    // }
    const debugUpdates = false
    if(this.state.added === true && nextProps.cartItem === null){
      if(debugUpdates) console.log('Added: ', this.state.added, nextProps.cartItem)
      return true;
    } else if(this.state.added === false && nextProps.cartItem !== null){
      if(debugUpdates) console.log('Removed: ', this.state.added, nextProps.cartItem)
      return true;
    }
    if(this.state.loaded === false){
      if(debugUpdates) console.log('Loaded: ', this.state.loaded)
      return true;
    }
    if(nextState.added !== this.state.added){
      if(debugUpdates) console.log('Add/Remove Local: ', nextState.added, this.state.added)
      return true;
    }
    if(nextState.editQuantity !== this.state.editQuantity){
      if(debugUpdates) console.log('Edit Quantity: ', nextState.editQuantity, this.state.editQuantity)
      return true;
    }
    if(nextState.quantity !== this.state.quantity){
      if(debugUpdates) console.log('Quantity: ', nextState.quantity, this.state.quantity)
      return true;
    }
    if(nextProps.product.deleted !== this.props.product.deleted){
      if(debugUpdates) console.log('Deleted: ', nextProps.product.deleted, this.state.product.deleted)
      return true;
    }
    // if(this.state.product !== null){
    //   // if(debugUpdates) console.log(nextProps.product);
    //   if(JSON.stringify(nextProps.product) !== JSON.stringify(this.state.product)){
    //     return true;
    //   }
    // }
    // if(debugUpdates) console.log(shouldUpdate);
    return false;
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
        purveyorId: cartPurveyorId,
        note: cartItem.note,
        cartItem: cartItem,
      };
      if(this.state.editQuantity === false){
        newState.quantity = cartItem.quantity;
      }
    } else {
      newState = {
        added: false,
        quantity: 1,
        purveyorId: cartPurveyorId,
        note: '',
        cartItem: null,
      };
    }
    this.setState(newState);
  }

  cartUpdateFromLocalState() {
    const cartAttributes = Object.assign({}, this.state.cartItem, {
      purveyorId: this.state.selectedPurveyorId,
      productId: this.state.product.id,
      quantity: this.state.quantity,
      note: this.state.note
    })

    let cartAction = null
    if(this.state.added === true){
      if(cartAttributes.hasOwnProperty('id') === true){
        cartAction = CART.UPDATE
      } else {
        cartAction = CART.ADD
      }
    } else {
      cartAction = CART.DELETE
    }
    this.props.onUpdateProductInCart(cartAction, cartAttributes);
  }

  handleToggleProduct(purveyorId) {
    this.setState({
      added: !this.state.added,
      selectedPurveyorId: purveyorId
    }, this.cartUpdateFromLocalState.bind(this))
  }

  render() {
    const {product} = this.state
    const {purveyors, category} = this.props;

    let productInfo = (
      <View style={styles.row}>
        <View style={styles.main}>
          <Text style={[styles.productText, {padding: 12}]}>Loading...</Text>
        </View>
      </View>
    );
    let modal = (
      <View />
    );
    let buttons = []
    if(product !== null){

      if(product.deleted === true){
        return <View />;
      }
      let purveyorInfo = null
      let categoryInfo = null
      let productInfoSeparator = null
      let selectedStyle = []
      let productDetailsColor = Colors.greyText
      let productColor = 'black'
      let productQuantityBorderStyle = {}
      if(this.state.added === true){
        selectedStyle = styles.selectedRow
        productDetailsColor = 'white'
        productColor = 'white'
        productQuantityBorderStyle = {
          borderColor: 'white',
          borderWidth: .5,
          borderRadius: 15,
          padding: 4,
        }
      }
      let availablePurveyors = product.purveyors

      if(purveyors !== null){
        if(purveyors.hasOwnProperty(this.state.selectedPurveyorId) === true){
          purveyorInfo = (
            <Text style={{fontSize: 9,  color: productDetailsColor}}>{purveyors[this.state.selectedPurveyorId].name || '-NOT SET-'}</Text>
          )
        } else {
          // Single purveyor, grab name off props.purveyors
          // const purveyorIds = Object.keys(purveyors)
          // purveyorInfo = purveyors[purveyorIds[0]].name
          purveyorInfo = (
            <Text style={{fontSize: 9,  color: productDetailsColor}}>Multiple purveyors</Text>
          )
        }
      } else {
        availablePurveyors = [this.state.selectedPurveyorId]
      }

      if(category !== null) {
        categoryInfo = (
          <Text style={{fontSize: 9,  color: productDetailsColor}}>{category.name}</Text>
        )
      }
      if(purveyors !== null && category !== null){
        productInfoSeparator = (
          <Icon name='material|chevron-right' size={16} color={productDetailsColor} style={{width: 16, height: 11}}/>
        )
      }
      productInfo = (
        <View style={[styles.row, selectedStyle]}>
          <View style={styles.main}>
            <ProductToggle
              added={this.state.added}
              availablePurveyors={availablePurveyors}
              allPurveyors={purveyors}
              currentlySelectedPurveyorId={this.state.selectedPurveyorId}
              onToggleCartProduct={(purveyorId) => {
                this.handleToggleProduct(purveyorId)
              }}
            >
              <View>
                <Text style={[styles.productText, {color: productColor}]}>
                  {product.name}
                </Text>
                <Text style={{fontSize: 9,  color: productDetailsColor}} >
                  {`${product.amount} ${product.unit}`}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  {purveyorInfo}{productInfoSeparator}{categoryInfo}
                </View>
              </View>
            </ProductToggle>
          </View>
          <View style={styles.outerQuantityContainer}>
            <View style={styles.innerQuantityContainer}>
            { this.state.added === true ?
              (
                <TouchableHighlight
                  onPress={() => {
                    this.setState({
                      editQuantity: true
                    })
                  }}
                  underlayColor='transparent'
                >
                  <Text style={[styles.quantity, productQuantityBorderStyle, {color: productColor}]}>{`${this.state.quantity}x`}</Text>
                </TouchableHighlight>
              )
              : (
                <Text style={styles.quantity}>{''}</Text>
              )
            }
            { product.par && product.par !== '' ?
              <Text style={[styles.par, {color: productDetailsColor}]}>Par: {product.par}</Text>
              : <Text style={[styles.par, {color: productDetailsColor}]}>{''}</Text>
            }
            </View>
          </View>
        </View>
      )
      buttons = [{
        backgroundColor: 'transparent',
        component: (
          <Icon name='material|edit' size={30} color={Colors.lightBlue} style={styles.iconEdit}/>
        ),
        onPress: this.props.onProductEdit
      }, {
        backgroundColor: 'transparent',
        component: (
          <Icon name='material|delete' size={30} color={Colors.lightBlue} style={styles.iconEdit}/>
        ),
        onPress: this.props.onProductDelete
      }]

      const quantities = _.range(1, 501)
      let quantity = this.state.quantity * product.amount;
      if(quantity.toString().indexOf('.') !== -1){
        quantity = parseFloat(Math.floor(quantity * 1000)/1000)
      }
      let productUnit = product.unit;
      if(this.state.quantity > 1){
        if(product.unit == 'bunch'){
          productUnit += 'es';
        } else if(product.unit !== 'ea' && product.unit !== 'dozen' && product.unit !== 'cs'){
          productUnit += 's';
        }
      }
      modal = (
        <Modal
          animated={true}
          transparent={true}
          visible={this.state.editQuantity}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalInnerContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderText}>
                  Select Amount
                </Text>
                {/*<TouchableHighlight
                  onPress={() => { this.setState({ editQuantity: false }) }}
                  underlayColor='transparent'
                >
                  <Icon name='material|close' size={25} color='#999' style={styles.iconClose} />
                </TouchableHighlight>*/}
              </View>
              <PickerIOS
                selectedValue={this.state.quantity}
                onValueChange={(quantity) => {
                  this.setState({
                    quantity: quantity,
                  })
                }}
                style={styles.picker}
              >
                {
                  quantities.map((n, idx) => {
                    return <PickerIOS.Item key={idx} value={n} label={n.toString()} />
                  })
                }
              </PickerIOS>
              <TouchableHighlight
                onPress={() => {
                  this.setState({
                    editQuantity: false,
                  }, this.cartUpdateFromLocalState.bind(this))
                }}
                underlayColor='transparent'
              >
                <Text style={styles.modalButtonText}>
                  {`Update to ${quantity} ${productUnit}`}
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      )
    }

    return (
      <View style={styles.container}>
        <Swipeout
          right={buttons}
          backgroundColor={Colors.mainBackgroundColor}
        >
          {productInfo}
        </Swipeout>
        {modal}
      </View>
    )
  }
}

const styles = StyleSheet.create({
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
  main: {
    flex: 5,
  },
  outerQuantityContainer: {
    flex: 1,
  },
  innerQuantityContainer: {
    alignItems: 'center',
  },
  quantity: {
    fontSize: 20,
    textAlign: 'right',
    paddingRight: 5,
    padding: 5,
  },
  par: {
    fontSize: 10,
    textAlign: 'center',
  },
  row: {
    borderRadius: Sizes.rowBorderRadius,
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 5,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center'
  },
  selectedRow: {
    backgroundColor: Colors.lightBlue
  },
  productText: {
    color: 'black',
    fontSize: 15
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalInnerContainer: {
    alignItems: 'center',
    borderRadius: Sizes.modalInnerBorderRadius,
    backgroundColor: '#fff',
    padding: 20,
  },
  modalHeader: {
    width: 260,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  modalHeaderText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    color: Colors.lightBlue,
  },
  iconClose: {
    width: 15,
    height: 15,
    position: 'absolute',
    bottom: 10,
  },
  picker: {
    width: 260,
    alignSelf: 'center',
    borderTopColor: Colors.separatorColor,
    borderTopWidth: 1,
    borderBottomColor: Colors.separatorColor,
    borderBottomWidth: 1,
  },
  modalButtonText: {
    textAlign: 'center',
    color: Colors.lightBlue,
    paddingTop: 15,
  },
  separator: {
    height: 0,
    borderBottomColor: Colors.separatorColor,
    borderBottomWidth: 1,
  },
});

ProductListItem.propTypes = {
  product: PropTypes.object.isRequired
};

export default ProductListItem
