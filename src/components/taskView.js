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
      textInputValue: this.props.task.description
    }
  }
  saveTask() {
    let newTask = this.props.task
    newTask.description = this.state.textInputValue
    this.props.saveTaskDescription(newTask)
  }
  render() {
    return (
      <View style={styles.container}>
        <BackBtn 
          navigator={this.props.navigator}
        />
        <TextInput
          style={styles.input}
          multiline={true}
          placeholder={'hello'}
          value={this.state.textInputValue}
          onChangeText={(text) => this.setState({textInputValue: text})}
          onEndEditing={() => this.saveTask()}
        >
        </TextInput>
      </View>
    );
  }
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30
  },
  input: {
    height: 40,
    borderColor: 'blue'
  }
});


module.exports = TaskView;
