import React from 'react-native'
import CheckBox from 'react-native-checkbox'
import {
  greyText,
  taskCompletedBackgroundColor
} from '../resources/colors';

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
      <View style={styles.container}>
        <View style={[
          styles.row,
          this.props.completed && styles.rowCompleted
        ]}>
          <View style={styles.checkboxContainer}>
            <CheckBox
              label=''
              onChange={this.props.onPress}
              checked={!this.props.completed}
            />
          </View>
          <TouchableHighlight
            onPress={() => this.props.navigator.push({
              name: 'TaskView',
              taskId: this.props.taskId
            })}
            style={styles.main}
            >
            <Text style={[
              styles.text,
              this.props.completed && styles.textCompleted
            ]}>
              {this.props.name}
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 5,
    paddingLeft: 5,
  },
  row: {
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: taskCompletedBackgroundColor,
    padding: 5,
    alignItems: 'center',
  },
  rowCompleted: {
    backgroundColor: 'white',
  },
  checkboxContainer: {
    flex: 1,
    alignItems: 'center',
  },
  main: {
    flex: 4,
  },
  text: {
    fontWeight: 'bold',
    color: greyText,
  },
  textCompleted: {
    color: 'black',
  },
});

TaskListItem.propTypes = {
  // onPress: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired
};
