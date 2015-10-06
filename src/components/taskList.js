import React from 'react-native';
import TaskListItem from './taskListItem';
import {
  greyText,
  taskCompletedBackgroundColor
} from '../utilities/colors';

let {
  View,
  PropTypes,
  StyleSheet,
  Text,
  TouchableHighlight,
} = React;

export default class TaskList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showCompleted: false
    }
  }
  handlePress() {
    this.setState({showCompleted: !this.state.showCompleted})
  }
  render() {
    let tasks = this.props.tasks
    let tasksCompleted = _.filter(tasks, { completed: true, deleted: false })
      .map((task, index) => {
           return <TaskListItem
            task={task}
            key={index}
            name={task.name}
            completed={task.completed}
            taskId={task.id}
            navigator={this.props.navigator}
            onPress={() => this.props.onTaskClick(task.id)}
            onChangeQuantity={this.props.updateTaskQuantity} />
        })
    let tasksIncomplete = _.filter(tasks, { completed: false, deleted: false })
      .map((task, index) => {
          return <TaskListItem
            task={task}
            key={index}
            name={task.name}
            quantity={task.quantity}
            completed={task.completed}
            taskId={task.id}
            navigator={this.props.navigator}
            onPress={() => this.props.onTaskClick(task.id)}
            onChangeQuantity={this.props.updateTaskQuantity} />
        })
    return (
      <View>
        {tasksIncomplete}
        <TouchableHighlight   
          onPress={this.handlePress.bind(this)}    
        >    
          <View style={styles.container}>
            <View style={styles.roundedCorners}>
              <Text style={styles.text}>{tasksCompleted.length} Completed Items</Text>
            </View>
          </View>
        </TouchableHighlight>
        {this.state.showCompleted ? tasksCompleted : <View />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 5,
  },
  roundedCorners: {
    backgroundColor: taskCompletedBackgroundColor,
    width: 150,
    borderRadius: 10,
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    backgroundColor: taskCompletedBackgroundColor,
    fontWeight: 'bold',
    color: greyText,
    paddingTop: 5,
    paddingBottom: 3,
    width: 140,
  },
})

TaskList.propTypes = {
  // onTaskClick: PropTypes.func.isRequired,
  // tasks: PropTypes.arrayOf(PropTypes.shape({
    // text: PropTypes.string.isRequired,
    // completed: PropTypes.bool.isRequired
  // }).isRequired).isRequired
};
