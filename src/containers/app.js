import React from 'react-native';
import Footer from '../components/footer';
import Login from '../components/login';
import Signup from '../components/signup';
import StationIndex from '../components/stationIndex';
import StationView from '../components/stationView';
import TaskView from '../components/taskView';
import Feed from '../components/feed';
import PurveyorIndex from '../components/purveyorIndex';
import PurveyorView from '../components/purveyorView';
import ProductView from '../components/productView';
import ProfileView from '../components/profileView';
import _ from 'lodash';
import { BackBtn } from '../utilities/navigation';
import { NavigationBarStyles } from '../utilities/styles';
import { connect } from 'react-redux/native';
import { footerButtonIconColor, footerActiveHighlight } from '../utilities/colors';
import { Icon } from 'react-native-icons';
import * as actions from '../actions';

const {
  ScrollView,
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

  componentWillMount() {
    this.props.dispatch(actions.fetchTeams());
  }

  authenticatedRoute(route){
    let isAuthenticated = false;
    if(this.unauthenticatedRoutes.hasOwnProperty(route.name) === false){
      isAuthenticated = true;
    }
    return isAuthenticated;
  }

  getScene(route, nav) {
    const { ui, session, teams, stations, messages, dispatch, purveyors, products } = this.props;
    let teamKey = session.teamKey;
    // console.log(teamKey);
    switch (route.name) {
      case 'Login':
        return <Login
                  navigator={nav}
                  session={session}
                  onResetSession={() => {
                    dispatch(actions.resetSession())
                  }}
                  onLogin={(sessionParams) => {
                    dispatch(actions.createSession(sessionParams))
                  }}
                />
      case 'Signup':
        return <Signup
                  navigator={nav}
                  session={session}
                  teams={teams}
                  onResetSession={() => {
                    dispatch(actions.resetSession())
                  }}
                  onSignup={(sessionParams) => {
                    dispatch(actions.registerSession(sessionParams))
                  }}
                />
      case 'StationIndex':
        return <StationIndex
                  navigator={nav}
                  onConnectApp={() => {
                    this.props.dispatch(actions.connectApp(teamKey))
                  }}
                  stations={stations}
                  onAddStation={(name) => {
                    var stations = this.props.stations.data.map((station) => {
                      if (! station.deleted)
                        return station.name;
                    });
                    if (stations.indexOf(name) === -1) {
                      dispatch(actions.addStation(name, teamKey))
                    } else {
                      console.log("ERROR: station already exists");
                    }
                  }}
                  onBack={() =>
                    this._back.bind(this)
                  }
                  onLogout={() =>
                    dispatch(actions.resetSession())
                  }
                />;
      case 'StationView':
        var station = _.filter(stations.data, { id: route.stationId })[0]
        return (
          <StationView
            ui={ui}
            navigator={nav}
            station={station}
            stationId={route.stationId}
            onAddNewTask={function(stationId, taskName){
              console.log("TASKS", this.stationId);
              let tasks = this.station.tasks.map((task) => {
                if (! task.deleted)
                  return task.name;
              });
              if (tasks.indexOf(taskName) === -1) {
                console.log("NO MATCH", stationId);
                dispatch(actions.addStationTask(stationId, {name: taskName}))
              } else {
                console.log("ERROR: Task already exists");
              }
            }}
            onTaskCompletionNotification={(task) => {
              // console.log("TASK: ", task);
              var msg = `{{author}} completed task ${task.name}`;
              dispatch(actions.completeStationTask(msg))
            }}
            onDeleteStation={(stationId) => {
              dispatch(actions.deleteStation(stationId))
            }}
            onUpdateStationTask={(stationId, taskId, taskAttributes) => {
              dispatch(actions.updateStationTask(stationId, taskId, taskAttributes))
            }}
          />
        );
      case 'TaskView':
        var station = _.filter(stations.data, { id: route.stationId })[0]
        var task = _.filter(station.tasks, {recipeId: route.recipeId})[0]
        return <TaskView
                  ui={ui}
                  task={task}
                  navigator={nav}
                  stationId={route.stationId}
                  onUpdateStationTask={(stationId, taskId, taskAttributes) => {
                    dispatch(actions.updateStationTask(stationId, taskId, taskAttributes))
                  }}
                />;
      case 'Feed':
        return <Feed
                  navigator={nav}
                  messages={messages}
                  userEmail={session.login}
                  teamKey={session.teamKey}
                  onCreateMessage={(msg) => {
                    dispatch(actions.createMessage(msg))
                  }}
                />;
      case 'PurveyorIndex':
        return (
          <PurveyorIndex
            navigator={nav}
            purveyors={purveyors}
            onAddPurveyor={(name) => {
              dispatch(actions.addPurveyor(name, teamKey))
            }}
            onBack={() => {
              this._back()
            }}
          />
        );
      case 'PurveyorView':
        var purveyor = _.filter(purveyors.data, { id: route.purveyorId })[0]
        return (
          <PurveyorView
            ui={ui}
            navigator={nav}
            purveyor={purveyor}
            onAddNewProduct={(purveyorId, productName) => {
              dispatch(actions.addPurveyorProduct(purveyorId, {name: productName}))
            }}
            onDeletePurveyor={(purveyorId) => {
              dispatch(actions.deletePurveyor(purveyorId))
            }}
            onUpdatePurveyorProduct={(purveyorId, productId, productAttributes) => {
              dispatch(actions.updatePurveyorProduct(purveyorId, productId, productAttributes))
            }}
          />
        );
      case 'ProductView':
        var purveyor = _.filter(purveyors.data, { id: route.purveyorId })[0]
        var product = _.filter(purveyor.products, { productId: route.productId })[0]
        return <ProductView
                  ui={ui}
                  product={product}
                  navigator={nav}
                  purveyorId={route.purveyorId}
                  onUpdatePurveyorProduct={(purveyorId, productId, productAttributes) => {
                    dispatch(actions.updatePurveyorProduct(purveyorId, productId, productAttributes))
                  }}
                />;
      case 'Profile':
        return (
          <ProfileView />
        );
      default:
        return <View />;
    }
  }

  renderScene(route, nav) {
    const { dispatch, ui } = this.props;

    // redirect to initial view
    if (this.props.session.isAuthenticated){
      if(route.name === 'Login' || route.name === 'Signup') {
        route.name = 'StationIndex';
      }
    }
    // redirect to login if requested view requires authentication
    else if(route.name !== 'Login' && route.name !== 'Signup') {
      route.name = 'Signup'
    }

    let header = <View />;
    let scene = this.getScene(route, nav);

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
      // setup the header for authenticated routes
      header = (
        <View style={[styles.nav, styles.navSignUp]}>
          <Image source={require('image!Logo')} style={styles.logoImage}></Image>
        </View>
      );
    }
    else {
      switch(route.name) {
        case 'StationIndex':
        case 'Feed':
        case 'PurveyorIndex':
          header =  (
            <View style={styles.nav}>
              <Image
                source={require('image!Logo')}
                style={styles.logoImage}
              />
              <TouchableHighlight
                style={styles.profileBtn}
                onPress={() => {
                  nav.replace({
                    name: 'Profile'
                  })
                }}
              >
                <Icon
                  name='material|account-circle'
                  size={50}
                  color='white'
                  style={styles.iconFace}
                />
              </TouchableHighlight>
            </View>
          );
          break;
        case "StationView":
        case "PurveyorView":
        default:
          header =  <View></View>;
      }
    }

    if(ui.keyboard.visible === true){
      header = <View/>
    }

    return (
      <View style={styles.container}>
        {header}
        {scene}
        <Footer
          nav={nav}
          ui={ui}
          route={route}
        />
      </View>
    );
  }

  render() {
    return (
      <Navigator
        initialRoute={{
          name: this.initialRoute,
          index: 0,
        }}
        renderScene={this.renderScene.bind(this)}
        // configureScene={(route) => {
        //   if (route.sceneConfig) {
        //     return route.sceneConfig;
        //   }
        //   return Navigator.SceneConfigs.FloatFromRight;
        // }}
      />
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  scene: {
    flex: 1
  },
  nav: {
    backgroundColor: '#1825AD',
    justifyContent: 'space-between',
    margin: 0,
    flexDirection: 'row',
    alignItems: 'center'
  },
  navSignUp: {
    justifyContent: 'center',
  },
  logo: {
    color: 'white',
    fontSize: 20,
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'OpenSans'
  },
  logoImage: {
    width: 45,
    height: 45,
    alignItems: 'center',
    flex: .5
  },
  iconFace: {
    width: 70,
    height: 70,
  },
  profileBtn: {
    flex: 1,
    alignItems: 'flex-end',
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
    width: 25,
    height: 25,
    alignSelf: 'center'
  },
  footerButtonText: {
    alignSelf: 'center',
    color: footerButtonIconColor
  },
  footerActiveHighlight: {
    backgroundColor: footerActiveHighlight,
  },
  logoutButton: {
    backgroundColor: 'pink'
  },
  logoutButtonText: {
    color: '#fff'
  },
  leftBtn: {
    flex: 1,
  },
})

function select(state) {
  return {
    ui: state.ui,
    session: state.session,
    teams: state.teams,
    stations: state.stations,
    messages: state.messages,
    purveyors: state.purveyors,
    products: state.products,
  }
}

export default connect(select)(App);
