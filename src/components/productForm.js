import React from 'react-native';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import _ from 'lodash';
import PickerModal from './modal/pickerModal';

const {
  Modal,
  PickerIOS,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} = React;

class PickerFieldRow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let selectFieldText = `Select ${this.props.field}`
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
        <Text style={styles.inputTitle}>{this.props.field}</Text>
        <TouchableHighlight
          underlayColor='transparent'
          onPress={() => { this.props.onShowFieldPicker() }}
          style={styles.inputFieldContainer}
        >
          <Text style={styles.inputField}>
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
    this.state = {
      newProduct: {},
      fieldPicker: null,
      fieldPickerIdx: null,
      modalVisible: false,
      selectedName: this.props.product ? this.props.product.name : '',
      selectedCategory: this.props.productCategory ? this.props.productCategory.id : null,
      selectedPurveyor: this.props.product ? this.props.product.purveyors : null,
      selectedAmount: this.props.product ? this.props.product.amount : null,
      selectedUnits: this.props.product ? this.props.product.unit : null,
    }
    this.fields = ['Purveyor','Category','Amount','Units']
  }

  showFieldPicker(field, idx) {
    this.refs.name.blur()
    this.setState({
      modalVisible: true,
      fieldPicker: field,
      fieldPickerIdx: idx,
    })
  }

  checkValidForm(){
    if (
      this.state.selectedPurveyor.length > 0 &&
      this.state.selectedCategory &&
      this.state.selectedAmount &&
      this.state.selectedUnits &&
      this.state.selectedName !== ''
    ) {
      const productAttributes = {
        name: this.state.selectedName,
        purveyors: this.state.selectedPurveyor,
        amount: this.state.selectedAmount,
        unit: this.state.selectedUnits,
        categoryId: this.state.selectedCategory,
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
      let selectFieldText = `Select ${field}`
      const selectedValueId = `selected${field}`

      if(field === 'Purveyor'){
        selectFieldText = `Select ${field}(s)`
      }

      if(this.state.hasOwnProperty(selectedValueId) === true) {
        selectedValue = this.state[selectedValueId]
        if(field === 'Purveyor' && selectedValue !== null){
          const purveyorIds = this.state[selectedValueId]
          selectedValue = purveyorIds && purveyorIds.length === 1 ? this.props.purveyors[purveyorIds[0]].name : `${purveyorIds.length.toString()} Selected`
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
        <PickerFieldRow
          key={field}
          field={field}
          selectFieldText={selectFieldText}
          selectedValue={selectedValue}
          onShowFieldPicker={() => {
            this.showFieldPicker(field, idx)
          }}
        />
      )
    })

    if(this.state.fieldPicker !== null){
      items = []
      // get the items by switching by fieldPicker
      switch (this.state.fieldPicker) {

        case 'Purveyor':
          const purveyors = _.sortBy(this.props.purveyors, 'name')
          items = _.map(purveyors, (purveyor, idx) => {
            return {
              key: purveyor.id,
              value: purveyor.id,
              label: purveyor.name,
            }
          })
          headerText = `Select ${this.state.fieldPicker}(s)`
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
          selectedValue = this.state.selectedCategory
          break;

        case 'Amount':
          items = _.map(['1/8','1/4','1/2'], (frac, idx) => {
            const dec = frac.split('/')
            return {
              key: `d-${idx}`,
              value: parseFloat(dec[0]/dec[1]),
              label: frac,
            }
          })
          items = items.concat(_.map(_.range(1, 501), (n, idx) => {
            return {
              key: idx,
              value: n,
              label: n.toString(),
            }
          }))
          selectedValue = parseFloat(this.state.selectedAmount)
          break;

        case 'Units':
          const units = ['bag', 'bunch', 'cs', 'dozen', 'ea', 'g', 'kg', 'lb', 'oz', 'pack', 'tub']
          items = _.map(units, (unit, idx) => {
            return {
              key: idx,
              value: unit,
              label: unit,
            }
          })
          selectedValue = this.state.selectedUnits
          break;

        default:
          break;
      }
    }

    return (
      <View style={{flex:1}}>
        <ScrollView
          automaticallyAdjustContentInsets={false}
          style={styles.scrollView}
        >
          <View key={'name'} style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Name</Text>
            <TextInput
              ref='name'
              style={[styles.inputField, {flex: 3}]}
              value={this.state.selectedName}
              placeholder='Name'
              onChange={(e) => {
                this.setState({
                  selectedName: e.nativeEvent.text,
                }, () => {
                  this.checkValidForm();
                });
              }}
            />
          </View>
          {fields}
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
  scrollView: {
    // backgroundColor: 'blue',
    // backgroundColor: Colors.mainBackgroundColor,
    flex: 1,
  },
  inputContainer: {
    flex: 1,
    // marginTop: 2,
    // backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  inputTitle: {
    flex: 1,
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
    fontSize: 14,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 8,
    color: Colors.greyText,
  },
  inputFieldContainer: {
    flex: 3,
  },
  inputField: {
    padding: 8,
    paddingTop: 10,
    paddingBottom: 10,
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'right',
  },
});

module.exports = ProductForm;
