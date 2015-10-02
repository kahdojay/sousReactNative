import React from 'react-native';

let {
  TouchableHighlight,
  PropTypes,
  Text,
  StyleSheet,
  View,
} = React;

export default class TaskListItem extends React.Component {
  render() {
    let quantity = this.props.quantity > 1 ? this.props.quantity : ''
    return (
      <View style={[styles.task,
              this.props.completed && styles.completed
            ]}>
        <TouchableHighlight
          style={styles.checkBox}
          onPress={this.props.onPress}
          >
          <Text>{'<checkbox>'}</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.taskName}
          onPress={() => this.props.navigator.push({
            name: 'TaskView',
            taskId: this.props.taskId
          })}
          >
          <Text>{this.props.name}</Text>
        </TouchableHighlight>
        <Text>{quantity}</Text>
        <TouchableHighlight
          style={styles.quantityButton}>
          <Text>-</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.quantityButton}>
          <Text>+</Text>
        </TouchableHighlight>

      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  checkBox: {
    flex: 1,
  },
  task: {
    flexDirection: 'row',
    backgroundColor: 'lightblue'
  },
  completed: {
    backgroundColor: 'green'
  },
  taskName: {
    flex: 1,
    backgroundColor: 'green'
  },
  quantityButtons: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'blue',
    justifyContent: 'space-around'
  },
  quantityButton: {
    flex: 1,

  }
});

TaskListItem.propTypes = {
  // onPress: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired
};
