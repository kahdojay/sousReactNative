import { Icon, } from 'react-native-icons';
import React from 'react-native';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';

let {
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
      message: {
        text: '',
        type: 'chat',
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={this.state.message.text}
            placeholder={this.props.placeholder}
            onChangeText={this.handleChangeMessage.bind(this)}
            onSubmitEditing={this.handleSubmit.bind(this)}
          />
        </View>
        <TouchableHighlight
          onPress={this.handleSubmit.bind(this)}
          underlayColor={"#eee"}
          style={styles.button}
        >
          <Text style={styles.sendText}>Send</Text>
        </TouchableHighlight>
      </View>
    );
  }

  handleChangeMessage(text) {
    this.setState({message: {text: text}})
  }

  handleSubmit() {
    if (this.state.message.text !== '') {
      this.props.onSubmit(this.state.message);
      this.setState({message: {text: ''}})
    }
  }
}

let styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.mainBackgroundColor,
  },
  inputContainer: {
    flex: 5,
    flexDirection: 'row',
    backgroundColor: Colors.mainBackgroundColor,
    padding: 8
  },
  sendText: {
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
    color: '#555',
    alignSelf: 'center',
  },
  icon: {
    width: 30,
    height: 30,
    paddingLeft: 30,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    color: 'black',
    fontFamily: 'OpenSans',
    borderRadius: Sizes.inputBorderRadius,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  button: {
    flex: 1,
    justifyContent: 'center',
  },
  messageText: {
    marginLeft: 5,
    fontSize: 15,
    fontFamily: 'OpenSans',
    textAlign: 'center',
    color: '#0075FD',
    fontWeight: 'bold',
    color: 'white'
  },
  buttonText: {
    fontFamily: 'OpenSans'
  }
})

AddForm.propTypes = {
  placeholder: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
};
