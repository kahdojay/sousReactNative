import React from 'react-native';
import Colors from '../../utilities/colors';
import { Icon } from 'react-native-icons';
import _ from 'lodash';
import s from 'underscore.string';
import PickerModal from '../modal/pickerModal';
import FieldRow from './fieldRow';
import PickerFieldRow from './pickerFieldRow';

const {
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} = React;

class PurveyorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newPurveyor: {},
      fieldPicker: null,
      fieldPickerIdx: null,
      modalVisible: false,
      selectedName: this.props.purveyor ? this.props.purveyor.name : '',
      // selectedCategory: this.props.purveyorCategory ? this.props.purveyorCategory.id : null,
      // selectedPurveyors: this.props.purveyor ? this.props.purveyor.purveyors : (this.props.fromPurveyorId ? [this.props.fromPurveyorId] : null),
      // selectedAmount: this.props.purveyor ? this.props.purveyor.amount : 1,
      // selectedUnits: this.props.purveyor ? this.props.purveyor.unit : 'cs',
      // selectedDescription: this.props.purveyor ? this.props.purveyor.description : '',
      // selectedSku: this.props.purveyor ? this.props.purveyor.sku : '',
      // selectedPrice: this.props.purveyor ? this.props.purveyor.price : '',
      // selectedPar: this.props.purveyor ? this.props.purveyor.par : '',
      // selectedPackSize: this.props.purveyor ? this.props.purveyor.packSize : '',
      showAdvanced: false,
    }
    // this.fields = ['Purveyors','Category','Amount']//,'QtyUnits']
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
      // this.state.selectedPurveyors !== null &&
      // this.state.selectedPurveyors.length > 0 &&
      // this.state.selectedCategory &&
      // this.state.selectedAmount &&
      // this.state.selectedUnits &&
      selectedName !== ''
    ) {
      const purveyorAttributes = {
        name: selectedName,
        // purveyors: this.state.selectedPurveyors,
        // amount: this.state.selectedAmount,
        // unit: this.state.selectedUnits,
        // categoryId: this.state.selectedCategory,
        // description: this.state.selectedDescription,
        // sku: this.state.selectedSku,
        // price: this.state.selectedPrice,
        // par: this.state.selectedPar,
        // packSize: this.state.selectedPackSize,
      }
      this.props.onProcessPurveyor(purveyorAttributes);
    } else {
      this.props.onPurveyorNotReady();
    }
  }

  selectedCategoryValue() {
    let selectedValue = '(Select)'
    let categoryId = this.state.selectedCategory
    if(categoryId !== null) {
      selectedValue = this.props.categories[categoryId].name
    }
    return selectedValue
  }

  selectedPurveyorValue() {
    let selectedValue = '(Select)'
    if (this.state.selectedPurveyors !== null){
      const purveyorIds = this.state.selectedPurveyors
      selectedValue = purveyorIds && purveyorIds.length === 1 ? this.props.purveyors[purveyorIds[0]].name : `${purveyorIds.length.toString()} Purveyors Selected`
    }
    return selectedValue
  }

  // Scroll a component into view. Just pass the component ref string.
  inputFocused(refName) {
    // console.log(this.refs)
    setTimeout(() => {
      let scrollResponder = this.refs.scrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        React.findNodeHandle(this.refs[refName]),
        100, //additionalOffset
        true
      );
    }, 20);
  }

  getPickerOptions() {
    console.log('getPickerOptions')
    // if(this.state.fieldPicker !== null){
    //   let items = []
    //   let selectedValue = null
    //   let pickerType = null
    //   // get the items by switching by fieldPicker
    //   switch (this.state.fieldPicker) {
    //     case 'Purveyors':
    //       const purveyors = _.sortBy(this.props.purveyors, 'name')
    //       items = _.map(purveyors, (purveyor, idx) => {
    //         return {
    //           key: purveyor.id,
    //           value: purveyor.id,
    //           label: purveyor.name,
    //         }
    //       })
    //       selectedValue = this.state.selectedPurveyors
    //       pickerType = 'ListView'
    //       break;

    //     case 'Category':
    //       const categories = _.sortBy(this.props.categories, 'name')
    //       items = _.map(categories, (category, idx) => {
    //         return {
    //           key: category.id,
    //           value: category.id,
    //           label: category.name,
    //         }
    //       })
    //       items.unshift({
    //         key: '--null--',
    //         value: null,
    //         label: '',
    //       })
    //       selectedValue = this.state.selectedCategory ? this.state.selectedCategory : null
    //       break;

    //     case 'Amount':
    //       items = _.map(['1/8','1/4','1/2', '3/4'], (frac, idx) => {
    //         const dec = frac.split('/')
    //         return {
    //           key: `d-${idx}`,
    //           value: parseFloat(dec[0]/dec[1]),
    //           label: frac,
    //         }
    //       })
    //       items = items.concat(_.map(_.range(1, 1001), (n, idx) => {
    //         return {
    //           key: idx,
    //           value: n,
    //           label: n.toString(),
    //         }
    //       }))
    //       items.unshift({
    //         key: '--null--',
    //         value: null,
    //         label: '',
    //       })
    //       selectedValue = this.state.selectedAmount ? parseFloat(this.state.selectedAmount) : null
    //       break;

    //     // case 'Units':
    //     //   const units = ['bag', 'btl', 'bunch', 'can', 'cs', 'ct', 'dozen', 'ea', 'g', 'jug', 'kg', 'lb', 'oz', 'pack', 'pc', 'tub']
    //     //   items = _.map(units, (unit, idx) => {
    //     //     return {
    //     //       key: idx,
    //     //       value: unit,
    //     //       label: unit,
    //     //     }
    //     //   })
    //     //   items.unshift({
    //     //     key: '--null--',
    //     //     value: null,
    //     //     label: '',
    //     //   })
    //     //   selectedValue = this.state.selectedUnits ? this.state.selectedUnits : null
    //     //   break;

    //     default:
    //       break;
    //   }
    //   return {
    //     items: items,
    //     selectedValue: selectedValue,
    //     pickerType: pickerType
    //   }
    // } else {
    //   return {
    //     items: null,
    //     selectedValue: null,
    //     pickerType: null
    //   }
    // }
  }

  render() {
    let fields = []
    let items = []
    let leftButtonText = 'Update'
    let selectedValue = null
    let pickerType = 'PickerIOS'
    // let pickerOptions = this.getPickerOptions()
    // let selectedPrice = this.state.selectedPrice
    // let selectedPurveyors = this.state.selectedPurveyors
    // let selectedPurveyorsText, selectedCategoryText = '(Select)'
    // if (selectedPurveyors && selectedPurveyors !== null){
    //   const purveyorIds = this.state.selectedPurveyors
    //   selectedPurveyorsText = purveyorIds && purveyorIds.length === 1 ? this.props.purveyors[purveyorIds[0]].name : `${purveyorIds.length.toString()} Purveyors Selected`
    // }
    return (
      <View style={styles.container}>
        <ScrollView
          ref='scrollView'
          automaticallyAdjustContentInsets={false}
          style={styles.scrollView}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Purveyor Details</Text>
          </View>
          <View style={styles.fieldRowContainer}>
            <View style={styles.formLabelContainer}>
              <Text style={styles.formLabelText}>Name</Text>
            </View>
            <FieldRow
              key='name'
              ref='name'
              label='Name'
              placeholder='Happy Valley Meats'
              value={this.state.selectedName}
              onChange={(e) => {
                this.setState({
                  selectedName: e.nativeEvent.text.replace(' ','\u00A0'),
                }, () => {
                  this.checkValidForm();
                });
              }}
              onFocus={this.inputFocused.bind(this, 'name')}
            />
          </View>
          {/*<View style={styles.separator}></View>
          <View style={styles.fieldRowContainer}>
            <View style={styles.formLabelContainer}>
              <Text style={styles.formLabelText}>Purveyors</Text>
            </View>
            <PickerFieldRow
              key='Purveyors'
              field='Purveyors'
              selectFieldText={selectedPurveyorsText}
              selectedValue={this.selectedPurveyorValue()}
              onShowFieldPicker={() => {
                this.showFieldPicker('Purveyors', null)
              }}
            />
          </View>
          <View style={styles.separator}></View>
          <View style={styles.fieldRowContainer}>
            <View style={styles.formLabelContainer}>
              <Text style={styles.formLabelText}>Category</Text>
            </View>
            <PickerFieldRow
              key='Category'
              field='Category'
              selectFieldText={selectedCategoryText}
              selectedValue={this.selectedCategoryValue()}
              onShowFieldPicker={() => {
                this.showFieldPicker('Category', null)
              }}
            />
          </View>
          <View style={styles.separator}></View>
          <View style={styles.fieldRowContainer}>
            <View style={styles.formLabelContainer}>
              <Text style={styles.formLabelText}>Base Qty</Text>
            </View>
            <PickerFieldRow
              key='Amount'
              field='Amount'
              selectFieldText={'(Select)'}
              selectedValue={this.state.selectedAmount}
              onShowFieldPicker={() => {
                this.showFieldPicker('Amount', null)
              }}
            />
          </View>
          <View style={styles.separator}></View>
          <View style={styles.fieldRowContainer}>
            <View style={styles.formLabelContainer}>
              <Text style={styles.formLabelText}>Base Unit</Text>
            </View>
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
              onFocus={this.inputFocused.bind(this, 'unit')}
            />
          </View>*/}

          {/*<Text>{' '}</Text>
          <TouchableHighlight
            underlayColor='transparent'
            onPress={() => {
              this.setState({showAdvanced: !this.state.showAdvanced})
              LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
            }}
          >
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Additional Info </Text>
              <Icon name='material|caret-down' size={20} color={'white'} style={styles.iconDropDown}/>
            </View>
          </TouchableHighlight>
          {this.state.showAdvanced ? (
              <View>
                <View style={styles.fieldRowContainer}>
                  <View style={styles.formLabelContainer}>
                    <Text style={styles.formLabelText}>Note</Text>
                  </View>
                  <FieldRow
                    key='notes'
                    ref='notes'
                    label='Notes'
                    placeholder='ex. "Please no substitutions"'
                    value={this.state.selectedDescription}
                    onChange={(e) => {
                      this.setState({
                        selectedDescription: e.nativeEvent.text,
                      }, () => {
                        this.checkValidForm();
                      });
                    }}
                    onFocus={this.inputFocused.bind(this, 'notes')}
                  />
                </View>
                <View style={styles.separator}></View>
                <View style={styles.fieldRowContainer}>
                  <View style={styles.formLabelContainer}>
                    <Text style={styles.formLabelText}>SKU</Text>
                  </View>
                  <FieldRow
                    key='sku'
                    ref='sku'
                    label='SKU'
                    value={this.state.selectedSku}
                    onChange={(e) => {
                      this.setState({
                        selectedSku: e.nativeEvent.text,
                      }, () => {
                        ('sku ', this.state.selectedSku)
                        this.checkValidForm();
                      });
                    }}
                    onFocus={this.inputFocused.bind(this, 'sku')}
                  />
                </View>
                <View style={styles.separator}></View>
                <View style={styles.fieldRowContainer}>
                  <View style={styles.formLabelContainer}>
                    <Text style={styles.formLabelText}>Price</Text>
                  </View>
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
                    onFocus={this.inputFocused.bind(this, 'price')}
                  />
                </View>
                <View style={styles.separator}></View>
                <View style={styles.fieldRowContainer}>
                  <View style={styles.formLabelContainer}>
                    <Text style={styles.formLabelText}>Par</Text>
                  </View>
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
                    onFocus={this.inputFocused.bind(this, 'par')}
                  />
                </View>
                <View style={styles.separator}></View>
                <View style={styles.fieldRowContainer}>
                  <View style={styles.formLabelContainer}>
                    <Text style={styles.formLabelText}>Pack Size</Text>
                  </View>
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
                    onFocus={this.inputFocused.bind(this, 'packSize')}
                  />
                </View>
              </View>
            )
            : <View/>
          }*/}
        </ScrollView>
        {/*<PickerModal
          modalVisible={this.state.modalVisible}
          headerText={`Select ${this.state.fieldPicker}`}
          leftButtonText={leftButtonText}
          items={pickerOptions.items}
          pickerType={pickerOptions.pickerType}
          selectedValue={pickerOptions.selectedValue}
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
        />*/}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lighterGrey,
  },
  scrollView: {
    flex: 1,
    padding: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    borderColor: Colors.lightGrey,
    backgroundColor: Colors.lightBlue,
    alignItems: 'center',
    borderRadius: 2,
    padding: 10,
    marginBottom: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
  },
  iconDropDown: {
    width: 10,
    height: 10,
  },
  fieldRowContainer: {
    flexDirection: 'row',
  },
  formLabelContainer: {
    flex: 1,
    justifyContent: 'center',
    height: 45,
    marginRight: 10,
  },
  formLabelText: {
    fontWeight: 'bold',
  },
  separator: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: Colors.separatorColor,
  },
});

module.exports = PurveyorForm;