import React from 'react-native';
import AddTask from '../components/addTask';
import TaskList from '../components/taskList';
import { BackBtn } from '../utilities/navigation';
import { NavigationBarStyles } from '../utilities/styles';
const AddForm = require('./addForm');

const {
  ActionSheetIOS,
  StyleSheet,
  View,
  PropTypes,
  TouchableHighlight,
  TouchableOpacity,
  Text,
} = React;

class StationView extends React.Component {
  constructor(props) {
    super(props)
  }
  showActionSheet(){
    let buttons = [
      'Delete Station',
      'Rename Station',
      'Cancel'
    ]
    let deleteAction = 0;
    let cancelAction = 2;
    ActionSheetIOS.showActionSheetWithOptions({
      options: buttons,
      cancelButtonIndex: cancelAction,
      destructiveButtonIndex: deleteAction,
    },
    (buttonIndex) => {
      // console.log('clicked: ',  buttons[buttonIndex]);
      if( deleteAction === buttonIndex ){
        // process the delete
        this.props.onDeleteStation(this.props.station.id);
        // pop the view
        this.props.navigator.pop();
      }
    });
  }
  render() {
    // const { stationId, dispatch, filteredTasks, taskVisibility } = this.props;
    // let tasks = filteredTasks(stationId);
    let tasks = this.props.tasks
    let station = this.props.station

    return (
      <View style={styles.container}>
        <View style={[NavigationBarStyles.navBarContainer, {backgroundColor: '#1E00B1'}]}>
          <View style={[NavigationBarStyles.navBar, {paddingVertical: 20}]}>
            <BackBtn
              navigator={this.props.navigator}
              style={NavigationBarStyles.navBarText}
              />
            <TouchableOpacity
              onPress={this.showActionSheet.bind(this)}
              style={{position: 'absolute', right: 25}}>
              <View
                style={[NavigationBarStyles.navBarRightButton, {marginVertical: 0}]}>
                <Text
                  style={[NavigationBarStyles.navBarText, { marginVertical: 10, color: 'white' }]}> ... </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <AddForm
          placeholder="Add a Task..."
          onSubmit={text =>
            this.props.onAddNewTask(text, station.id)
          }/>
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
    flex: 1
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
