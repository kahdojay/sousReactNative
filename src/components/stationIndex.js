var { Icon, } = require('react-native-icons');
const React = require('react-native');
const AddForm = require('./addForm');
import { mainBackgroundColor } from '../utilities/colors';
import StationIndexRow from './stationIndexRow';

const {
  ActivityIndicatorIOS,
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableHighlight,
  PropTypes,
} = React;

class StationIndex extends React.Component {
  render() {
    const { stations, tasks } = this.props;
    // let fetching =  <ActivityIndicatorIOS
    //                     animating={true}
    //                     color={'#808080'}
    //                     size={'small'} />

    // add the stations for listing
    let stationsList = [];
    let stationKeys = Object.keys(stations.data);
    stationKeys.forEach((stationKey) => {
      let station = stations.data[stationKey];
      // exclude deleted stations
      if(station.hasOwnProperty('deleted') && station.deleted === true)
        return;
      stationsList.push(
        <StationIndexRow
          key={stationKey}
          station={station}
          tasks={tasks}
          onPress={() => this.props.navigator.push({
            name: 'StationView',
            stationKey: station.key
          })}
        />
      )
    })

    return (
      <View style={styles.container}>
        <View style={styles.stationContainer}>
          <AddForm placeholder="Add a Station..."
            onSubmit={this.props.onAddStation.bind(this)}/>
            {/* stations.isFetching ? fetching : <View/> */}
            { stationsList }
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stationContainer: {
    flex: 14
  },
});

StationIndex.propTypes = {
  onAddStation: PropTypes.func.isRequired,
};

module.exports = StationIndex;
