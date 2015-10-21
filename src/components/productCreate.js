const React = require('react-native');

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
