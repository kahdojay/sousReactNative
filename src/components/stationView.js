var { Icon, } = require('react-native-icons');
import React from 'react-native';
import TaskList from '../components/taskList';
import { BackBtn } from '../utilities/navigation';
import { NavigationBarStyles } from '../utilities/styles';
const AddForm = require('./addForm');
import {
  mainBackgroundColor,
  navbarColor
} from '../utilities/colors';

const {
  ActionSheetIOS,
  StyleSheet,
  View,
  PropTypes,
  TouchableHighlight,
  TouchableOpacity,
  Text,
  Image
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
      if( deleteAction === buttonIndex ){
        // process the delete
        this.props.onDeleteStation(this.props.station.key);
        // pop the view
        this.props.navigator.pop();
      }
    });
  }
  render() {
    let tasks = this.props.tasks
    let station = this.props.station

    return (
      <View style={styles.container}>
        <View style={[
          NavigationBarStyles.navBarContainer,
          {backgroundColor: navbarColor}
        ]}>
          <View style={[
            NavigationBarStyles.navBar,
            {paddingVertical: 20}
          ]}>
            <BackBtn
              navigator={this.props.navigator}
              style={NavigationBarStyles.navBarText}
              />
            <Image source={require('image!Logo')} style={styles.logoImage}></Image>
            <TouchableOpacity
              onPress={this.showActionSheet.bind(this)}
              style={styles.iconMore}>
              <View
                style={[
                  NavigationBarStyles.navBarRightButton,
                  {marginVertical: 0}
                ]}>
                <Icon name='fontawesome|cog' size={45} color='white' style={styles.iconMore}/>

              </View>
            </TouchableOpacity>
          </View>
        </View>
        <AddForm
          placeholder="Add a Task..."
          onSubmit={text => {
            this.props.onAddNewTask(text, station.key)
          }}/>
        <TaskList
          navigator={this.props.navigator}
          updateTaskQuantity={this.props.updateTaskQuantity}
          tasks={tasks}
          onTaskClick={taskId =>
            this.props.onToggleTask(taskId)
          } />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mainBackgroundColor,
  },
  logoImage: {
    width: 70,
    height: 70,
    marginTop: -10
  },
  iconMore: {
    width: 60,
    height: 60,
    marginTop: -4
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
