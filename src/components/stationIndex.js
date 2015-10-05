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
  TouchableHighlight,
  PropTypes,
} = React;

class StationIndex extends React.Component {
  render() {
    const { stations, tasks } = this.props;
    let fetching =  <ActivityIndicatorIOS
                        animating={true}
                        color={'#808080'}
                        size={'small'} />

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
          onPress={() => this.props.navigator.push({
            name: 'StationView',
            stationKey: station.key
          })}
          station={station}
          tasks={tasks}
        />
      )
    })

    return (
      <View style={styles.container}>
        <View style={styles.stationContainer}>
          <Text>StationIndex View</Text>
          <AddForm
            placeholder="Add a Station..."
            onSubmit={this.props.onAddStation.bind(this)}/>
        { stations.isFetching ? fetching : <View/> }
        { stationsList }
        </View>
        {/*<View style={styles.logoutContainer}>
          <TouchableHighlight
            onPress={() => this.props.onLogout()}
            style={styles.logoutButton}
            >
            <Text style={styles.logoutButtonText}> Logout </Text>
          </TouchableHighlight>
        </View>*/}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: mainBackgroundColor,
  },
  stationContainer: {
    flex: 14
  },
  logoutContainer: {
    flex: 1
  },
  logoutButton: {
    backgroundColor: '#222',
    padding: 5
  },
  logoutButtonText: {
    alignSelf: 'center',
    color: '#fff'
  }
});

StationIndex.propTypes = {
  onAddStation: PropTypes.func.isRequired,
};

module.exports = StationIndex;
