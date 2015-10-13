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
  componentWillMount(){
    this.props.onConnectApp()
  }

  render() {
    // let fetching =  <ActivityIndicatorIOS
    //                     animating={true}
    //                     color={'#808080'}
    //                     size={'small'} />
    return (
      <View style={styles.container}>
        <View style={styles.stationContainer}>
          <AddForm
            placeholder="Add a Station..."
            onSubmit={this.props.onAddStation.bind(this)}
          />
          <ScrollView
            style={styles.scrollView}
            keyboardShouldPersistTaps={false}
            contentInset={{bottom:49}}
            automaticallyAdjustContentInsets={false}
          >
            { this.props.stations.data.map((station, index) => {
              if (station.deleted === false) {
                return (
                  <StationIndexRow
                    key={index}
                    station={station}
                    onPress={() => this.props.navigator.push({
                      name: 'StationView',
                      stationId: station.id,
                      navigationBar: this.props.navBar,
                    })}
                  />
                );
              }
              })
            }
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
