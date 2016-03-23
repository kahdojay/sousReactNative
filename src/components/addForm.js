import React from 'react-native';
import { Icon, } from 'react-native-icons';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import dismissKeyboard from 'dismissKeyboard'

const {
  View,
  Text,
  TextInput,
  PropTypes,
  TouchableHighlight,
  StyleSheet,
} = React;

export default class AddForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: ''
    }
  }

  handleChangeText(text) {
    this.setState({text: text})
  }

  handleSubmit() {
    if(this.props.connected === true && this.state.text !== '') {
      this.props.onSubmit(this.state.text);
      this.setState({text: ''})
      dismissKeyboard()
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={this.state.text}
            placeholder={this.props.placeholder}
            onChangeText={this.handleChangeText.bind(this)}
            onSubmitEditing={this.handleSubmit.bind(this)}
          />
          <TouchableHighlight
            onPress={this.handleSubmit.bind(this)}
            underlayColor='transparent'
            style={styles.button}>
            <View style={styles.addContainer}>
              <Icon name='material|plus-circle' size={30} color={this.props.connected === true ? Colors.lightBlue : Colors.disabled} style={styles.addIcon}/>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    backgroundColor: "#f2f2f2"
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    padding: 8
  },
  input: {
    flex: 10,
    backgroundColor: '#d6d6d6',
    paddingLeft: 20,
    color: '#777',
    fontFamily: 'OpenSans',
    borderRadius: Sizes.inputBorderRadius,
    fontWeight: 'bold'
  },
  addContainer: {
    height: 40,
    backgroundColor: "#f2f2f2"
  },
  addIcon: {
    height: 50,
    width: 50,
    color: 'black',
    marginTop: -5,
    backgroundColor: 'transparent'
  },
  button: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontFamily: 'OpenSans'
  }
})

AddForm.propTypes = {
  placeholder: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
};
