import React from 'react-native';
import Login from '../components/login';
import Signup from '../components/signup';
import StationIndex from '../components/stationIndex';
import StationView from '../components/stationView';
import TaskView from '../components/taskView';
import _ from 'lodash';
import { BackBtn } from '../utilities/navigation';
import { NavigationBarStyles } from '../utilities/styles';
import { connect } from 'react-redux/native';
var { Icon, } = require('react-native-icons');
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
  Image,
  StyleSheet,
  Navigator,
  TouchableHighlight,
  TouchableOpacity
} = React;

class App extends React.Component {

  constructor(props) {
    super(props)
    this.initialRoute = 'Signup'
    this.unauthenticatedRoutes = {
      'Login': {},
      'Signup': {}
    }
  }

  _back() {() => {
    if (route.index > 0) {
      navigator.pop();
    }
  }}

  componentWillMount(){
    // this.props.dispatch(getTeams());
  }

  authenticatedRoute(route){
    let isAuthenticated = false;
    if(this.unauthenticatedRoutes.hasOwnProperty(route.name) === false){
      isAuthenticated = true;
    }
    return isAuthenticated;
  }

  getScene(route, nav) {
    const { session, teams, stations, tasks, dispatch } = this.props;

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
                  onDeleteTask={(deletedTask) =>
                    dispatch(updateTask(deletedTask))
                  }
                  saveTaskDescription={(newTask) =>
                    dispatch(updateTask(newTask))
                  }
                />;
      default:
        return <View />;
    }
  }

  renderScene(route, nav) {
    const { dispatch } = this.props;

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

    let header = <View />;
    let scene = this.getScene(route, nav);
    let footer = <View />;
    let applyHighlight = '';
    let footerButtonIconColor = '#C7C6C7';

    if(_.includes(['StationIndex', 'StationView', 'TaskView'], route.name)){
      applyHighlight = 'Prep'
    } else if(_.includes(['Feed'], route.name)){
      applyHighlight = 'Feed'
    }

    let prepFooterHighlight = (applyHighlight == 'Prep' ? styles.footerActiveHightlight : {});
    let feedFooterHighlight = (applyHighlight == 'Feed' ? styles.footerActiveHightlight : {});

    // setup the header for unauthenticated routes
    if(this.authenticatedRoute(route) === false){
      let nextButton = <View />;
      switch (route.name) {
        case 'Login':
          nextButton = <TouchableHighlight
            onPress={() => nav.replace({
              name: 'Signup'
            })}
            style={styles.signup}>
            <Text style={styles.buttonText}>Signup</Text>
          </TouchableHighlight>;
          break;
        case 'Signup':
          nextButton = <TouchableHighlight
            onPress={() => nav.replace({
              name: 'Login'
            })}
            style={styles.signup}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableHighlight>;
          break;
        default:
          break;
      }
      header = <View style={styles.nav}>
        <Image source={require('image!Logo')} style={styles.logoImage}></Image>
        {/*nextButton*/}
      </View>;
    }
    // setup the header for authenticated routes
    else {
      console.log("ROUTE", route.name);
      switch(route.name) {
        case "StationView":
          header =  <View></View>
        break;
        case "StationIndex":
          header =  <View style={styles.nav}>
            <Image source={require('image!Logo')} style={styles.logoImage}></Image>
            <Icon name='material|account-circle' size={50} color='white' style={styles.iconFace}/>
          </View>;
        break;
        default:
          header =  <View></View>;
      }

      footer = <View style={styles.footerContainer}>
        <View style={styles.footerItem}>
          <TouchableHighlight
            underlayColor="#fff"
            onPress={() => nav.replace({
              name: 'StationIndex'
            })}
            style={styles.footerButton}
            >
            <View>
              <Icon
                name='material|assignment'
                size={30}
                color={footerButtonIconColor}
                style={[styles.footerButtonIcon,prepFooterHighlight]}
              />
              <Text
                style={[styles.footerButtonText,prepFooterHighlight]}
              > Prep </Text>
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.footerItem}>
          <TouchableHighlight
            underlayColor="#fff"
            onPress={() => nav.replace({
              name: 'Feed'
            })}
            style={styles.footerButton}
            >
            <View>
              <Icon
                name='material|comments'
                size={24}
                color={footerButtonIconColor}
                style={[styles.footerButtonIcon,feedFooterHighlight]}
              />
              <Text
                style={[styles.footerButtonText,feedFooterHighlight]}
              > Feed </Text>
            </View>
          </TouchableHighlight>
        </View>
        {/* * /}<View style={styles.footerItem}>
          <TouchableHighlight
            onPress={() => nav.replace({
              name: 'Order'
            })}
            style={styles.footerButton}
            >
            <View>
              <Icon name='material|shopping-cart' size={30} color='#222' style={styles.footerButtonIcon}/>
              <Text style={styles.footerButtonText}> Order </Text>
            </View>
          </TouchableHighlight>
        </View>{/* */}
        {/* * /}<View style={styles.footerItem}>
          <TouchableHighlight
            onPress={() => {
              dispatch(resetSession())
            }}
            style={[styles.footerButton,styles.logoutButton]}
            >
            <View>
              <Icon name='material|bus' size={30} color='#fff' style={[styles.footerButtonIcon, {marginLeft: 7}]}>
                <Icon name='material|run' size={20} color='#fff' style={{width:20, height:20, backgroundColor: 'transparent', marginLeft: -5, marginTop: 10}}/>
              </Icon>
              <Text style={[styles.footerButtonText,styles.logoutButtonText]}> Logout </Text>
            </View>
          </TouchableHighlight>
        </View>{/* */}
      </View>
    }

    return <View style={styles.container}>
      {header}
      {scene}
      {footer}
    </View>;
  }

  render() {

    return (
      <Navigator
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
    marginTop: 20,
  },
  nav: {
    backgroundColor: '#1825AD',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    margin: 0,
    flexDirection: 'row',
  },
  logo: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'OpenSans'
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
    marginRight: 5,
    right: 10,
    position: 'absolute',
    top: 27
  },
  header: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'OpenSans'
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 27,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'OpenSans'
  },
  footerContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#979797'
  },
  footerItem: {
    flex: 1
  },
  footerButton: {
    padding: 5
  },
  footerButtonIcon: {
    width: 40,
    height: 40,
    alignSelf: 'center'
  },
  footerButtonText: {
    alignSelf: 'center',
  },
  footerActiveHightlight: {

  },



  logoutButton: {
    backgroundColor: '#222'
  },
  logoutButtonText: {
    color: '#fff'
  },
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
