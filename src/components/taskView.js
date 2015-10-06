const React = require('react-native');
import { BackBtn } from '../utilities/navigation';

const {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableHighlight,
} = React;

class TaskView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      textInputDescription: this.props.task.description,
      textInputName: this.props.task.name,
    }
  }
  saveTask() {
    console.log('savetask')
    let newTask = this.props.task
    newTask.description = this.state.textInputDescriptioon
    newTask.name = this.state.textInputName
    this.props.saveTaskDescription(newTask)
  }
  deleteTask() {
    let newTask = this.props.task
    newTask.deleted = true
    this.props.onDeleteTask(newTask)
    this.props.navigator.pop()
  }
  render() {
    return (
      <View style={styles.container}>
        <BackBtn 
          style={styles.backButton}
          callback={this.saveTask.bind(this)}
          navigator={this.props.navigator}
        />
        <TextInput
          style={styles.input}
          value={this.state.textInputName}
          onChangeText={(text) => this.setState({textInputName: text})}
          onEndEditing={() => this.saveTask()}
        />
        <TextInput
          style={styles.input}
          multiline={true}
          placeholder={'hello'}
          value={this.state.textInputDescription}
          onChangeText={(text) => this.setState({textInputDescription: text})}
          onEndEditing={() => this.saveTask()}
        />
        <TouchableHighlight
          onPress={() => this.deleteTask()} >
          <Text>Delete</Text>
        </TouchableHighlight>
      </View>
    );
  }
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    alignItems: 'center'
  },
  input: {
    height: 40,
    borderColor: 'blue',
    borderWidth: 1,
    color: 'black',
  },
  backButton: {
    height: 40,
    borderColor: 'blue',
    borderWidth: 1
  }
});


module.exports = TaskView;
