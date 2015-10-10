var { Icon, } = require('react-native-icons');
import React from 'react-native'
import CheckBox from 'react-native-checkbox'
import {
  greyText,
  taskCompletedBackgroundColor
} from '../utilities/colors';

let {
  TouchableHighlight,
  PropTypes,
  Text,
  StyleSheet,
  View,
} = React;

export default class TaskListItem extends React.Component {
  increment() {
    this.props.onUpdateTask({quantity: (this.props.task.quantity + 1)})
  }
  decrement() {
    if (this.props.task.quantity > 1 ) {
      this.props.onUpdateTask({quantity: (this.props.task.quantity - 1)})
    }
  }
  handleCompleteTask() {
    if (! this.props.task.completed) {
      this.props.onTaskCompletionNotification(this.props.task);
    }
    this.props.onUpdateTask({completed: !this.props.task.completed});
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={[
          styles.row,
          this.props.task.completed && styles.rowCompleted
        ]}>
          <View style={styles.checkboxContainer}>
            <CheckBox
              label=''
              onChange={this.handleCompleteTask.bind(this)}
              checked={this.props.task.completed}
            />
          </View>
          <TouchableHighlight
            onPress={() => this.props.navigator.push({
              name: 'TaskView',
              task: this.props.task,
              stationId: this.props.stationId
            })}
            style={styles.main}
          >
            <View>
              <Text style={[
                styles.text,
                this.props.task.completed && styles.textCompleted
              ]}>
                {this.props.task.name}
              </Text>
            </View>
          </TouchableHighlight>
          <Text style={styles.quantity}>
            {this.props.task.quantity > 1 ? ('X' + this.props.task.quantity) : ''}
          </Text>
          <TouchableHighlight
            underlayColor="#bbb"
            onPress={this.decrement.bind(this)}>
            <Icon name='fontawesome|minus-circle' size={30} color='#aaa' style={styles.icon}/>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={this.increment.bind(this)}>
            <Icon name='fontawesome|plus-circle' size={30} color='#aaa' style={styles.icon}/>
          </TouchableHighlight>
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
  row: {
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 5,
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
    flex: 4,
  },
  text: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 20
  },
  textCompleted: {
    color: '#777',
  },
});

TaskListItem.propTypes = {
  // onUpdateTask: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired
};
