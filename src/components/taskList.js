import React from 'react-native';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import TaskListItem from './taskListItem';

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
          <View style={{alignItems: 'center'}}>
            <TouchableHighlight
              underlayColor='transparent'
              style={{width: 100}}
              onPress={this.handlePress.bind(this)}
            >
              <View style={styles.container}>
                <View style={styles.roundedCorners}>
                  <Text style={styles.text}>{this.state.tasks.length} {this.props.toggleLabel}</Text>
                </View>
              </View>
            </TouchableHighlight>
          </View>
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
    backgroundColor: Colors.taskCompletedBackgroundColor,
    width: 150,
    borderRadius: Sizes.inputBorderRadius,
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    backgroundColor: Colors.taskCompletedBackgroundColor,
    fontWeight: 'bold',
    color: Colors.greyText,
    paddingTop: 5,
    paddingBottom: 3,
    width: 140,
  },
})

TaskList.propTypes = {
};

export default TaskList
