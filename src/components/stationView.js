const React = require('react-native');
import { connect } from 'react-redux/native';
import { addTask, toggleTask, setVisibilityFilter, TaskVisibility } from '../actions';
import AddTask from '../components/addTask';
import TaskList from '../components/taskList';
import Footer from '../components/footer';
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
    // Injected by connect() call:
    const { stationId, dispatch, filteredTasks, taskVisibility } = this.props;
    let tasks = filteredTasks(stationId);
    return (
      <View style={styles.container}>
        <BackBtn
          navigator={this.props.navigator}
          />
        <AddTask
          onAddClick={text =>
            dispatch(addTask(text))
          } />
        <TaskList
          tasks={tasks}
          navigator={this.props.navigator}
          onTaskClick={index =>
            dispatch(toggleTask(index))
          } />
        <Footer
          filter={taskVisibility}
          onFilterChange={nextFilter =>
            dispatch(setVisibilityFilter(nextFilter))
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

function getTaskFilter(stations, tasks, filter) {
  return function filteredTasks(stationId){
    let taskList = stations[stationId].taskList;
    let stationTasks = taskList.map((taskKey) => tasks[taskKey])
    switch (filter) {
    case TaskVisibility.SHOW_ALL:
      return stationTasks;
    case TaskVisibility.SHOW_COMPLETED:
      return stationTasks.filter(task => task.completed);
    case TaskVisibility.SHOW_ACTIVE:
      return stationTasks.filter(task => !task.completed);
    }
  }
}

// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
function getTasks(state) {
  return {
    filteredTasks: getTaskFilter(state.stations, state.tasks, state.taskVisibility),
    taskVisibility: state.taskVisibility
  };
}

StationView.propTypes = {
  stationId: PropTypes.string.isRequired,
  filteredTasks: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  })),
  taskVisibility: PropTypes.oneOf([
    'SHOW_ALL',
    'SHOW_COMPLETED',
    'SHOW_ACTIVE'
  ]).isRequired
};

// Wrap the component to inject dispatch and state into it
export default connect(getTasks)(StationView);
