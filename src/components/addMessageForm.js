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
    if(this.state.disabled !== nextProps.disabled){
      return true;
    }
    if(this.state.message.text !== nextState.message.text){
      return true;
    }
    return false;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      disabled: nextProps.disabled
    })
  }

  render() {

    let input = (
      <TextInput
        ref='messageInput'
        style={styles.input}
        value={this.state.message.text}
        placeholderTextColor={'#aaa'}
        placeholder={this.props.placeholder}
        onChangeText={::this.handleChangeMessage}
        multiline={this.props.multiline}
        onSubmitEditing={this.props.multiline ? null : ::this.handleSubmit}
      />
    )
    let submit = (
      <TouchableHighlight
        key='send'
        onPress={::this.handleSubmit}
        underlayColor={"#eee"}
        style={styles.button}
      >
        <View style={styles.sendView}>
          <Text style={styles.buttonText}>Send</Text>
        </View>
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
    backgroundColor: '#f3f3f3',
  },
  inputContainer: {
    flex: 5,
    flexDirection: 'row',
    backgroundColor: '#f3f3f3',
    padding: 8,
    paddingRight: 0,
  },
  sendView: {
    alignSelf: 'center',
  },
  sendIcon: {
    width: 50,
    height: 50,
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
  buttonText: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    textAlign: 'center',
    color: Colors.lightBlue,
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
