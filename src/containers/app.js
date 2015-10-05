import React from 'react-native';
import Login from '../components/login';
import Signup from '../components/signup';
import StationIndex from '../components/stationIndex';
import StationView from '../components/stationView';
import TaskView from '../components/taskView';
import _ from 'lodash';
import { connect } from 'react-redux/native';
import {
  createSession,
  registerSession,
  resetSession,
  resetSessionInfo,
  getTeams,
  addStation,
  deleteStation,
  getStations,
  updateTask,
  addTask,
  toggleTask
} from '../actions';

let {
  PropTypes,
  View,
  Text,
  StyleSheet,
  Navigator
} = React;

class App extends React.Component {
  constructor(props) {
    super(props)
    this.initialRoute = 'Login'
  }
  _back() {() => {
    if (route.index > 0) {
      navigator.pop();
    }
  }}

  componentWillMount(){
    this.props.dispatch(getTeams());
  }

  renderScene(route, nav) {
    const { session, teams, stations, tasks, dispatch } = this.props;

    // redirect to initial view
    if (this.props.session.isAuthenticated){
      if(route.name === 'Login' || route.name === 'Signup') {
        route.name = 'StationIndex';
      }
    }
    // redirect to login if requested view requires authentication
    else if(route.name !== 'Login' && route.name !== 'Signup') {
      route.name = 'Login'
    }

    switch (route.name) {
      case 'Login':
        return <Login
                  navigator={nav}
                  session={session}
                  onResetSession={() => {
                    dispatch(resetSession())
                  }}
                  onLogin={(sessionParams) => {
                    dispatch(createSession(sessionParams))
                  }}
                />
      case 'Signup':
        return <Signup
                  navigator={nav}
                  session={session}
                  teams={teams}
                  onResetSessionInfo={() => {
                    dispatch(resetSessionInfo())
                  }}
                  onResetSession={() => {
                    dispatch(resetSession())
                  }}
                  onSignup={(sessionParams) => {
                    dispatch(registerSession(sessionParams))
                  }}
                />
      case 'StationIndex':
        let teamId = session.team_id;
        return <StationIndex
                  navigator={nav}
                  stations={stations}
                  tasks={tasks}
                  onAddStation={name =>
                    dispatch(addStation(name, teamId))
                  }
                  onBack={() =>
                    this._back.bind(this)
                  }
                  onLogout={() =>
                    dispatch(resetSession())
                  }
                />;
      case 'StationView':
        let station = _.filter(stations.data, { key: route.stationKey })[0]
        let stationTasks = _.filter(tasks, { stationKey: route.stationKey })
        return <StationView
                  navigator={nav}
                  station={station}
                  tasks={stationTasks}
                  stationId={route.stationKey}
                  onBack={() => this._back.bind(this)}
                  onAddNewTask={(text, stationKey) =>
                    dispatch(addTask(text, stationKey))
                  }
                  onDeleteStation={(stationKey) =>
                    dispatch(deleteStation(stationKey))
                  }
                  onToggleTask={(taskId) =>
                    dispatch(toggleTask(taskId))
                  }
                  updateTaskQuantity={(newTask) =>
                    dispatch(updateTask(newTask))
                  }
                />;
      case 'TaskView':
        return <TaskView
                  task={tasks[route.taskId]}
                  navigator={nav}
                  onBack={() =>
                    this._back.bind(this)
                  }
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
          name: this.initialRoute,
          index: 0,
        }}
        renderScene={this.renderScene.bind(this)}
        configureScene={(route) => {
          if (route.sceneConfig) {
            return route.sceneConfig;
          }
          return Navigator.SceneConfigs.FloatFromRight;
        }}
      />
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
    session: state.session,
    teams: state.teams,
    stations: state.stations,
    tasks: state.tasks
  }
}

export default connect(select)(App);
