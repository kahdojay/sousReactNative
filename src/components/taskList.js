import React from 'react-native';
import TaskListItem from './taskListItem';
import { greyText, taskCompletedBackgroundColor } from '../utilities/colors';

const {
  View,
  ScrollView,
  PropTypes,
  StyleSheet,
  Text,
  TouchableHighlight,
} = React;

class TaskList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showCompleted: true
    }
  }
  handlePress() {
    this.setState({showCompleted: !this.state.showCompleted})
  }
  render() {
    let {team} = this.props
    let tasksCompleted = _.filter(team.tasks, { completed: true, deleted: false })
      .map((task, idx) => {
        /**
         * NOTE: If you are editing this <TaskListItem...>
         *     DONT FORGET ABOUT THE ONE BELOW IT...
         */
        return (
          <TaskListItem
            task={task}
            key={idx}
            onTaskCompletionNotification={this.props.onTaskCompletionNotification}
            onNavToTask={() => {
              this.props.onNavToTask(task.recipeId)
            }}
            onUpdateTask={(taskAttributes) => {
              this.props.onUpdateTeamTask(task.recipeId, taskAttributes);
            }}
          />
        )
      })
    let tasksIncomplete = _.filter(team.tasks, { completed: false, deleted: false })
      .map((task, idx) => {
          return (
            <TaskListItem
              task={task}
              key={idx}
              onTaskCompletionNotification={this.props.onTaskCompletionNotification}
              onNavToTask={() => {
                this.props.onNavToTask(task.recipeId)
              }}
              onUpdateTask={(taskAttributes) => {
                this.props.onUpdateTeamTask(task.recipeId, taskAttributes);
              }}
            />
          )
        })
    return (
      <ScrollView
        keyboardShouldPersistTaps={false}
        contentInset={{bottom:49}}
        automaticallyAdjustContentInsets={false}
        >
        {tasksIncomplete}
        <TouchableHighlight
          underlayColor='transparent'
          onPress={this.handlePress.bind(this)}
        >
          <View style={styles.container}>
            <View style={styles.roundedCorners}>
              <Text style={styles.text}>{tasksCompleted.length} Completed</Text>
            </View>
          </View>
        </TouchableHighlight>
        {this.state.showCompleted ? tasksCompleted : <View />}
      </ScrollView>
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
};

export default TaskList
