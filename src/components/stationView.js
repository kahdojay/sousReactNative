import React from 'react-native';
import AddTaskForm from '../components/addTaskForm';
import TaskList from '../components/taskList';
import { BackBtn } from '../utilities/navigation';

const {
  StyleSheet,
  View,
  PropTypes,
  TouchableHighlight,
  Text,
} = React;

class StationView extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    // const { stationId, dispatch, filteredTasks, taskVisibility } = this.props;
    // let tasks = filteredTasks(stationId);
    let tasks = this.props.tasks
    let station = this.props.station

    return (
      <View style={styles.container}>
        <BackBtn
          navigator={this.props.navigator}
          />
        <AddTaskForm
          onAddClick={text =>
            this.props.addNewTask(text, station.id)
          } />
        <TaskList
          navigator={this.props.navigator}  
          tasks={tasks}
          onTaskClick={taskId =>
            this.props.toggle(taskId)
          } />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 80
  }
});

// function getTaskFilter(state, filter) {
//   return function filteredTasks(stationId){
//     let taskList = Object.keys(state.tasks);
//     let stationTasks = taskList.filter((taskKey) => {
//       if (state.tasks[taskKey].stationId === stationId)
//         return taskKey
//     })
//     stationTasks = stationTasks.map((taskKey) => {
//       return state.tasks[taskKey]
//     })
//     switch (filter) {
//     case TaskVisibility.SHOW_ALL:
//       return stationTasks;
//     case TaskVisibility.SHOW_COMPLETED:
//       return stationTasks.filter(task => task.completed);
//     case TaskVisibility.SHOW_ACTIVE:
//       return stationTasks.filter(task => !task.completed);
//     }
//   }
// }

// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
// function select(state) {
//   return {
//     filteredTasks: getTaskFilter(state, state.taskVisibility),
//     taskVisibility: state.taskVisibility
//   };
// }

StationView.propTypes = {
  // stationId: PropTypes.string.isRequired,
  // filteredTasks: PropTypes.shape({
  //   text: PropTypes.string.isRequired,
  //   completed: PropTypes.bool.isRequired
  // }),
  // filteredTasks: PropTypes.func.isRequired,
  // taskVisibility: PropTypes.oneOf([
  //   'SHOW_ALL',
  //   'SHOW_COMPLETED',
  //   'SHOW_ACTIVE'
  // ]).isRequired
};

// Wrap the component to inject dispatch and state into it
export default StationView
// export default connect(select)(StationView);
