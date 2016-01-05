import React from 'react-native';
import Dimensions from 'Dimensions';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import _ from 'lodash';

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

class ProductForm extends React.Component {
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
      purveyors: null,
      categories: null,
      modalVisible: false,
      selectedCategory: null,
    }
  }

  componentWillMount(){
    let productAttributes = {
      name: '',
      purveyorIdList: [null],
      category: null,
      amount: null,
      unit: null,
      purveyorSelected: false,
      categorySelected: false,
      amountSelected: false,
      unitSelected: false,
    }
    const {product} = this.props
    const sortedPurveyors = _.sortBy(this.props.purveyors, 'name');
    if(product !== null){
      productAttributes = product
      productAttributes.purveyorIdList = _.map(product.purveyors, (purveyorId) => {
        const purveyor = this.props.purveyors[purveyorId]
        const purveyorIdx = _.findIndex(sortedPurveyors, {id: purveyor.id})
        return {idx: purveyorIdx, id: purveyor.id, name: purveyor.name}
      })
      const category = _.filter(this.props.categories, (category) => {
        return category.products.indexOf(product.id) !== -1
      })
      productAttributes.category = category[0]
      productAttributes.purveyorSelected = true
      productAttributes.categorySelected = true
      productAttributes.amountSelected = true
      productAttributes.unitSelected = true
    }
    this.setState({
      name: productAttributes.name,
      purveyorIdList: productAttributes.purveyorIdList,
      category: productAttributes.category,
      amount: productAttributes.amount,
      unit: productAttributes.unit,
      purveyorSelected: productAttributes.purveyorSelected,
      categorySelected: productAttributes.categorySelected,
      amountSelected: productAttributes.amountSelected,
      unitSelected: productAttributes.unitSelected,
      purveyors: sortedPurveyors,
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

  submitReady(){
    if (
      this.state.purveyorSelected &&
      this.state.categorySelected &&
      this.state.amountSelected &&
      this.state.unitSelected &&
      this.state.name !== ''
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
      this.props.onProcessProduct(productAttributes);
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
        const {purveyors, purveyorIdList} = this.state;
        if (
          purveyorIdList[this.state.pickerIdx] !== null &&
          purveyorIdList[this.state.pickerIdx].hasOwnProperty('idx')
        ) {
          selectedValue = purveyorIdList[this.state.pickerIdx].idx;
        }
        pickerItems.push(
          <PickerIOS.Item
            key={null}
            value={null}
            label={'Select Purveyor'}
          />
        )
        // console.log(purveyors);
        purveyors.forEach((purveyor, purveyorIdx) => {
          const selectedIdx = _.findIndex(purveyorIdList, {'id': purveyor.id})
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
            // selectedValue={selectedValue}
            selectedValue={this.state.selectedPurveyor}
            onValueChange={(purveyorIdx) => {
              // let purveyorSelected = false
              // let newPurveyorIdList = []
              // newPurveyorIdList = newPurveyorIdList.concat(purveyorIdList)
              // if(purveyorIdx === null){
              //   newPurveyorIdList = [
              //     ...newPurveyorIdList.slice(0, this.state.pickerIdx),
              //     ...newPurveyorIdList.slice(this.state.pickerIdx + 1)
              //   ]
              //   if(newPurveyorIdList.length === 0){
              //     newPurveyorIdList.push(null)
              //   }
              // } else {
                const purveyor = purveyors[purveyorIdx]
                // newPurveyorIdList[this.state.pickerIdx] = {idx: purveyorIdx, id: purveyor.id, name: purveyor.name}
                // purveyorSelected = true
              // }
              this.setState({
                selectedPurveyor: purveyor.id,
                // purveyorIdList: newPurveyorIdList,
                // purveyorSelected: purveyorSelected,
                // picker: null,
                // pickerIdx: null
              }, () => {
                // this.submitReady();
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
          <View style={styles.pickerContainer}>
            <PickerIOS
              style={styles.picker}
              // selectedValue={selectedValue}
              selectedValue={this.state.selectedCategory}
              onValueChange={(categoryId) => {
                // let category = null
                // let categorySelected = false
                // if(categoryId !== null){
                //   category = this.props.categories[categoryId]
                //   categorySelected = true
                // }
                this.setState({
                  selectedCategory: categoryId,
                  // category: category,
                  // categorySelected: categorySelected,
                  // picker: null,
                  // pickerIdx: null
                }, () => {
                  // this.submitReady();
                })
              }}
            >
              {pickerItems}
            </PickerIOS>
          </View>
        );
        break;
      case 'amount':
        const amounts = _.range(1, 501)
        picker = (
          <PickerIOS
            selectedValue={parseFloat(this.state.amount)}
            onValueChange={(amount) => {
              let amountSelected = false
              if(amount !== null){
                amountSelected = true
              }
              this.setState(
                {
                  amount: amount,
                  amountSelected: amountSelected,
                },
                // () => { this.submitReady(); }
              )
            }}
          >
            <PickerIOS.Item key={null} value={null} label={'Select Amount ...'} />
            <PickerIOS.Item key={'1/8'} value={0.125} label={'1/8'} />
            <PickerIOS.Item key={'1/4'} value={0.25} label={'1/4'} />
            <PickerIOS.Item key={'1/2'} value={0.5} label={'1/2'} />
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
              let unitSelected = false
              if(unit !== null){
                unitSelected = true
              }
              this.setState(
                {
                  unit: unit,
                  unitSelected: unitSelected,
                },
                // () => { this.submitReady(); }
              )
            }}
          >
            <PickerIOS.Item
              key={null}
              value={null}
              label={'Select Units ...'}
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
        picker = (
          <View />
        );
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
            Purveyor {idx > 0 ? (idx+1) : ''}
          </Text>
          <TouchableHighlight
            underlayColor='transparent'
            onPress={() => {
              if(this.refs.name){
                this.refs.name.blur()
              }
              this.setState({
                picker: 'purveyor',
                pickerIdx: idx
              })
            }}
            style={[styles.inputFieldContainer, {flex: 2.5}]}
          >
            <Text style={styles.inputField}>
            {
              selectedPurveyor !== null ?
                selectedPurveyor.name.substr(0,20) + (selectedPurveyor.name.length > 20 ? '...' : '')
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
    console.log('picker: ', picker)
    const purveyorInputs = this.getPurveyorInputs()
    let separator = (
      <View />
    )
    let modal = (
      <Modal
        animated={true}
        transparent={true}
        visible={this.state.modalVisible}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalInnerContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>
                Select
              </Text>
            </View>
            {picker}
            <TouchableHighlight
              onPress={() => {
                switch (this.state.picker) {
                  case 'purveyor':
                    this.setState({
                      purveyor: this.props.purveyors[this.state.selectedPurveyor],
                      purveyorSelected: true,
                    })
                    break;
                  case 'category':
                    this.setState({
                      category: this.props.categories[this.state.selectedCategory],
                      categorySelected: true,
                    })
                    break;
                  case 'amount':
                    break;
                  case 'units':
                    break;
                  default:
                    break;
                } 

                this.setState({ 
                  modalVisible: false,
                  picker: null,
                  pickerIdx: null
                })
                this.submitReady();
              }}
              underlayColor='transparent'
            >
              <Text style={styles.modalButtonText}>
                {`Update`}
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    )
    if(this.state.picker !== null){
      separator = (
        <View style={styles.separator} />
      )
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
                if(this.refs.name){
                  this.refs.name.blur()
                }
                this.setState({
                  modalVisible: true,
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
                if(this.refs.name){
                  this.refs.name.blur()
                }
                this.setState({
                  modalVisible: true,
                  picker: 'amount'
                })
              }}
              style={styles.inputFieldContainer}
            >
              <Text style={styles.inputField}>
                { this.state.amountSelected ? this.state.amount : 'Select Amount' }
              </Text>
            </TouchableHighlight>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Units</Text>
            <TouchableHighlight
              underlayColor='transparent'
              onPress={() => {
                if(this.refs.name){
                  this.refs.name.blur()
                }
                this.setState({
                  modalVisible: true,
                  picker: 'units'
                })
              }}
              style={styles.inputFieldContainer}
            >
              <Text style={styles.inputField}>
                { this.state.unitSelected ? this.state.unit : 'Select Units' }
              </Text>
            </TouchableHighlight>
          </View>
          {separator}
        </ScrollView>
        {modal}
      </View>
    );
  }
};

const window = Dimensions.get('window');

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
    // // v- this with looks good on iPhone 6 plus and 4s
    // width: window.width * .54,
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
  separator: {
    height: 0,
    borderBottomColor: Colors.separatorColor,
    borderBottomWidth: 1,
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
