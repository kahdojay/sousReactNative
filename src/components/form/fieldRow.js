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

class FieldRow extends React.Component {
  constructor(props) {
    super(props);
  }
  isFocused() {
    return this.refs.field.isFocused()
  }
  blur(cb) {
    let callback = cb || function(){}
    this.refs.field.blur()
    setTimeout(callback, 50)
  }
  render() {
    let fieldRowProps = {
      ref: 'field',
      style: styles.inputField,
      value: this.props.value,
      keyboardType: this.props.keyboardType || 'default',
      placeholder: this.props.placeholder,
      inputPlaceholderColor: Colors.inputPlaceholderColor,
      onChange: this.props.onChange,
    }
    if(this.props.hasOwnProperty('onFocus') === true){
      fieldRowProps.onFocus = this.props.onFocus
    }
    let textInput = React.createElement(TextInput, fieldRowProps);
    return (
      <View key={this.props.key} style={styles.inputContainer}>
        {textInput}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: 'white',
    flex: 3.5,
  },
  inputField: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    height: 45,
    marginLeft: 10,
  },
});

module.exports = FieldRow;