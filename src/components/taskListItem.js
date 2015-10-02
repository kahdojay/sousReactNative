import React from 'react-native';

let {
  TouchableHighlight,
  PropTypes,
  Text,
  StyleSheet,
  View,
} = React;

export default class TaskListItem extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight
          onPress={this.props.onPress}
          >
          <Text
            style={[styles.task,
              this.props.completed && styles.completed
            ]}>{'<checkbox>'}</Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => this.props.navigator.push({
            name: 'TaskView',
            taskId: this.props.taskId
          })}
          >
          <Text>{this.props.name}</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  task: {
    flex: 1,
    backgroundColor: 'red'
  },
  completed: {
    backgroundColor: 'green'
  }
});

TaskListItem.propTypes = {
  // onPress: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired
};
