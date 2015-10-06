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
          <View style={styles.nav}>
            <Image source={require('image!Logo')} style={styles.logoImage}></Image>
            <Icon name='material|account-circle' size={50} color='#aaa' style={styles.iconFace}/>
          </View>

          <AddForm placeholder="Add a Station..."
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
  nav: {
    backgroundColor: '#1825AD',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    margin: 0,
    flexDirection: 'row',
  },
  logoImage: {
    width: 70,
    height: 70,
    alignItems: 'center'
  },
  iconFace: {
    width: 70,
    height: 70,
    position: 'absolute',
    right: 0,
  },
  signup: {
    color: 'white',
    fontSize: 22,
    textAlign: 'right',
    flex: 1,
    marginRight: 5
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
