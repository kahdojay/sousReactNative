const React = require('react-native');
let MultiPickerIOS = require('react-native-multipicker');
let { Group, Item } = MultiPickerIOS;
let Dimensions = require('Dimensions');
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
      purveyor: this.props.purveyors.data[0],
      category: _.find(this.props.appState.teams.data, (team) => {
        return team.id === this.props.appState.session.teamId
      }).categories[0],
      amount: 1,
      unit: 'bag',
      purveyorSelected: false,
      categorySelected: false,
      amountSelected: false,
      unitSelected: false,
      ready: false,
      loaded: false,
    }
  }
  componentWillUnmount(){
    // console.log('UPDATE', this.state)
    this.setState({
      loaded: false
    })
  }

  componentDidMount(){
    setTimeout(() => {
      this.setState({
        loaded: true
      })
    }, 500);
  }

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
        purveyorId: null, //this.state.purveyor.id,
        amount: null, //`${this.state.amount} ${this.state.unit}` ,
        categoryId: null, // this.state.category.id,
      }
      this.props.onAddProduct(productAttributes);
    } else {
      this.props.onProductNotReady();
    }
  }
  render() {
    const purveyors = this.props.purveyors.data;
    const currentTeamId = this.props.appState.session.teamId;
    const teams = this.props.appState.teams.data;
    const categories = _.find(teams, (team) => {return team.id == currentTeamId}).categories;
    const units = ['bag', 'bunch', 'cs', 'dozen', 'ea', 'g', 'kg', 'lb', 'oz', 'pack', 'tub']
    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Name</Text>
          <TextInput style={styles.inputField} placeholder='Name'onChange={(e) => {
              this.setState({name: e.nativeEvent.text}, () => {
                this.submitReady();
              });
            }}/>
        </View>
        <View style={styles.emptySpace}></View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Purveyor</Text>
          <Text style={styles.inputField}> {this.state.purveyorSelected ? this.state.purveyor.name : 'Select Purveyor'}</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Category</Text>
          <Text style={styles.inputField}>{this.state.categorySelected ? this.state.category.name : 'Select Category'}</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Amount</Text>
          <Text style={styles.inputField} >{this.state.amountSelected ? this.state.amount : 'Amount of'} {this.state.unitSelected ? this.state.unit : 'Units'}</Text>
        </View>
        <MultiPickerIOS style={styles.picker}>
          <Group style={styles.group} selectedValue={this.state.category} onChange={(e) => {
              this.setState({category: e.newValue, categorySelected: true}, () => {
                this.submitReady();
              })
            }}>
              {categories.map((category, idx) => {
                return <Item value={category} key={idx} label={category.name} />;
              })}
          </Group>
          <Group selectedValue={this.state.purveyor} onChange={(e) => {
              this.setState({purveyor: e.newValue, purveyorSelected: true}, () => {
                this.submitReady();
              })
            }}>
              { purveyors.map((purveyor, idx) => {
                return <Item value={purveyor} key={idx} label={purveyor.name} />
              })}
          </Group>
        </MultiPickerIOS>
        <MultiPickerIOS style={styles.picker}>
          <Group selectedValue={this.state.amount} onChange={(e) => {
              // console.log(e)
              this.setState({amount: e.newValue, amountSelected: true}, () => {
                this.submitReady();
              });
            }}>
            { _.range(1, 500).map((num) => {
              return <Item value={num} key={num} label={num.toString()} />
            })}
          </Group>
          <Group selectedValue={this.state.unit} onChange={(e) => {
              this.setState({unit: e.newValue, unitSelected: true}, () => {
                this.submitReady();
              })
            }}>
            { units.map((val, idx) => {
              return <Item value={val} key={idx} label={val} />
            })}
          </Group>
        </MultiPickerIOS>
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  inputContainer: {
    marginLeft: 15,
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
  inputField: {
    flex: 2,
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
