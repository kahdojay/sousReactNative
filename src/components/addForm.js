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
      text: ''
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight
          onPress={this.handleSubmit.bind(this)}
          underlayColor={"#eee"}
          style={styles.button}>
          <View style={styles.shareContainer}>
            <Icon name='fontawesome|share-square-o' size={30} color='#0075FD' style={styles.share}/>
            <Text style={styles.shareText}>Share</Text>
          </View>
        </TouchableHighlight>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={this.state.text}
            placeholder={this.props.placeholder}
            onChangeText={this.handleChangeText.bind(this)}
            onSubmitEditing={this.handleSubmit.bind(this)}
            />
        </View>
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
    height: 60,
    flexDirection: 'row'
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
  },
  shareContainer: {
    height: 50
  },
  share: {
    height: 50,
    width: 50,
    color: 'black',
    marginTop: -10,
    marginLeft: 4,
    backgroundColor: 'transparent'
  },
  shareText: {
    fontSize: 15,
    marginTop: -10,
    fontFamily: 'OpenSans',
    textAlign: 'center',
    color: '#0075FD',
    fontWeight: 'bold'
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
