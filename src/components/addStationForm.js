import React from 'react-native';

let {
  View,
  Text,
  TextInput,
  PropTypes,
  TouchableHighlight,
  StyleSheet,
} = React;

export default class AddStationForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: ''
    }
  }

  render() {
    return (
      <View
        style={styles.container}>
        <TextInput
          style={styles.input}
          value={this.state.text}
          placeholder={'Add a Station...'}
          onChangeText={this.handleChangeText.bind(this)}
          onSubmitEditing={this.handleSubmit.bind(this)}
          />
        <TouchableHighlight
          onPress={this.handleSubmit.bind(this)}
          style={styles.buttonContainer}>
          <Text>Add</Text>
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
    height: 32,
    flexDirection: 'row'
  },
  input: {
    flex: 10,
    backgroundColor: '#cde'
  },
  buttonContainer: {
    flex: 1,
    padding: 8,
    justifyContent: 'center'
  }
})

AddStationForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
};
