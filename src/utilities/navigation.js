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
        style={[styles.button, this.props.style]}
        underlayColor="#B5B5B5"
        onPress={() => {
          this.props.navigator.jumpBack();
        }}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableHighlight>
    );
  }
};

BackBtn.propTypes = {

};

const styles = StyleSheet.create({
  buttonText: {
    color: '#fff'
  }
});


module.exports = {
  BackBtn
};
