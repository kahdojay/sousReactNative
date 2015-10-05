import React from 'react-native';
import TaskListItem from './taskListItem';
import Divider from './divider';

let {
  View,
  PropTypes,
  Text,
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
    let tasksCompleted = _.filter(tasks, { completed: true });
    let tasksIncomplete = _.filter(tasks, { completed: false });
    return (
      <View>
        {tasksIncomplete.map((task, index) => {
          return <TaskListItem
            key={index}
            name={task.name}
            quantity={task.quantity}
            completed={task.completed}
            taskId={task.id}
            navigator={this.props.navigator}
            onPress={() => this.props.onTaskClick(task.id)} />
        })}
        <Divider />
        {tasksCompleted.map((task, index) => {
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
