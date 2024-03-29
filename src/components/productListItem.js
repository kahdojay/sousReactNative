import React from 'react-native';
import ProductToggle from './productToggle';
import { Icon } from 'react-native-icons';
import _ from 'lodash';
import s from 'underscore.string';
import { CART } from '../actions/actionTypes';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import Swipeout from 'react-native-swipeout';
import PickerModal from './modal/pickerModal';
import ConfirmationModal from './modal/confirmationModal';

const {
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
      productUpdated: false,
      purveyors: null,
      added: false,
      quantity: 1,
      purveyorId: '',
      selectedPurveyorId: null,
      cartPurveyorId: null,
      note: '',
      editQuantity: false,
      cartItem: null,
      showConfirmationModal: false,
      updateComponent: false,
    }
    this.loadTimeoutId = null
  }

  shouldComponentUpdate(nextProps, nextState) {
    const debugUpdates = false

    if(this.state.loaded === false){
      if(debugUpdates) console.log('Loaded: ', this.state.loaded)
      return true;
    }

    if(this.state.showConfirmationModal !== nextState.showConfirmationModal){
      if(debugUpdates) console.log('Confirmation Modal: ', this.state.showConfirmationModal, nextState.showConfirmationModal)
      return true;
    }

    if(this.state.editQuantity !== nextState.editQuantity){
      if(debugUpdates) console.log('Edit Quantity Modal: ', this.state.editQuantity, nextState.editQuantity)
      return true;
    }

    if(this.state.productUpdated === true){
      if(debugUpdates) console.log('Product Updated: ', this.state.productUpdated)
      return true;
    }

    // if(this.state.product.categoryId !== nextProps.product.categoryId) {
    //   if(debugUpdates) console.log('Edit Category: ', this.state.product.categoryId, nextProps.product.categoryId)
    //   return true;
    // }

    // if(this.state.product.purveyors !== nextProps.product.purveyors) {
    //   if(debugUpdates) console.log('Edit Purveyors: ', this.state.product.purveyors, nextProps.product.purveyors)
    //   return true;
    // }

    // console.log(this.state.added, nextState.added, nextProps.cartItem)
    if(this.state.added !== nextState.added){
      if(debugUpdates) console.log('Cart Item Added/Removed Local: ', this.state.added, nextState.added)
      return true;
    } else if(this.state.added === false && nextProps.cartItem !== null){
      if(debugUpdates) console.log('Added Remote: ', this.state.added, nextProps.cartItem)
      return true;
    } else if(this.state.added === true && nextProps.cartItem === null){
      if(debugUpdates) console.log('Removed Remote: ', this.state.added, nextProps.cartItem)
      return true;
    }

    // if(nextState.updateComponent === true){
    //   if(debugUpdates) console.log('State[updateComponent]: ', nextState.updateComponent)
    //   return true;
    // }

    return false;
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps.actionType)
    const approvedActionTypes = [
      'RECEIVE_CART_ITEM',
      'RECEIVE_PRODUCTS',
      'RECEIVE_TEAM_RESOURCE_INFO',
    ]
    let allowUpdates = false
    let productUpdated = false
    if(approvedActionTypes.indexOf(nextProps.actionType) !== -1){
      allowUpdates = true
    }
    if(JSON.stringify(this.state.product) !== JSON.stringify(nextProps.product)){
      allowUpdates = true
      productUpdated = true
    }
    if(nextProps.cartItem !== null && this.state.quantity !== nextProps.cartItem.quantity){
      allowUpdates = true
      productUpdated = true
    }
    if(allowUpdates) {
      this.setState({
        product: nextProps.product,
        productUpdated: productUpdated,
        purveyorId: nextProps.cartPurveyorId,
      }, () => {
        this.localStateUpdateFromCart(nextProps.cartItem, nextProps.product)
      })
    }
  }

  componentDidMount() {
    // this.loadTimeoutId = setTimeout(() => {
      const selectedPurveyorId = Object.keys(this.props.purveyors)[0]
      this.setState({
        loaded: true,
        product: this.props.product,
        purveyors: this.props.purveyors,
        selectedPurveyorId: selectedPurveyorId,
        purveyorId: this.props.cartPurveyorId,
      }, () => {
        this.localStateUpdateFromCart(this.props.cartItem)
      })
    // }, this.props.loadDelay)
  }

  // componentDidUpdate() {
  //   this.setState({
  //     updateComponent: false,
  //   })
  // }

  componentWillUnmount() {
    clearTimeout(this.loadTimeoutId)
  }

  localStateUpdateFromCart(cartItem, product) {
    let newState = {
      productUpdated: false,
    }
    if (cartItem !== null) {
      newState = {
        note: cartItem.note,
        cartItem: cartItem,
        // product: product,
      };
      if(this.state.added !== true){
        newState.added = true;
      }
      if(this.state.editQuantity === false){
        newState.quantity = cartItem.quantity;
      }
    } else {
      newState = {
        quantity: 1,
        note: '',
        cartItem: null,
      };
      if(this.state.added !== false){
        newState.added = false;
      }
    }
    this.setState(newState);
  }

  cartUpdateFromLocalState(deleteProduct) {
    const cartAttributes = Object.assign({}, this.state.cartItem, {
      purveyorId: this.state.selectedPurveyorId,
      productId: this.props.product.id,
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
    this.props.onUpdateProductInCart(cartAction, cartAttributes, deleteProduct);
  }

  handleToggleProduct(purveyorId, deleteProduct) {
    // console.log(purveyorId, this.state.purveyorId)
    this.setState({
      added: !this.state.added,
      selectedPurveyorId: purveyorId,
      purveyorId: purveyorId,
    }, () => {
      this.cartUpdateFromLocalState(deleteProduct)
    })
  }

  render() {
    const {product} = this.state
    const {purveyors, category, showPurveyorInfo, showCategoryInfo} = this.props;

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
    if(product){
      if(product.deleted === true){
        return <View />;
      }

      let purveyorInfo = null
      let categoryInfo = null
      let productInfoSeparator = null
      let selectedStyle = {}
      let productDetailsColor = Colors.greyText
      let productColor = 'black'
      let productQuantityBorderStyle = {}
      let allowQualityChange = true

      if(this.state.added === true){
        if(showPurveyorInfo === false && this.state.selectedPurveyorId !== this.state.purveyorId){
          selectedStyle = styles.selectedRowDisabled
          productDetailsColor = Colors.darkGrey
          productQuantityBorderStyle = {
            borderColor: 'black',
            borderWidth: .5,
            borderRadius: 15,
          }
        } else {
          selectedStyle = styles.selectedRow
          productDetailsColor = 'white'
          productColor = 'white'
          productQuantityBorderStyle = {
            borderColor: 'white',
            borderWidth: .5,
            borderRadius: 15,
          }
        }
      }

      let availablePurveyors = product.purveyors

      if(showPurveyorInfo === true){
        let purveyor = null
        if(purveyors.hasOwnProperty(this.state.selectedPurveyorId) === true){
          purveyor = purveyors[this.state.selectedPurveyorId]
        }
        if(purveyors.hasOwnProperty(this.state.purveyorId) === true){
          purveyor = purveyors[this.state.purveyorId]
        }
        if(purveyor){
          purveyorInfo = (
            <Text style={[styles.productDetailsSubText, {color: productDetailsColor}]}>{purveyor.name || '-NOT SET-'}</Text>
          )
        } else {
          // Single purveyor, grab name off props.purveyors
          // const purveyorIds = Object.keys(purveyors)
          // purveyorInfo = purveyors[purveyorIds[0]].name
          purveyorInfo = (
            <Text style={[styles.productDetailsSubText, {color: productDetailsColor}]}>No purveyors</Text>
          )
        }
      } else {
        availablePurveyors = [this.state.selectedPurveyorId]
      }

      let ProductWrapper = ProductToggle
      let productWrapperProps = {
        added: this.state.added,
        availablePurveyors: availablePurveyors,
        allPurveyors: purveyors,
        currentlySelectedPurveyorId: this.state.selectedPurveyorId,
        onToggleCartProduct: (purveyorId) => {
          this.handleToggleProduct(purveyorId)
        },
      }
      if(this.state.added === true && this.state.selectedPurveyorId !== this.state.purveyorId){
        ProductWrapper = View
        productWrapperProps = {}
        allowQualityChange = false
      }

      if(showCategoryInfo === true) {
        categoryInfo = (
          <Text style={{fontSize: 9,  color: productDetailsColor}}>
            { category && category.hasOwnProperty('name') === true ?
              category.name
            : <Text style={{fontStyle: 'italic', color: Colors.red}}>Category missing</Text> }
          </Text>
        )
      }
      if(showPurveyorInfo === true && showCategoryInfo === true){
        productInfoSeparator = (
          <Icon name='material|chevron-right' size={16} color={productDetailsColor} style={{width: 16, height: 11}}/>
        )
      }

      productInfo = React.createElement(ProductWrapper, productWrapperProps, (
        <View style={[styles.productRow, selectedStyle]}>
          <View style={styles.productDetailsContainer}>
            <Text style={[styles.productText, {color: productColor}]}>
              { product.hasOwnProperty('name') === true ?
                product.name
              : <Text style={{fontStyle: 'italic', color: Colors.red}}>Name missing</Text> }
            </Text>
            <Text style={[styles.productDetailsSubText, {color: productDetailsColor}]} >
              {`${product.amount} ${product.unit} ${product.price ? '• $' + s.numberFormat(parseFloat(product.price), 2) : ''}`}
            </Text>
            <View style={{flexDirection: 'row'}}>
              {purveyorInfo}{productInfoSeparator}{categoryInfo}
            </View>
          </View>
          <View style={styles.quantityOuterContainer}>
            { this.state.added === true && allowQualityChange === true ?
              (
                <View style={styles.quantityButton}>
                  <TouchableHighlight
                    onPress={() => {
                      this.setState({
                        editQuantity: true
                      })
                    }}
                    underlayColor='transparent'
                  >
                    <View style={[styles.quantityInnerContainer, productQuantityBorderStyle]}>
                      <Text style={[styles.quantityText, {color: productColor}]}>{`${this.state.quantity}x`}</Text>
                      <View style={styles.caretContainer}>
                        <Icon name='material|caret-up' size={13} color='white' style={styles.iconCaret} />
                        <Icon name='material|caret-down' size={13} color='white' style={styles.iconCaret} />
                      </View>
                    </View>
                  </TouchableHighlight>
                </View>
              )
              : (
                <Text style={styles.quantityText}>{' '}</Text>
              )
            }
            { product.par && product.par !== '' && product.par !== '0' ?
              <Text style={[styles.parText, {color: productDetailsColor}]}>Par: {product.par}</Text>
              : <View/>
            }
          </View>
        </View>
      ))

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
        onPress: () => {
          this.setState({
            showConfirmationModal: !this.state.showConfirmationModal,
          })
        }
      }]

      const quantities = _.range(1, 501)
      let quantity = this.state.quantity * product.amount;
      if(quantity.toString().indexOf('.') !== -1){
        quantity = parseFloat(Math.floor(quantity * 1000)/1000)
      }
      let productUnit = product.unit;
      if(this.state.quantity > 1){
        if(product.unit === 'bunch'){
          productUnit += 'es';
        } else if(product.unit !== 'ea' && product.unit !== 'dozen' && product.unit !== 'cs'){
          productUnit += 's';
        }
      }

      let quantityItems = _.map(['1/8','1/4','1/2', '3/4'], (frac, idx) => {
        const dec = frac.split('/')
        return {
          key: `d-${idx}`,
          value: parseFloat(dec[0]/dec[1]),
          label: frac,
        }
      })

      quantityItems = quantityItems.concat(_.map(_.range(1, 501), (n, idx) => {
        return {
          key: idx,
          value: n,
          label: n.toString(),
        }
      }))
      modal = (
        <PickerModal
          modalVisible={this.state.editQuantity}
          headerText='Select Amount'
          leftButtonText='Update'
          items={quantityItems}
          pickerType='PickerIOS'
          selectedValue={this.state.quantity}
          onHideModal={() => {
            this.setState({
              editQuantity: false,
            })
          }}
          onSubmitValue={(value) => {
            if(value !== null && value.hasOwnProperty('selectedValue') === true){
              const selectedValue = value.selectedValue
              this.setState({
                quantity: selectedValue,
                editQuantity: false,
              }, this.cartUpdateFromLocalState.bind(this))
            }
          }}
        />
      )
    }

    const confirmationModal = (
      <ConfirmationModal
        modalVisible={this.state.showConfirmationModal}
        confirmationMessage={'Are you sure you want to delete this product?'}
        onHideModal={() => {
          this.setState({
            showConfirmationModal: !this.state.showConfirmationModal,
          })
        }}
        onConfirmNo={() => {
          this.setState({
            showConfirmationModal: !this.state.showConfirmationModal,
          })
        }}
        onConfirmYes={() => {
          this.setState({
            showConfirmationModal: !this.state.showConfirmationModal,
          }, () => {
            if(this.state.added === true){
              const deleteProduct = true
              this.handleToggleProduct(this.state.selectedPurveyorId, deleteProduct)
            } else {
              this.props.onProductDelete()
            }
          })
        }}
      />
    )

    return (
      <View style={styles.container}>
        <Swipeout
          right={buttons}
          backgroundColor={Colors.mainBackgroundColor}
          scroll={(allowScroll) => {
            this.props.onAllowScroll(allowScroll)
          }}
        >
          {productInfo}
        </Swipeout>
        <View style={styles.separator}></View>
        {modal}
        {confirmationModal}
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
  productRow: {
    borderRadius: Sizes.rowBorderRadius,
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 5,
    paddingLeft: 15,
    alignItems: 'center'
  },
  productDetailsContainer: {
    flex: 4,
  },
  productText: {
    color: 'black',
    fontSize: 18,
  },
  productDetailsSubText: {
    fontSize: 14,
  },
  quantityOuterContainer: {
    flex: 1,
  },
  quantityInnerContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    padding: 6,
  },
  quantityButton: {
    flex: 1,
  },
  quantityText: {
    fontSize: 20,
    flex: 1,
  },
  parText: {
    fontSize: 10,
    textAlign: 'center',
  },
  selectedRow: {
    backgroundColor: Colors.lightBlue
  },
  selectedRowDisabled: {
    backgroundColor: Colors.disabled
  },
  icon: {
    width: 40,
    height: 40,
  },
  caretContainer: {
    alignSelf: 'center',
  },
  iconCaret: {
    width: 8,
    height: 8,
  },
  iconEdit: {
    flex: 1,
    alignSelf: 'center',
    width: 54,
    height: 40,
    marginLeft: 2,
  },
  separator: {
    marginTop: 5,
    flex: 1,
    borderBottomWidth: .5,
    borderColor: Colors.separatorColor,
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
});

ProductListItem.propTypes = {
  product: PropTypes.object.isRequired
};

export default ProductListItem
