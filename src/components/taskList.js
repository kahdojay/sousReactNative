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

class TaskFilteredList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showList: true,
      enableShowHideToggle: this.props.enableShowHideToggle,
      tasks: this.props.tasks
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      tasks: nextProps.tasks
    })
  }

  handlePress() {
    this.setState({showList: !this.state.showList})
  }

  render() {
    const taskList = this.state.tasks.map((task, idx) => {
      return (
        <TaskListItem
          task={task}
          key={task.recipeId}
          onTaskCompletionNotification={this.props.onTaskCompletionNotification}
          onNavToTask={() => {
            this.props.onNavToTask(task.recipeId)
          }}
          onUpdateTeamTask={(taskAttributes) => {
            this.props.onUpdateTeamTask(task.recipeId, taskAttributes);
          }}
        />
      )
    })
    return (
      <View>
        {this.state.enableShowHideToggle === true ? (
          <TouchableHighlight
            underlayColor='transparent'
            onPress={this.handlePress.bind(this)}
          >
            <View style={styles.container}>
              <View style={styles.roundedCorners}>
                <Text style={styles.text}>{this.state.tasks.length} {this.props.toggleLabel}</Text>
              </View>
            </View>
          </TouchableHighlight>
        ) : <View /> }
        <View>
          {this.state.showList === true ? taskList : <View />}
        </View>
      </View>
    )
  }
}

class TaskList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showCompleted: true,
      incompleteTasks: _.filter(this.props.tasks, { completed: false, deleted: false }),
      completeTasks: _.filter(this.props.tasks, { completed: true, deleted: false }),
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps.tasks)
    this.setState({
      incompleteTasks: _.filter(nextProps.tasks, { completed: false, deleted: false }),
      completeTasks: _.filter(nextProps.tasks, { completed: true, deleted: false }),
    })
  }

  render() {
    return (
      <ScrollView
        keyboardShouldPersistTaps={false}
        contentInset={{bottom:49}}
        automaticallyAdjustContentInsets={false}
      >
        <TaskFilteredList
          tasks={this.state.incompleteTasks}
          onTaskCompletionNotification={this.props.onTaskCompletionNotification}
          onNavToTask={this.props.onNavToTask}
          onUpdateTeamTask={this.props.onUpdateTeamTask}
        />
        <TaskFilteredList
          tasks={this.state.completeTasks}
          enableShowHideToggle={true}
          toggleLabel={'Completed'}
          onTaskCompletionNotification={this.props.onTaskCompletionNotification}
          onNavToTask={this.props.onNavToTask}
          onUpdateTeamTask={this.props.onUpdateTeamTask}
        />
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
