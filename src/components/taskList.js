import React from 'react-native';
import TaskListItem from './taskListItem';
import Divider from './divider';

let {
  View,
  PropTypes,
  Text
} = React;

export default class TaskList extends React.Component {
  render() {
    const tasks = this.props.tasks
    let taskKeys = Object.keys(tasks);
    let tasksCompleted = []
    let tasksIncomplete = [];
    taskKeys.forEach(function(taskKey){
      if (tasks[taskKey].completed) {
        tasksCompleted.push(tasks[taskKey])
      } else {
        tasksIncomplete.push(tasks[taskKey])
      }
    })
    console.log('taskList', tasksCompleted, tasksIncomplete)
    return (
      <View>
        {tasksCompleted.map((task, index) => {
          return <TaskListItem
            key={index}
            name={task.name}
            completed={task.completed}
            taskId={task.id}
            navigator={this.props.navigator}
            onPress={() => this.props.onTaskClick(task.id)} />
        })}
        <Divider />
        {tasksIncomplete.map((task, index) => {
          return <TaskListItem
            key={index}
            name={task.name}
            completed={task.completed}
            taskId={task.id}
            navigator={this.props.navigator}
            onPress={() => this.props.onTaskClick(task.id)} />
        })}
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
