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
        <TouchableHighlight
          onPress={this.handleSubmit.bind(this)}
          underlayColor={"#eee"}
          style={styles.button}>
          <View style={styles.addContainer}>
            {/*<Icon name='fontawesome|share-square-o' size={30} color='#0075FD' style={styles.message}/>*/}
            <Icon name='fontawesome|plus-circle' size={45} color='#f7f7f7' style={styles.icon}/>
          </View>
        </TouchableHighlight>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={this.state.message}
            placeholder={this.props.placeholder}
            onChangeText={this.handleChangeMessage.bind(this)}
            onSubmitEditing={this.handleSubmit.bind(this)}
            />
        </View>
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
    height: 60,
    flexDirection: 'row',
    backgroundColor: "#f2f2f2"
  },
  inputContainer: {
    flex: 10,
    flexDirection: 'column',
    backgroundColor: '#f2f2f2',
    padding: 8
  },
  icon: {
    width: 50,
    height: 50,
    marginTop: -10,
    marginLeft: -8,
    backgroundColor: '#b6b6b6',
    borderRadius: 25
  },
  input: {
    flex: 1,
    backgroundColor: '#d6d6d6',
    paddingLeft: 20,
    color: '#777',
    fontFamily: 'OpenSans',
    borderRadius: 5,
    fontWeight: 'bold'
  },
  addContainer: {
    height: 50,
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 4
  },
  message: {
    height: 50,
    width: 50,
    color: 'black',
    marginTop: -10,
    marginLeft: 4,
    backgroundColor: 'transparent'
  },
  messageText: {
    fontSize: 15,
    marginTop: -10,
    fontFamily: 'OpenSans',
    textAlign: 'center',
    color: '#0075FD',
    fontWeight: 'bold',
    color: 'white'
  },
  button: {
    flex: 1.5,
    padding: 5,
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
