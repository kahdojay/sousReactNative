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
    let newTask = this.props.task
    newTask.quantity += 1
    this.props.onChangeQuantity(newTask)
  }
  decrement() {
    let newTask = this.props.task
    if (newTask.quantity >= 2)
      newTask.quantity -= 1
    this.props.onChangeQuantity(newTask)
  }
  render() {
    let task = this.props.task
    let taskQuantity = task.quantity
    // let quantity = this.props.quantity > 1 ? this.props.quantity : ''
    return (
      <View style={styles.container}>
        <View style={[
          styles.row,
          this.props.completed && styles.rowCompleted
        ]}>
          <View style={styles.checkboxContainer}>
            <CheckBox
              label=''
              onChange={this.props.onPress}
              checked={this.props.completed}
            />
          </View>
          <TouchableHighlight
            onPress={() => this.props.navigator.push({
              name: 'TaskView',
              taskId: this.props.taskId
            })}
            style={styles.main}
          >
            <Text style={[
              styles.text,
              this.props.completed && styles.textCompleted
            ]}>
              {this.props.name}
            </Text>
          </TouchableHighlight>
          <Text style={styles.quantity}>
            {taskQuantity > 1 ? ('X' + taskQuantity) : ''}
          </Text>
          <TouchableHighlight
            underlayColor="#bbb"
            onPress={() => this.decrement()}>
            <Icon name='fontawesome|minus-circle' size={30} color='#aaa' style={styles.icon}/>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => this.increment()}>
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
  // onPress: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired
};
