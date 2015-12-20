import { Icon, } from 'react-native-icons';
import React from 'react-native';

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
        </View>
        <TouchableHighlight
          onPress={this.handleSubmit.bind(this)}
          underlayColor={"#eee"}
          style={styles.button}>
          <View style={styles.shareContainer}>
            <Icon name='fontawesome|plus-circle' size={30} color='#0075FD' style={styles.share}/>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  handleChangeText(text) {
    this.setState({text: text})
  }

  handleSubmit() {
    if (this.state.text !== '') {
      this.props.onSubmit(this.state.text);
      this.setState({text: ''})
    }
  }
}

let styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    backgroundColor: "#f2f2f2"
  },
  inputContainer: {
    flex: 10,
    flexDirection: 'column',
    backgroundColor: '#f2f2f2',
    padding: 8
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
  shareContainer: {
    height: 40,
    backgroundColor: "#f2f2f2"
  },
  share: {
    height: 50,
    width: 50,
    color: 'black',
    marginTop: -10,
    backgroundColor: 'transparent'
  },
  shareText: {
    marginTop: -10,
    fontFamily: 'OpenSans',
    textAlign: 'center',
    color: '#0075FD',
    fontWeight: 'bold'
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
