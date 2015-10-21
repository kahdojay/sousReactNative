const React = require('react-native');
let MultiPickerIOS = require('react-native-multipicker');
let { Group, Item } = MultiPickerIOS;
import _ from 'lodash';
const {
  StyleSheet,
  View,
  Text,
  TextInput,
  PickerIOS,
  TouchableHighlight,
  ScrollView,
} = React;

class ProductCreate extends React.Component {
  render() {
    let purveyors = _.pluck(this.props.purveyors.data, 'name');
    let currentTeamId = this.props.appState.session.teamId;
    let teams = this.props.appState.teams.data;
    let categories = _.pluck(_.find(teams, (team) => {return team.id == currentTeamId}).categories, 'name');
    console.log('CURRENT TEAM', categories);
    let units = ['bag', 'bunch', 'cs', 'dozen', 'ea', 'g', 'kg', 'lb', 'oz', 'pack', 'tub']
    console.log('PROPS', this.props);
    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Name</Text>
          <TextInput style={styles.inputField} placeholder='Name'/>
        </View>
        <View style={styles.emptySpace}></View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Purveyor</Text>
          <TextInput style={styles.inputField} placeholder='Purveyor'/>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Category</Text>
          <TextInput style={styles.inputField} placeholder='Category'/>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Unit</Text>
          <TextInput style={styles.inputField} placeholder='Unit'/>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Amount</Text>
          <TextInput style={styles.inputField} placeholder='Amount'/>
        </View>
        <MultiPickerIOS style={styles.picker} onChange={this._someOnChange}>
          <Group selectedValue={'How'} >
              {categories.map((category, idx) => {
                return <Item value={category} key={idx} label={category} />;
              })}
          </Group>
          <Group selectedValue='Uno'>
              { purveyors.map((purveyor, idx) => {
                return <Item value={purveyor} key={idx} label={purveyor} />
              })}
          </Group>

        </MultiPickerIOS>
        <MultiPickerIOS style={styles.picker}>
          <Group selectedValue={1} >
            { _.range(1, 500).map((num) => {
              return <Item value={num} key={num} label={num.toString()} />
            })}
          </Group>
          <Group selectedValue='Uno'>
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
  inputField: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    color: '#777',
    borderColor: '#f2f2f2',
    borderRadius: 8,
    padding: 8,
    margin: 2,
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
