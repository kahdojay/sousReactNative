import React from 'react-native';

let {
  View,
  Text,
  TextInput,
  PropTypes,
  TouchableHighlight,
  StyleSheet,
} = React;

export default class AddTask extends React.Component {
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
          placeholder='Add a task...'
          onChangeText={(text) => {this.setState({text})}}
          />
        <TouchableHighlight
          style={styles.button}
          onPress={() => this.handleClick()}>
          <Text>Add</Text>
        </TouchableHighlight>
      </View>
    );
  }

  handleClick() {
    if (this.state.text !== '') {
      this.props.onAddClick(this.state.text);
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
  button: {
    flex: 1,
    padding: 8,
    justifyContent: 'center'
  }
})

AddTask.propTypes = {
  onAddClick: PropTypes.func.isRequired
};
