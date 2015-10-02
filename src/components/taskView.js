const React = require('react-native');
import { BackBtn } from '../utilities/navigation';

const {
  StyleSheet,
  View,
  Text,
} = React;

class TaskView extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <BackBtn 
          navigator={this.props.navigator}
        />
        <Text>{this.props.description}</Text>
      </View>
    );
  }
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30
  }
});


module.exports = TaskView;
