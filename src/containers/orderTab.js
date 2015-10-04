const React = require('react-native');

const {
  StyleSheet,
  View,
  Text,
} = React;

class OrderTab extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.containerText}>Coming Soon</Text>
      </View>
    );
  }
};

let styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 160,
    alignItems: 'center'
  }
});

module.exports = OrderTab;
