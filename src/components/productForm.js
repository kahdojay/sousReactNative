import React from 'react-native';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import _ from 'lodash';
import s from 'underscore.string';
import PickerModal from './modal/pickerModal';

const {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} = React;

class FieldRow extends React.Component {
  constructor(props) {
    super(props);
  }
  isFocused() {
    return this.refs.field.isFocused()
  }
  blur(cb) {
    let callback = cb || function(){}
    this.refs.field.blur()
    setTimeout(callback, 50)
  }
  render() {
    return (
      <View key={this.props.key} style={styles.inputContainer}>
        <View style={styles.inputFieldContainer}>
          <TextInput
            ref='field'
            style={styles.inputField}
            value={this.props.value}
            keyboardType={this.props.keyboardType || 'default'}
            placeholder={this.props.placeholder}
            inputPlaceholderColor={Colors.inputPlaceholderColor}
            onChange={this.props.onChange}
          />
        </View>
      </View>
    )
  }
}

class PickerFieldRow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let selectFieldText = `Tap to Select`
    if(this.props.selectFieldText){
      selectFieldText = this.props.selectFieldText
    }
    if(this.props.selectedValue !== null){
      selectFieldText = this.props.selectedValue.toString()
      if(selectFieldText.length > 20){
        selectFieldText = selectFieldText.substr(0,20) + '...'
      }
    }
    return (
      <View style={styles.inputContainer}>
        <TouchableHighlight
          underlayColor='transparent'
          onPress={() => { this.props.onShowFieldPicker() }}
          style={styles.inputSelectContainer}
        >
          <Text style={styles.selectField}>
            {selectFieldText}
          </Text>
        </TouchableHighlight>
      </View>
    )
  }
}

class ProductForm extends React.Component {
  constructor(props) {
    super(props);
    // console.log('props: ', props)
    this.state = {
      newProduct: {},
      fieldPicker: null,
      fieldPickerIdx: null,
      modalVisible: false,
      selectedName: this.props.product ? this.props.product.name : '',
      selectedCategory: this.props.productCategory ? this.props.productCategory.id : null,
      selectedPurveyor: this.props.product ? this.props.product.purveyors : (this.props.fromPurveyorId ? [this.props.fromPurveyorId] : null),
      selectedAmount: this.props.product ? this.props.product.amount : 1,
      selectedUnits: this.props.product ? this.props.product.unit : 'cs',
      selectedSku: this.props.product ? this.props.product.sku : '',
      selectedPrice: this.props.product ? this.props.product.price : '',
      selectedPar: this.props.product ? this.props.product.par : '',
      selectedPackSize: this.props.product ? this.props.product.packSize : '',
    }
    this.fields = ['Purveyors','Category','Amount']//,'QtyUnits']
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.connected === false && JSON.stringify(this.state) === JSON.stringify(nextState)){
      return false
    }
    return true
  }

  showFieldPicker(field, idx) {
    const cb = () => {
      this.setState({
        modalVisible: true,
        fieldPicker: field,
        fieldPickerIdx: idx,
      })
    }
    if(this.refs.name && this.refs.name.isFocused() === true){
      this.refs.name.blur(cb)
    } else if(this.refs.unit && this.refs.unit.isFocused() === true){
      this.refs.unit.blur(cb)
    } else {
      cb()
    }
  }

  checkValidForm(){
    let selectedName = _.trim(this.state.selectedName.replace('\u00A0',' '))
    if (
      this.state.selectedPurveyor !== null &&
      this.state.selectedPurveyor.length > 0 &&
      this.state.selectedCategory &&
      this.state.selectedAmount &&
      this.state.selectedUnits &&
      selectedName !== ''
    ) {
      const productAttributes = {
        name: selectedName,
        purveyors: this.state.selectedPurveyor,
        amount: this.state.selectedAmount,
        unit: this.state.selectedUnits,
        categoryId: this.state.selectedCategory,
        sku: this.state.selectedSku,
        price: this.state.selectedPrice,
        par: this.state.selectedPar,
        packSize: this.state.selectedPackSize,
      }
      this.props.onProcessProduct(productAttributes);
    } else {
      this.props.onProductNotReady();
    }
  }

  render() {
    let fields = []
    let items = []
    let headerText = `Select ${this.state.fieldPicker}`
    let leftButtonText = 'Update'
    let selectedValue = null
    let pickerType = 'PickerIOS'

    this.fields.forEach((field, idx) => {
      let selectedValue = null
      let selectFieldText = `Tap to Select`
      const selectedValueId = `selected${field}`

      if(this.state.hasOwnProperty(selectedValueId) === true) {
        selectedValue = this.state[selectedValueId]
        if(field === 'Purveyors' && selectedValue !== null){
          const purveyorIds = this.state[selectedValueId]
          selectedValue = purveyorIds && purveyorIds.length === 1 ? this.props.purveyors[purveyorIds[0]].name : `${purveyorIds.length.toString()} Purveyors Selected`
          if(purveyorIds.length === 0){
            selectedValue = null
          }
        }
        if(field === 'Category'){
          const categoryId = this.state[selectedValueId]
          selectedValue = categoryId ? this.props.categories[categoryId].name : null
        }
      }

      fields.push(
        <View>
          <Text>{field}</Text>
          <PickerFieldRow
            key={field}
            field={field}
            selectFieldText={selectFieldText}
            selectedValue={selectedValue}
            onShowFieldPicker={() => {
              this.showFieldPicker(field, idx)
            }}
          />
        </View>
      )
    })

    if(this.state.fieldPicker !== null){
      items = []
      // get the items by switching by fieldPicker
      switch (this.state.fieldPicker) {

        case 'Purveyors':
          const purveyors = _.sortBy(this.props.purveyors, 'name')
          items = _.map(purveyors, (purveyor, idx) => {
            return {
              key: purveyor.id,
              value: purveyor.id,
              label: purveyor.name,
            }
          })
          headerText = `Select ${this.state.fieldPicker}`
          selectedValue = this.state.selectedPurveyor
          pickerType = 'ListView'
          break;

        case 'Category':
          const categories = _.sortBy(this.props.categories, 'name')
          items = _.map(categories, (category, idx) => {
            return {
              key: category.id,
              value: category.id,
              label: category.name,
            }
          })
          items.unshift({
            key: '--null--',
            value: null,
            label: '',
          })
          selectedValue = this.state.selectedCategory ? this.state.selectedCategory : null
          break;

        case 'Amount':
          items = _.map(['1/8','1/4','1/2', '3/4'], (frac, idx) => {
            const dec = frac.split('/')
            return {
              key: `d-${idx}`,
              value: parseFloat(dec[0]/dec[1]),
              label: frac,
            }
          })
          items = items.concat(_.map(_.range(1, 1001), (n, idx) => {
            return {
              key: idx,
              value: n,
              label: n.toString(),
            }
          }))
          items.unshift({
            key: '--null--',
            value: null,
            label: '',
          })
          selectedValue = this.state.selectedAmount ? parseFloat(this.state.selectedAmount) : null
          break;

        // case 'Units':
        //   const units = ['bag', 'btl', 'bunch', 'can', 'cs', 'ct', 'dozen', 'ea', 'g', 'jug', 'kg', 'lb', 'oz', 'pack', 'pc', 'tub']
        //   items = _.map(units, (unit, idx) => {
        //     return {
        //       key: idx,
        //       value: unit,
        //       label: unit,
        //     }
        //   })
        //   items.unshift({
        //     key: '--null--',
        //     value: null,
        //     label: '',
        //   })
        //   selectedValue = this.state.selectedUnits ? this.state.selectedUnits : null
        //   break;

        default:
          break;
      }
    }

    let selectedPrice = this.state.selectedPrice
    // if(selectedPrice && selectedPrice.length > 0){
    //   selectedPrice = s.numberFormat(parseFloat(selectedPrice), 2)
    // }

    return (
      <View style={styles.container}>
        <ScrollView
          automaticallyAdjustContentInsets={false}
          style={styles.scrollView}
        >
          <Text style={styles.textDivider}>Product Details</Text>
          <Text>Name</Text>
          <FieldRow
            key='name'
            ref='name'
            label='Name'
            placeholder='Avocado, Ripe (48 ct)'
            value={this.state.selectedName}
            onChange={(e) => {
              this.setState({
                selectedName: e.nativeEvent.text.replace(' ','\u00A0'),
              }, () => {
                this.checkValidForm();
              });
            }}
          />
          {fields}
          <Text>Base Unit</Text>
          <FieldRow
            key='unit'
            ref='unit'
            label='Base Unit'
            placeholder='case, ea, lb'
            value={this.state.selectedUnits}
            onChange={(e) => {
              this.setState({
                selectedUnits: e.nativeEvent.text,
              }, () => {
                this.checkValidForm();
              });
            }}
          />
          <Text style={styles.textDivider}>Additional Info (optional)</Text>
          <Text>SKU</Text>
          <FieldRow
            key='sku'
            ref='sku'
            label='SKU'
            value={this.state.selectedSku}
            onChange={(e) => {
              this.setState({
                selectedSku: e.nativeEvent.text,
              }, () => {
                this.checkValidForm();
              });
            }}
          />
          <Text>Price</Text>
          <FieldRow
            key='price'
            ref='price'
            label='Price'
            keyboardType='numeric'
            value={selectedPrice}
            onChange={(e) => {
              let price = e.nativeEvent.text.replace(',','')
              this.setState({
                selectedPrice: price,
              }, () => {
                this.checkValidForm();
              });
            }}
          />
          <Text>Par</Text>
          <FieldRow
            key='par'
            ref='par'
            label='Par'
            value={this.state.selectedPar}
            onChange={(e) => {
              this.setState({
                selectedPar: e.nativeEvent.text,
              }, () => {
                this.checkValidForm();
              });
            }}
          />
          <Text>Pack Size</Text>
          <FieldRow
            key='packSize'
            ref='packSize'
            label='Pack Size'
            value={this.state.selectedPackSize}
            onChange={(e) => {
              this.setState({
                selectedPackSize: e.nativeEvent.text,
              }, () => {
                this.checkValidForm();
              });
            }}
          />
        </ScrollView>
        <PickerModal
          modalVisible={this.state.modalVisible}
          headerText={headerText}
          leftButtonText={leftButtonText}
          items={items}
          pickerType={pickerType}
          selectedValue={selectedValue}
          onHideModal={() => {
            this.setState({
              modalVisible: false,
            })
          }}
          onSubmitValue={(value) => {
            const updateState = {
              modalVisible: false,
            }
            const selectedValueId = `selected${this.state.fieldPicker}`
            if(this.state.hasOwnProperty(selectedValueId) === true) {
              let selectedValue = null
              if(value !== null && value.hasOwnProperty('selectedValue') === true){
                selectedValue = value.selectedValue
              }
              updateState[selectedValueId] = selectedValue
            }

            this.setState(updateState, () => {
              this.checkValidForm();
            })
          }}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBackgroundColor,
    padding: 5,
    paddingTop: 10,
  },
  scrollView: {
    flex: 1,
  },
  textDivider: {
    color: Colors.darkGrey,
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  inputContainer: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
    marginBottom: 1,
  },
  inputFieldContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  inputSelectContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  selectField: {
    flex: 1,
    fontFamily: 'OpenSans',
    fontSize: 14,
    marginLeft: 10,
    paddingTop: 13,
    paddingBottom: 13,
  },
  inputField: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    height: 45,
    marginLeft: 10,
  },
});

module.exports = ProductForm;
