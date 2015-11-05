import { Icon } from 'react-native-icons';
import React from 'react-native'
import CheckBox from './checkbox'
import { greyText, taskCompletedBackgroundColor } from '../utilities/colors';

const {
  TouchableHighlight,
  PropTypes,
  Text,
  StyleSheet,
  View,
} = React;

class TaskListItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      task: this.props.task
    }
    this.timeoutId = null
  }

  componentWillReceiveProps(nextProps) {
    // clearTimeout(this.timeoutId)
    // this.timeoutId = setTimeout(() => {
    this.setState({
      task: nextProps.task
    })
    // }, 1000)
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId)
  }

  increment() {
    this.setState({
      task: Object.assign({}, this.state.task, {
        quantity: (this.state.task.quantity + 1)
      })
    }, ::this.taskUpdateFromLocalState)
  }

  decrement() {
    if (this.state.task.quantity > 1 ) {
      this.setState({
        task: Object.assign({}, this.state.task, {
          quantity: (this.state.task.quantity - 1)
        })
      }, ::this.taskUpdateFromLocalState)
    }
  }

  handleCompleteTask() {
    const newTask = Object.assign({}, this.state.task, {
      completed: !this.state.task.completed
    });
    this.setState({
      task: newTask
    }, ::this.taskUpdateFromLocalState)
  }

  taskUpdateFromLocalState() {
    if(this.state.task.completed === true) {
      this.props.onTaskCompletionNotification(this.state.task);
    }
    this.props.onUpdateTeamTask({
      quantity: this.state.task.quantity,
      completed: this.state.task.completed
    });
  }

  render() {
    const {task} = this.state;
    var taskStyle;
    if (task.completed) {
      taskStyle = styles.taskCompletedText;
    } else {
      taskStyle = styles.taskIncompleteText;
    }

    return (
      <View style={styles.container}>
        <View style={[
          styles.row,
          task.completed && styles.rowCompleted
        ]}>
          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={task.completed}
              label=''
              onChange={::this.handleCompleteTask}
            />
          </View>
          <TouchableHighlight
            underlayColor='transparent'
            onPress={() => {
              this.props.onNavToTask()
            }}
            style={styles.main}
          >
            <View style={{padding: 10, borderRadius: 2,}}>
              <Text style={[
                styles.text,
                task.completed && styles.textCompleted
              ]}>
                {task.name}
              </Text>
            </View>
          </TouchableHighlight>
          <Text key={'quantity'} style={styles.quantity}>
            {task.quantity > 1 ? ('X' + task.quantity) : ''}
          </Text>
          {task.completed === false ? [
            <TouchableHighlight
              key={'decrement'}
              underlayColor='transparent'
              onPress={::this.decrement}
              style={{flex: 1}}>
              <Icon name='fontawesome|minus-circle' size={30} color='#aaa' style={styles.icon}/>
            </TouchableHighlight>,
            <TouchableHighlight
              key={'increment'}
              underlayColor='transparent'
              onPress={::this.increment}
              style={{flex: 1}}>
              <Icon name='fontawesome|plus-circle' size={30} color='#aaa' style={styles.icon}/>
            </TouchableHighlight>
          ] : [
            <View key={'decrement'} style={{flex: 1}} />,
            <View key={'increment'} style={{flex: 1}} />
          ]}
        </View>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 5,
    paddingLeft: 5,
  },
  icon: {
    width: 40,
    height: 40,
  },
  quantity: {
    fontSize: 16
  },
  taskCompletedText: {
  },
  taskIncompleteText: {
  },
  row: {
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowCompleted: {
    backgroundColor: taskCompletedBackgroundColor,
  },
  checkboxContainer: {
    flex: 1,
    alignItems: 'center',
  },
  main: {
    flex: 7,
  },
  text: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 16
  },
  textCompleted: {
    color: '#777',
    textDecorationLine: "line-through",
  },
});

TaskListItem.propTypes = {
  task: PropTypes.object.isRequired
};

export default TaskListItem
