import React from 'react-native';

let {
  TouchableHighlight,
  PropTypes,
  Text,
  StyleSheet,
  View,
} = React;

export default class Todo extends React.Component {
  render() {

    return (
      <View>
        <TouchableHighlight
          onPress={this.props.onPress}
          >
          <Text
            style={[styles.todo, 
              this.props.completed && styles.completed
            ]}>{this.props.text}</Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => this.props.navigator.push({
            name: 'TaskView'
          })}
          >
          <Text>ShowTask</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  todo: {
    flex: 1,
    backgroundColor: 'red' 
  },
  completed: {
    backgroundColor: 'green' 
  }
});

Todo.propTypes = {
  // onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  completed: PropTypes.bool.isRequired
};