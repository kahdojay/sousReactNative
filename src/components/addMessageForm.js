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
      disabled: false,
      message: {
        text: '',
        type: 'chat',
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(this.state.disabled === nextProps.disabled)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      disabled: nextProps.disabled
    })
  }

  render() {

    let input = (
      <TextInput
        style={styles.input}
        value={this.state.message.text}
        placeholderTextColor={'#aaa'}
        placeholder={this.props.placeholder}
        onChangeText={this.handleChangeMessage.bind(this)}
        onSubmitEditing={this.handleSubmit.bind(this)}
      />
    )
    let submit = (
      <TouchableHighlight
        key='send'
        onPress={this.handleSubmit.bind(this)}
        underlayColor={"#eee"}
        style={styles.button}
      >
        <Text style={styles.sendText}>Send</Text>
      </TouchableHighlight>
    )

    let form = (
      <View style={styles.container}>
        <View key='input' style={styles.inputContainer}>
          {input}
        </View>
        {submit}
      </View>
    )

    if(this.state.disabled === true){
      form = (
        <View style={styles.container}>
          <View style={styles.offlineContainer}>
            <Text style={styles.offlineText}>Disabled, connection offline.</Text>
          </View>
        </View>
      )
    }

    return form;
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
    borderColor: '#ddd',
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
  },
  offlineContainer: {
    padding: 15
  },
  offlineText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center'
  }
})

AddForm.propTypes = {
  placeholder: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
};
