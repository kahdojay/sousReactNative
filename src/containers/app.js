import React from 'react-native';
import Footer from '../components/footer';
import _ from 'lodash';
import NavigationBar from 'react-native-navbar';
import { connect } from 'react-redux/native';
import { Icon } from 'react-native-icons';
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
import NavbarTitle from '../components/NavbarTitle';
import { BackBtn } from '../utilities/navigation';
import { NavigationBarStyles } from '../utilities/styles';
import { navbarColor, } from '../utilities/colors';
import * as actions from '../actions';

const {
  ScrollView,
  PropTypes,
  View,
  Text,
  ActionSheetIOS,
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

  getScene(route, nav, navBar) {
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
                  navBar={navBar}
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
              console.log("THIS", this);
              var purveyors = this.props.purveyors.data.map((purveyor) => {
                if (! purveyor.deleted)
                  return purveyor.name;
              });
              if (purveyors.indexOf(name) === -1) {
                dispatch(actions.addPurveyor(name, teamKey))
              } else {
                console.log("ERROR: purveyor already exists");
              }
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
              var products = purveyor.products.map((product) => {
                if (! product.deleted)
                  return product.name;
              });
              if (products.indexOf(productName) === -1) {
                dispatch(actions.addPurveyorProduct(purveyorId, {name: productName}))
              } else {
                console.log("ERROR: Product already exists");
              }
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

  showActionSheetStationView(navigator, route){
    const { dispatch } = this.props;
    console.log('action sheet: route', route)
    let buttons = [
      'Delete Station',
      // 'Rename Station',
      'Cancel'
    ]
    let deleteAction = 0;
    let cancelAction = 2;
    ActionSheetIOS.showActionSheetWithOptions({
      options: buttons,
      cancelButtonIndex: cancelAction,
      destructiveButtonIndex: deleteAction,
    },
    (buttonIndex) => {
      if (deleteAction === buttonIndex){
        // process the delete
        dispatch(actions.deleteStation(route.stationId))
        // pop the view
        navigator.pop();
      }
    });
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
    let navBar = route.navigationBar;

    let header = <View />;
    let scene = this.getScene(route, nav, navBar);
    let applyHighlight = '';

    // setup the header for unauthenticated routes
    if(this.authenticatedRoute(route) === false){
      // setup the header for authenticated routes
      // header = (
      //   <View style={[styles.nav, styles.navSignUp]}>
      //     <Image source={require('image!Logo')} style={styles.logoImage}></Image>
      //   </View>
      // );
      if (navBar) {
        navBar = React.addons.cloneWithProps(navBar, {
          navigator: nav,
          route: route,
        })
      }
    } else {
      switch(route.name) {
        case 'StationIndex':
          if (navBar) {
            navBar = React.addons.cloneWithProps(navBar, {
              navigator: nav,
              route: route,
              hidePrev: false,
              onNext: () => console.log('profileView'),
              onPrev: null,
              nextTitle: 'profile',
            })
          }
          break;
        case 'Feed':
          if (navBar) {
            navBar = React.addons.cloneWithProps(navBar, {
              navigator: nav,
              route: route,
              hidePrev: true,
              onNext: null,
            })
          }
          break;
        case 'PurveyorIndex':
          if (navBar) {
            navBar = React.addons.cloneWithProps(navBar, {
              navigator: nav,
              route: route,
              hidePrev: true,
              onNext: null,
              onPrev: null,
            })
          }
          break;
        case "StationView":
          if (navBar) {
            navBar = React.addons.cloneWithProps(navBar, {
              navigator: nav,
              route: route,
              onNext: (navigator, route) => this.showActionSheetStationView(navigator, route),
              nextTitle: '...',
            })
          }
          break;
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
        {navBar}
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
          index: 0,
          name: this.initialRoute,
          navigationBar: (
            <NavigationBar
              customTitle={<NavbarTitle />}
              style={styles.nav}
            />
          )
        }}
        renderScene={this.renderScene.bind(this)}
        // TODO: commented out to prevent ghosting, review animation options later
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
    backgroundColor: navbarColor,
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
