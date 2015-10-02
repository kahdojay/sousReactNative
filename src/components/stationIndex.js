const React = require('react-native');
const AddStationForm = require('./addStationForm');

const {
  StyleSheet,
  View,
  Text,
  TextInput,
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
        <TouchableHighlight
          key={stationKey}
          onPress={() => this.props.navigator.push({
            name: 'StationView',
            stationId: stationKey
          })}
          >
          <Text> {station.name} </Text>
        </TouchableHighlight>
      )
    })
    return (
      <View style={styles.container}>
        <Text>StationIndex View</Text>
        <AddStationForm
          onSubmit={(text) => {console.log(text)}}/>
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
