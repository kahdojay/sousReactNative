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
    let inputFieldLabel = `Select ${this.props.field}`
    if(this.props.selectedValue !== null){
      inputFieldLabel = this.props.selectedValue
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
            {inputFieldLabel}
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
      selectedName: '',
      selectedCategory: null,
      selectedPurveyor: null,
      selectedAmount: null,
      selectedUnits: null,
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

  submitPicker() {
    this.setState({
      modalVisible: false,
      fieldPicker: null,
      fieldPickerIdx: null,
    })

    this.checkValidForm();
  }

  checkValidForm(){}

  // submit form?

  render() {
    let fields = []
    let items = []
    let leftButtonText = 'Update'
    let selectedValue = null

    this.fields.forEach((field, idx) => {
      let selectedValue = null
      const selectedValueId = `selected${field}`
      if(this.state.hasOwnProperty(selectedValueId) === true) {
        selectedValue = this.state[selectedValueId]
        if(field === 'Category'){
          const categoryId = this.state[selectedValueId]
          selectedValue = this.props.categories[categoryId].name
        }
      }
      fields.push(
        <PickerFieldRow
          key={field}
          field={field}
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
          selectedValue = this.state.selectedPurveyor
          break;

        case 'Category':
          const categories = _.sortBy(this.props.categories, 'name')
          items = []
          items = items.concat(_.map(categories, (category, idx) => {
            return {
              key: category.id,
              value: category.id,
              label: category.name,
            }
          }))
          selectedValue = this.state.selectedCategory
          break;

        case 'Amount':
          items = []
          // items.push({
          //   key: null,
          //   value: null,
          //   label: 'Select Amount',
          // })
          items = items.concat(_.map(_.range(1, 501), (n, idx) => {
            return {
              key: idx,
              value: n,
              label: n.toString(),
            }
          }))
          selectedValue = this.state.selectedAmount
          // selectedValue = items[1].value
          // leftButtonText = `Update to {{value}}`
          break;

        case 'Units':
          const units = ['bag', 'bunch', 'cs', 'dozen', 'ea', 'g', 'kg', 'lb', 'oz', 'pack', 'tub']
          items = []
          items = items.concat(_.map(units, (unit, idx) => {
            return {
              key: idx,
              value: unit,
              label: unit,
            }
          }))
          selectedValue = this.state.selectedUnits
          break;

        default:
          break;
      }
    }



    return (
      <View>
        <ScrollView
          automaticallyAdjustContentInsets={false}
          style={styles.scrollView}
        >
          <View key={'name'} style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Name</Text>
            <TextInput
              ref='name'
              style={[styles.inputField, {flex: 3}]}
              value={this.state.name}
              placeholder='Name'
              onChange={(e) => {
                this.setState({selectedName: e.nativeEvent.text}, () => {
                  console.log('select name')
                  // this.checkValidForm();
                });
              }}
            />
          </View>
          {fields}
        </ScrollView>
        <PickerModal
          modalVisible={this.state.modalVisible}
          headerText={`Select ${this.state.fieldPicker}`}
          leftButtonText={leftButtonText}
          items={items}
          selectedValue={selectedValue}
          onHideModal={() => {
            this.setState({
              modalVisible: false,
            })
          }}
          onSubmitValue={(value) => {
            // console.log(value)
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

            this.setState(updateState)
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
    flex: 1,
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
  pickerContainer: {
    paddingBottom: 20,
    marginBottom: 20,
  },
  picker: {
    width: 260,
    alignSelf: 'center',
    borderTopColor: Colors.separatorColor,
    borderTopWidth: 1,
    borderBottomColor: Colors.separatorColor,
    borderBottomWidth: 1,
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
  modalButtonText: {
    textAlign: 'center',
    color: Colors.lightBlue,
    paddingTop: 15,
  },
});

module.exports = ProductForm;
