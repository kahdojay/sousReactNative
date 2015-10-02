import React from 'react-native';
import TaskListItem from './taskListItem';

let {
  View,
  PropTypes,
} = React;

export default class TaskList extends React.Component {
  render() {
    let taskKeys = Object.keys(this.props.tasks);
    return (
      <View>
        {taskKeys.map((taskKey, index) => {
          let task = this.props.tasks[taskKey]
          return <TaskListItem 
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
