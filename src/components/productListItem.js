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
    let modal = (
      <View />
    );
    let buttons = []
    if(product !== null){
      let purveyorString = ""
      if(purveyors.hasOwnProperty(this.state.selectedPurveyorId) === true){
        purveyorString = purveyors[this.state.selectedPurveyorId].name || '-NOT SET-'
      } else {
        // Single purveyor, grab name off props.purveyors
        // const purveyorIds = Object.keys(purveyors)
        // purveyorString = purveyors[purveyorIds[0]].name
        purveyorString = 'Multiple purveyors'
      }
      let selectedStyle = []
      let productDetailsColor = '#999'
      if(this.state.added === true){
        selectedStyle = styles.selectedRow
        productDetailsColor = '#000'
      }
      productInfo = (
        <View style={[styles.row, selectedStyle]}>
          <View style={styles.main}>
            <ProductToggle
              added={this.state.added}
              availablePurveyors={product.purveyors}
              allPurveyors={purveyors}
              currentlySelectedPurveyorId={this.state.selectedPurveyorId}
              onToggleCartProduct={(purveyorId) => {
                this.handleToggleProduct(purveyorId)
              }}
            >
              <View>
                <Text style={styles.productText}>
                  {product.name}
                </Text>
                <Text style={{fontSize: 9,  color: productDetailsColor}} >
                  {`${product.amount} ${product.unit}`}
                </Text>
                <Text style={{fontSize: 9,  color: productDetailsColor}} >
                  {purveyorString}
                </Text>
              </View>
            </ProductToggle>
          </View>
          <View style={styles.quantityContainer}>
            { this.state.added === true ?
              <TouchableHighlight
                onPress={() => {
                  this.setState({
                    editQuantity: true
                  })
                }}
                underlayColor='transparent'
              >
                <Text style={styles.quantity}>{`${this.state.quantity}x`}</Text>
              </TouchableHighlight>
              : <Text style={styles.quantity}>{''}</Text>
            }
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
              <PickerIOS
                selectedValue={this.state.quantity}
                onValueChange={(quantity) => {
                  this.setState({
                    quantity: quantity,
                  })
                }}
                style={{width: 260, alignSelf: 'center'}}
              >
                {
                  quantities.map((n, idx) => {
                    return <PickerIOS.Item key={idx} value={n} label={n.toString()} />
                  })
                }
              </PickerIOS>
              <View style={styles.separator} />
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
  quantityContainer: {
    flex: 1.5,
  },
  quantity: {
    fontSize: 20,
    textAlign: 'right',
    paddingRight: 5
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
  main: {
    flex: 5,
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
    borderRadius: Sizes.modalInnerBorderRadius,
    backgroundColor: '#fff',
    padding: 20,
  },
  modalButtonText: {
    textAlign: 'center',
    color: Colors.lightBlue,
    paddingTop: 15,
  },
  separator: {
    height: 0,
    borderBottomColor: '#bbb',
    borderBottomWidth: 1,
  },
});

ProductListItem.propTypes = {
  product: PropTypes.object.isRequired
};

export default ProductListItem
