const React = require('react-native');

const {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
} = React;

class StationIndex extends React.Component {
  render() {
    const { stations } = this.props;
    let stationsList = [];
    let stationKeys = Object.keys(stations);
    stationKeys.forEach((stationKey) => {
      let station = stations[stationKey];
      stationsList.push(
        <View>
          <Text> {station.name} </Text>
        </View>
      )
    })
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
        {stationsList}
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
