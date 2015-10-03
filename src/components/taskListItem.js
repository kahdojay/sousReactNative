import React from 'react-native'
import CheckBox from 'react-native-checkbox'

let {
  TouchableHighlight,
  PropTypes,
  Text,
  StyleSheet,
  View,
} = React;

export default class TaskListItem extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <CheckBox
          label=''
          onChange={this.props.onPress}
          checked={this.props.completed}
        />
        <TouchableHighlight
          onPress={() => this.props.navigator.push({
            name: 'TaskView',
            taskId: this.props.taskId
          })}
          >
          <Text>{this.props.name}</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  completed: {
    backgroundColor: 'green'
  }
});

TaskListItem.propTypes = {
  // onPress: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired
};
