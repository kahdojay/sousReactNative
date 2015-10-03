const React = require('react-native');
const AddForm = require('./addForm');
import { mainBackgroundColor } from '../utilities/colors';

const {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableHighlight,
  PropTypes,
} = React;

class StationIndex extends React.Component {
  render() {
    const { stations } = this.props;
    let stationsList = [];
    let stationKeys = Object.keys(stations);
    stationKeys.forEach((stationKey) => {
      let station = stations[stationKey];
      // exclude deleted stations
      if(station.hasOwnProperty('deleted') && station.deleted === true)
        return;
      stationsList.push(
        <TouchableHighlight
          key={stationKey}
          onPress={() => this.props.navigator.push({
            name: 'StationView',
            stationId: station.id
          })}
          >
          <Text> {station.name} </Text>
        </TouchableHighlight>
      )
    })
    return (
      <View style={styles.container}>
        <Text>StationIndex View</Text>
        <AddForm
          placeholder="Add a Station..."
          onSubmit={this.props.onAddStation.bind(this)}/>
        {stationsList}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: 'pink',
  }
});

StationIndex.propTypes = {
  onAddStation: PropTypes.func.isRequired,
};

module.exports = StationIndex;
