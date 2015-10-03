import React from 'react-native';
import TaskListItem from './taskListItem';

let {
  View,
  PropTypes,
  Text,
  TouchableHighlight
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
    const tasks = this.props.tasks
    let taskKeys = Object.keys(tasks);
    let completeKeys = []
    let incompleteKeys = [];
    taskKeys.forEach(function(taskKey){
      if (tasks[taskKey].completed) {
        completeKeys.push(tasks[taskKey])
      } else {
        incompleteKeys.push(tasks[taskKey])
      }
    })

    let completeTasks = completeKeys.map((task) => {
          return <TaskListItem
            task={task}
            updateTaskQuantity={this.props.updateTaskQuantity}
            navigator={this.props.navigator}
            onPress={() => this.props.onTaskClick(task.id)} />
        })
    let incompleteTasks = incompleteKeys.map((task) => {
          return <TaskListItem
            task={task}
            updateTaskQuantity={this.props.updateTaskQuantity}
            name={task.name}
            quantity={task.quantity}
            completed={task.completed}
            taskId={task.id}
            navigator={this.props.navigator}
            onPress={() => this.props.onTaskClick(task.id)} />
        })
    return (
      <View>
        {incompleteTasks}
        <TouchableHighlight
          onPress={this.handlePress.bind(this)}
        >
          <Text>{completeTasks.count} Show Completed</Text>
        </TouchableHighlight>
        {this.state.showCompleted ? completeTasks : <View/>}
      </View>
    );
  }
}

TaskList.propTypes = {
  // onTaskClick: PropTypes.func.isRequired,
  // tasks: PropTypes.arrayOf(PropTypes.shape({
    // text: PropTypes.string.isRequired,
    // completed: PropTypes.bool.isRequired
  // }).isRequired).isRequired
};
