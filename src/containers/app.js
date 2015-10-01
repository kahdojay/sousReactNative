import React from 'react-native';
import StationIndex from '../components/stationIndex';
import StationView from '../components/stationView';
import TaskView from '../components/taskView';
import { connect } from 'react-redux/native';

let {
  PropTypes,
  View,
  Text,
  StyleSheet,
  Navigator
} = React;

class App extends React.Component {
  _back() {() => {
    if (route.index > 0) {
      navigator.pop();
    }
  }}
  
  renderScene(route, nav) {
    switch (route.name) {
      case 'StationIndex':
        return <StationIndex 
                  navigator={nav}
                  onBack={() => this._back.bind(this)}
                />;
      case 'StationView':
        return <StationView 
                  navigator={nav}
                  onBack={() => this._back.bind(this)}
                />;
      case 'TaskView':
        return <TaskView 
                  navigator={nav}
                  onBack={() => this._back.bind(this)}
                />;
      default:
        return <View />;
    }
  }
  render() {
    const { stations } = this.props;
    return (
      <Navigator
        sceneStyle={styles.nav}
        initialRoute={{
          name: 'StationIndex',
          index: 0,
        }}
        renderScene={this.renderScene}
        configureScene={(route) => {
          if (route.sceneConfig) {
            return route.sceneConfig;
          }
          return Navigator.SceneConfigs.FloatFromRight;
        }} />
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 80
  }
})

function select(state) {
  return {stations: state.stations}
}

export default connect(select)(App);