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
  ScrollView,
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
          key={stationKey} // just for React, not visible as prop in child
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
          <AddForm placeholder="Add a Station..." onSubmit={this.props.onAddStation.bind(this)}/>
          {stations.isFetching ? fetching : <View/>}
          <ScrollView
            style={styles.scrollView}
            contentInset={{bottom:49}}
            automaticallyAdjustContentInsets={false}
            >
            { stationsList }
          </ScrollView>
        </View>
        <TouchableHighlight
          onPress={() => this.props.onLogout()}>
          <Text>Logout</Text>
        </TouchableHighlight>
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
  scrollView: {
    backgroundColor: '#f7f7f7',
    height: 500,
    paddingLeft: 20,
    paddingRight: 0,
    marginTop: 0,
    paddingTop: 0
  },
});

StationIndex.propTypes = {
  onAddStation: PropTypes.func.isRequired,
};

module.exports = StationIndex;
