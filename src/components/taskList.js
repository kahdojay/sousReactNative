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
      showCompleted: true
    }
  }
  handlePress() {
    this.setState({showCompleted: !this.state.showCompleted})
  }
  onTaskCompletionNotification(task){
    var options = {
      task: task,
      timestamp: new Date(),
      teamKey: this.props.station.teamKey
    }
    this.props.onTaskCompletionNotification(options);
  }
  render() {
    let {station} = this.props
    let tasksCompleted = _.filter(station.tasks, { completed: true, deleted: false })
      .map((task, idx) => {
           return <TaskListItem
            task={task}
            key={idx}
            stationId={station.id}
            onTaskCompletionNotification={this.onTaskCompletionNotification.bind(this)}
            navigator={this.props.navigator}
            onUpdateTask={(taskAttributes) => {
              console.log("ATTRIBUTES", taskAttributes);
              this.props.onUpdateStationTask(station.id, task.recipeId, taskAttributes);
            }} />
        })
    let tasksIncomplete = _.filter(station.tasks, { completed: false, deleted: false })
      .map((task, idx) => {
          return <TaskListItem
            task={task}
            key={idx}
            stationId={station.id}
            onTaskCompletionNotification={this.onTaskCompletionNotification.bind(this)}
            navigator={this.props.navigator}
            onUpdateTask={(taskAttributes) => {
              this.props.onUpdateStationTask(station.id, task.recipeId, taskAttributes);
            }} />
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
  // onUpdateStationTask: PropTypes.func.isRequired,
  // station: PropTypes.arrayOf(PropTypes.shape({
    // tasks: PropTypes.array.isRequired,
  // }).isRequired).isRequired
};
