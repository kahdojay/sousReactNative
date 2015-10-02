import React from 'react-native';

let {
  TouchableHighlight,
  PropTypes,
  Text,
  StyleSheet,
  View,
} = React;

export default class Task extends React.Component {
  render() {

    return (
      <View>
        <TouchableHighlight
          onPress={this.props.onPress}
          >
          <Text
            style={[styles.task,
              this.props.completed && styles.completed
            ]}>{this.props.description}</Text>
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
  task: {
    flex: 1,
    backgroundColor: 'red'
  },
  completed: {
    backgroundColor: 'green'
  }
});

Task.propTypes = {
  // onPress: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired
};
