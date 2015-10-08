import { Icon } from 'react-native-icons';
import React from 'react-native';
import AddForm from './addForm';
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
  componentDidMount() {
    this.props.onGetStations()
  }
  render() {
    const { stations, tasks } = this.props;
    // let fetching =  <ActivityIndicatorIOS
    //                     animating={true}
    //                     color={'#808080'}
    //                     size={'small'} />
    console.log("STATIONS", this.props.stations.data);
    let stationsList = this.props.stations.data.map(function(station, index) {
      return (
        <StationIndexRow
          key={index}
          station={station}
          tasks={station.tasks}
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
          <AddForm
            placeholder="Add a Station..."
            onSubmit={this.props.onAddStation.bind(this)}
          />
          <ScrollView
            style={styles.scrollView}
            contentInset={{bottom:49}}
            automaticallyAdjustContentInsets={false}
          >
            { stationsList }
          </ScrollView>
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
    flex: 1,
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
