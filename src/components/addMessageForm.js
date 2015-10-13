import { Icon, } from 'react-native-icons';
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
          <Icon name="fontawesome|plus-circle" size={30} color={'#777'} style={styles.icon}/>
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
    backgroundColor: 'white',
    color: 'black',
    fontFamily: 'OpenSans',
    borderRadius: 5,
    fontWeight: 'bold',
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  button: {
    flex: 1,
    justifyContent: 'center'
  },
  sendButtonText: {
    flex: 1,
    marginTop: 10,
    alignItems: 'center',
    alignSelf: 'center'
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
