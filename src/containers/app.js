import React from 'react-native';
import StationView from '../components/stationView';

let {
  PropTypes,
  View,
  Text,
  StyleSheet,
} = React;

class App extends React.Component {
  render() {
    return (
      <StationView />
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 80
  }
})

module.exports = App