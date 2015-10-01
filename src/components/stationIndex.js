const React = require('react-native');

const {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
} = React;

class StationIndex extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>StationIndex View</Text>
        <TouchableHighlight
          onPress={() => this.props.navigator.push({
            name: 'StationView'
          })}
          >
          <Text>StationView Button</Text>
        </TouchableHighlight>
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


module.exports = StationIndex;
