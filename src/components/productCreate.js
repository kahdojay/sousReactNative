const React = require('react-native');
let MultiPickerIOS = require('react-native-multipicker');
let { Group, Item } = MultiPickerIOS;
// import Dimensions from 'Dimensions';
import {Icon}  from 'react-native-icons';
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
      amount: 1,
      unit: 'bag',
      purveyorSelected: false,
      categorySelected: false,
      amountSelected: false,
      unitSelected: false,
      ready: false,
      picker: null,
      // loaded: false,
    }
  }

  // componentWillUnmount(){
  //   // console.log('UPDATE', this.state)
  //   this.setState({
  //     loaded: false
  //   })
  // }
  //
  // componentDidMount(){
  //   setTimeout(() => {
  //     this.setState({
  //       loaded: true
  //     })
  //   }, 500);
  // }

  submitReady(){
    if (
      this.state.purveyorSelected &&
      this.state.categorySelected &&
      this.state.amountSelected &&
      this.state.unitSelected &&
      this.state.name != ''
    ) {
      const productAttributes = {
        name: this.state.name,
        purveyorIdList: this.state.purveyorIdList,
        amount: `${this.state.amount} ${this.state.unit}` ,
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
        const {purveyors} = this.props;
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
        const categories = this.props.team.categories;
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
        Object.keys(categories).forEach((categoryId) => {
          const category = categories[categoryId]
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
                category = categories[categoryId]
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
        // TODO split this into two single pickers
        const units = ['bag', 'bunch', 'cs', 'dozen', 'ea', 'g', 'kg', 'lb', 'oz', 'pack', 'tub']
        const amounts = _.range(1, 500)
        picker = (
          <MultiPickerIOS style={styles.picker}>
            <Group
              selectedValue={this.state.amount}
              onChange={(e) => {
                // console.log(e)
                this.setState({
                  amount: e.newValue,
                  amountSelected: true
                }, () => {
                  this.submitReady();
                });
              }}
            >
              { amounts.map((num, idx) => {
                return <Item value={num} key={idx} label={num.toString()} />
              })}
            </Group>
            <Group
              selectedValue={this.state.unit}
              onChange={(e) => {
                this.setState({
                  unit: e.newValue,
                  unitSelected: true,
                }, () => {
                  this.submitReady();
                })
              }}
            >
              { units.map((val, idx) => {
                return <Item value={val} key={idx} label={val} />
              })}
            </Group>
          </MultiPickerIOS>
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
          <Text style={styles.inputTitle}>{idx > 0 ? 'Additional Purveyor' : 'Purveyor'}</Text>
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
            { selectedPurveyor !== null ?
              selectedPurveyor.name.substr(0,20) + (selectedPurveyor.name.length > 20 ? '...' : '')
            : 'Select Purveyor' }
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
    return (
      <ScrollView style={styles.scrollView}>
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
              { this.state.category ?
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
              {
                //TODO split this into two inputs.
                this.state.amountSelected ? this.state.amount : 'Amount of'
              } {this.state.unitSelected ? this.state.unit : 'Units'}
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
    justifyContent: 'center',
    backgroundColor: '#fefefe',
    borderRadius: 4,
  },
  inputTitle: {
    flex: 1,
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
    fontSize: 14,
    padding: 8,
  },
  picker: {
    // width: Dimensions.get('window').width * .3,
    // width: 500,
    // paddingRight: 20,
    // paddingLeft: 20,
    // marginLeft: 20,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  group: {
    // width: Dimensions.get('window').width,
    // width: 555,
    paddingRight: 20,
    paddingLeft: 20,
    marginLeft: 20,
  },
  inputFieldContainer: {
    flex: 2,
  },
  inputField: {
    backgroundColor: 'white',
    borderWidth: 1,
    color: '#777',
    borderColor: '#f2f2f2',
    borderRadius: 8,
    padding: 8,
    margin: 2,
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
    fontSize: 14,
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
