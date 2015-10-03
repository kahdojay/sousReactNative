const React = require('react-native');
const AddForm = require('./addForm');
import { mainBackgroundColor } from '../utilities/colors';
import StationIndexRow from './stationIndexRow';

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
    const { stations, tasks } = this.props;
    let stationsList = [];
    let stationKeys = Object.keys(stations);
    stationKeys.forEach((stationKey) => {
      let station = stations[stationKey];
      // exclude deleted stations
      if(station.hasOwnProperty('deleted') && station.deleted === true)
        return;
      stationsList.push(
        <StationIndexRow
          key={stationKey}
          onPress={() => this.props.navigator.push({
            name: 'StationView',
            stationId: station.id
          })}
          station={station}
          tasks={tasks}
        />
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
    backgroundColor: mainBackgroundColor,
  }
});

StationIndex.propTypes = {
  onAddStation: PropTypes.func.isRequired,
};

module.exports = StationIndex;
