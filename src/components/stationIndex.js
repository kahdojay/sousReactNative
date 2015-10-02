const React = require('react-native');
const AddForm = require('./addForm');

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

StationIndex.propTypes = {
  onAddStation: PropTypes.func.isRequired,
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30
  }
});


module.exports = StationIndex;
