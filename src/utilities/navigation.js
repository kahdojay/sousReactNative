const React = require('react-native');

const {
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
} = React;

class BackBtn extends React.Component {
  render() {
    return (
      <TouchableHighlight
        style={styles.button}
        underlayColor="#B5B5B5"
        onPress={() => {
          this.props.navigator.jumpBack();
        }}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableHighlight>
    );
  }
};


const styles = StyleSheet.create({

});


module.exports = {
  BackBtn
};
