import React from 'react-native';
import { addStation, updateTask } from '../actions';
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
    const { stations, tasks, dispatch } = this.props;
    switch (route.name) {
      case 'StationIndex':
        return <StationIndex
                  navigator={nav}
                  stations={stations}
                  onAddStation={name =>
                    dispatch(addStation(name))
                  }
                  onBack={() => this._back.bind(this)}
                />;
      case 'StationView':
        return <StationView
                  navigator={nav}
                  stationId={route.stationId}
                  onBack={() => this._back.bind(this)}
                />;
      case 'TaskView':
        return <TaskView
                  task={tasks[route.taskId]}
                  description={route.description}
                  navigator={nav}
                  onBack={() => {
                    this._back.bind(this)
                  }}
                  saveTaskDescription={(newTask) =>
                    dispatch(updateTask(newTask))
                  }
                />;
      default:
        return <View />;
    }
  }
  render() {
    return (
      <Navigator
        sceneStyle={styles.nav}
        initialRoute={{
          name: 'StationIndex',
          index: 0,
        }}
        renderScene={this.renderScene.bind(this)}
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
  return {
    stations: state.stations,
    tasks: state.tasks
  }
}

export default connect(select)(App);
