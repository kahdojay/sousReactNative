import React from 'react-native';
import Dimensions from 'Dimensions';
import {Icon}  from 'react-native-icons';
import Colors from '../utilities/colors';
import Overlay from 'react-native-overlay';
import _ from 'lodash';

const {
  StyleSheet,
  View,
  Text,
  TextInput,
  PickerIOS,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
} = React;

class ProductCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      purveyorIdList: [null],
      category: null,
      amount: null,
      unit: null,
      purveyorSelected: false,
      categorySelected: false,
      amountSelected: false,
      unitSelected: false,
      ready: false,
      picker: null,
      // loaded: false,
      duplicateProductName: false,
      productNames: null,
      purveyors: null,
      categories: null,
    }
  }

  componentWillMount(){
    this.setState({
      productNames: _.pluck(this.props.products, 'name')
      purveyors: _.sortBy(this.props.purveyors, 'name'),
      categories: _.sortBy(this.props.categories, 'name'),
    })
  }

  // componentDidMount(){
  //   setTimeout(() => {
  //     this.setState({
  //       loaded: true
  //     })
  //   }, 500);
  // }

  productIssues() {
    let error = false
    if(this.state.name === ''){
      error = true
      this.setState({
        duplicateProductName: false
      })
    } else if(this.state.productNames.indexOf(this.state.name) !== -1) {
      this.setState({
        duplicateProductName: true
      })
      error = true
    }
    if(error === false){
      this.setState({
        duplicateProductName: false
      })
    }
    return error
  }

  submitReady(){
    if (
      this.state.purveyorSelected &&
      this.state.categorySelected &&
      this.state.amountSelected &&
      this.state.unitSelected &&
      this.productIssues() === false
    ) {
      const productAttributes = {
        name: this.state.name,
        purveyors: _.pluck(_.filter(this.state.purveyorIdList, (purveyor) => {
          return purveyor !== null
        }), 'id'),
        amount: this.state.amount,
        unit: this.state.unit,
        categoryId: this.state.category.id,
      }
      this.props.onAddProduct(productAttributes);
    } else {
      this.props.onProductNotReady();
    }
  }

  getPicker() {
    let picker = <View />;
    let selectedValue = null;
    const pickerItems = []
    switch (this.state.picker) {
      case 'purveyor':
        const {purveyors} = this.state;
        if (
          this.state.purveyorIdList[this.state.pickerIdx] !== null &&
          this.state.purveyorIdList[this.state.pickerIdx].hasOwnProperty('idx')
        ) {
          selectedValue = this.state.purveyorIdList[this.state.pickerIdx].idx;
        }
        pickerItems.push(
          <PickerIOS.Item
            key={null}
            value={null}
            label={'Select Purveyor ...'}
          />
        )
        // console.log(purveyors);
        purveyors.forEach((purveyor, purveyorIdx) => {
          const selectedIdx = _.findIndex(this.state.purveyorIdList, {'id': purveyor.id})
          if(selectedIdx === -1 || this.state.pickerIdx === selectedIdx){
            pickerItems.push(
              <PickerIOS.Item
                key={purveyorIdx}
                value={purveyorIdx}
                label={purveyor.name}
              />
            )
          }
        })
        picker = (
          <PickerIOS
            selectedValue={selectedValue}
            onValueChange={(purveyorIdx) => {
              let purveyorIdList = this.state.purveyorIdList
              if(purveyorIdx === null){
                purveyorIdList = [
                  ...purveyorIdList.slice(0, this.state.pickerIdx),
                  ...purveyorIdList.slice(this.state.pickerIdx + 1)
                ]
                if(purveyorIdList.length === 0){
                  purveyorIdList.push(null)
                }
              } else {
                const purveyor = purveyors[purveyorIdx]
                purveyorIdList[this.state.pickerIdx] = {idx: purveyorIdx, id: purveyor.id, name: purveyor.name}
              }
              this.setState({
                purveyorIdList: purveyorIdList,
                purveyorSelected: true,
                picker: null,
                pickerIdx: null
              }, () => {
                this.submitReady();
              })
            }}
          >
            {pickerItems}
          </PickerIOS>
        );
        break;
      case 'category':
        const {categories} = this.state;
        if(this.state.category !== null && this.state.category.hasOwnProperty('id')){
          selectedValue = this.state.category.id;
        }
        pickerItems.push(
          <PickerIOS.Item
            key={null}
            value={null}
            label={'Select Category ...'}
          />
        )
        categories.forEach((category, categoryIdx) => {
          pickerItems.push(
            <PickerIOS.Item
              key={category.id}
              value={category.id}
              label={category.name}
            />
          )
        })
        picker = (
          <PickerIOS
            selectedValue={selectedValue}
            onValueChange={(categoryId) => {
              let category = null
              if(categoryId !== null){
                category = this.props.categories[categoryId]
              }
              this.setState({
                category: category,
                categorySelected: true,
                picker: null,
                pickerIdx: null
              }, () => {
                this.submitReady();
              })
            }}
          >
            {pickerItems}
          </PickerIOS>
        );
        break;
      case 'amount':
        const amounts = _.range(1, 500)
        picker = (
          <PickerIOS
            selectedValue={this.state.amount}
            onValueChange={(amount) => {
              this.setState(
                {
                  amount: amount,
                  amountSelected: true,
                },
                () => { this.submitReady(); }
              )
            }}
          >
            <PickerIOS.Item
              key={null}
              value={null}
              label={'Select Amount ...'}
            />
            {
              amounts.map((n, idx) => {
                return <PickerIOS.Item key={idx} value={n} label={n.toString()} />
              })
            }
          </PickerIOS>
        );
        break;
      case 'units':
        const units = ['bag', 'bunch', 'cs', 'dozen', 'ea', 'g', 'kg', 'lb', 'oz', 'pack', 'tub']
        picker = (
          <PickerIOS
            selectedValue={this.state.unit}
            onValueChange={(unit) => {
              this.setState(
                {
                  unit: unit,
                  unitSelected: true,
                },
                () => { this.submitReady(); }
              )
            }}
          >
            <PickerIOS.Item
              key={null}
              value={null}
              label={'Select Unit ...'}
            />
            {
              units.map((unit, idx) => {
                return <PickerIOS.Item key={idx} value={unit} label={unit} />
              })
            }
          </PickerIOS>
        );
        break;
      case null:
      default:
        picker = <View />;
        break;
    }
    return picker
  }

  getPurveyorInputs() {
    const {purveyors} = this.props;
    let purveyorInputs = [];
    let purveyorIdList = this.state.purveyorIdList;
    if(purveyorIdList[(purveyorIdList.length-1)] !== null){
      purveyorIdList.push(null)
    }
    purveyorIdList.forEach((selectedPurveyor, idx) => {
      purveyorInputs.push((
        <View key={`purveyor-${idx}`} style={styles.inputContainer}>
          <Text style={styles.inputTitle}>
            {idx > 0 ? 'Additional Purveyor' : 'Purveyor'}
          </Text>
          <TouchableHighlight
            underlayColor='transparent'
            onPress={() => {
              this.setState({
                picker: 'purveyor',
                pickerIdx: idx
              })
            }}
            style={styles.inputFieldContainer}
          >
            <Text style={styles.inputField}>
            {
              selectedPurveyor !== null ?
                selectedPurveyor.name.substr(0,24) + (selectedPurveyor.name.length > 24 ? '...' : '')
                : 'Select Purveyor'
            }
            </Text>
          </TouchableHighlight>
        </View>
      ))
    })
    return purveyorInputs;
  }

  render() {
    const {purveyors} = this.props;
    const currentTeamId = this.props.team.id;
    const picker = this.getPicker()
    const purveyorInputs = this.getPurveyorInputs()
    let productError = <View />
    if(this.state.duplicateProductName === true){
      productError = <Text>Error, product name already exists</Text>
    }
    return (
      <ScrollView
        automaticallyAdjustContentInsets={false}
        style={styles.scrollView}
      >
        <View key={'name'} style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Name</Text>
          <TextInput
            ref='name'
            style={[styles.inputField, {flex: 2}]}
            placeholder='Name'
            onChange={(e) => {
              this.setState({name: e.nativeEvent.text}, () => {
                this.submitReady();
              });
            }}
          />
        {productError}
        </View>
        {purveyorInputs}
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Category</Text>
          <TouchableHighlight
            underlayColor='transparent'
            onPress={() => {
              this.setState({
                picker: 'category'
              })
            }}
            style={styles.inputFieldContainer}
          >
            <Text style={styles.inputField}>
              {
                this.state.category ?
                  this.state.category.name :
                  'Select Category'
              }
            </Text>
          </TouchableHighlight>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Amount</Text>
          <TouchableHighlight
            underlayColor='transparent'
            onPress={() => {
              this.setState({
                picker: 'amount'
              })
            }}
            style={styles.inputFieldContainer}
          >
            <Text style={styles.inputField}>
              { this.state.amountSelected ? this.state.amount : 'Amount' }
            </Text>
          </TouchableHighlight>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Units</Text>
          <TouchableHighlight
            underlayColor='transparent'
            onPress={() => {
              this.setState({
                picker: 'units'
              })
            }}
            style={styles.inputFieldContainer}
          >
            <Text style={styles.inputField}>
              { this.state.unitSelected ? this.state.unit : 'Units' }
            </Text>
          </TouchableHighlight>
        </View>
        {picker}
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  inputTitle: {
    // v- this with looks good on iPhone 6 plus and 4s
    width: Dimensions.get('window').width * .54,
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
    fontSize: 14,
    padding: 8,
    color: Colors.greyText,
  },
  inputFieldContainer: {
    flex: 1,
  },
  inputField: {
    padding: 8,
    margin: 2,
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'right',
  },
  scrollView: {
    backgroundColor: '#f9f9f9',
    flex: 1,
  },
  emptySpace: {
    height: 20,
  },
});

module.exports = ProductCreate;
