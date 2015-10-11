var { Icon, } = require('react-native-icons');
import React from 'react-native';

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
      message: ''
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={this.state.message}
            placeholder={this.props.placeholder}
            onChangeText={this.handleChangeMessage.bind(this)}
            onSubmitEditing={this.handleSubmit.bind(this)}
            />
        </View>
        <TouchableHighlight
          onPress={this.handleSubmit.bind(this)}
          underlayColor={"#eee"}
          style={styles.button}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableHighlight>
      </View>
    );
  }

  handleChangeMessage(text) {
    this.setState({message: text})
  }

  handleSubmit() {
    if (this.state.message !== '') {
      this.props.onSubmit(this.state.message);
      this.setState({message: ''})
    }
  }
}

let styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: "#f2f2f2",
    // alignItems: 'center',
  },
  inputContainer: {
    flex: 5,
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    padding: 8
  },
  icon: {
    width: 30,
    height: 30,
    paddingLeft: 30,
  },
  input: {
    flex: 1,
    backgroundColor: '#d6d6d6',
    color: '#777',
    fontFamily: 'OpenSans',
    borderRadius: 5,
    fontWeight: 'bold'
  },
  button: {
    flex: 1,
    // padding: 15,
    justifyContent: 'center'
  },
  sendButtonText: {
    flex: 1,
    marginTop: 10,
    alignItems: 'center',
    alignSelf: 'center'
  },
  // message: {
  //   height: 50,
  //   width: 50,
  //   color: 'black',
  //   // marginTop: -10,
  //   marginLeft: 4,
  //   backgroundColor: 'transparent'
  // },
  messageText: {
    marginLeft: 5,
    fontSize: 15,
    // marginTop: -10,
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
