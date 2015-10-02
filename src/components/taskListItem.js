import React from 'react-native';

let {
  TouchableHighlight,
  PropTypes,
  Text,
  StyleSheet,
  View,
} = React;

export default class TaskListItem extends React.Component {
  increment() {
    let newTask = this.props.task
    newTask.quantity += 1
    this.props.updateTaskQuantity(newTask)
  }
  decrement() {
    let newTask = this.props.task
    if (newTask.quantity >= 1)
      newTask.quantity -= 1
    this.props.updateTaskQuantity(newTask)
  }
  render() {
    let task = this.props.task
    // let quantity = this.props.quantity > 1 ? this.props.quantity : ''
    return (
      <View style={[styles.task,
              task.completed && styles.completed
            ]}>
        <TouchableHighlight
          style={styles.checkBox}
          onPress={this.props.onPress}
          >
          <Text>{'<checkbox>'}</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.taskName}
          onPress={() => this.props.navigator.push({
            name: 'TaskView',
            taskId: task.id
          })}
          >
          <Text>{task.name}</Text>
        </TouchableHighlight>
        <Text>{task.quantity}</Text>
        <TouchableHighlight
          style={styles.quantityButton}
          onPress={() => this.decrement()}
          >
          <Text>-</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.quantityButton}
          onPress={() => this.increment()}
          >
          <Text>+</Text>
        </TouchableHighlight>

      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  checkBox: {
    flex: 1,
  },
  task: {
    flexDirection: 'row',
    backgroundColor: 'lightblue'
  },
  completed: {
    backgroundColor: 'green'
  },
  taskName: {
    flex: 1,
    backgroundColor: 'green'
  },
  quantityButtons: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'blue',
    justifyContent: 'space-around'
  },
  quantityButton: {
    flex: 1,

  }
});

TaskListItem.propTypes = {
  // onPress: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired
};
