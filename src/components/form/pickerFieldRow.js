import React from 'react-native';
import Colors from '../../utilities/colors';

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

class PickerFieldRow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let selectFieldText = `(Select)`
    let selectStyle = {}
    if(this.props.selectFieldText){
      selectFieldText = this.props.selectFieldText
    }
    if(this.props.selectedValue !== null){
      selectFieldText = this.props.selectedValue.toString()
      if(selectFieldText.length > 20){
        selectFieldText = selectFieldText.substr(0,20) + '...'
      }
    }
    if(selectFieldText === '(Select)')
      selectStyle = {color: Colors.lightBlue}

    return (
      <View style={styles.inputContainer}>
        <TouchableHighlight
          underlayColor='transparent'
          onPress={() => { this.props.onShowFieldPicker() }}
          style={styles.inputSelectContainer}
        >
          <Text style={[styles.selectField, selectStyle]}>
            {selectFieldText}
          </Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: 'white',
    flex: 3.5,
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
});

module.exports = PickerFieldRow;