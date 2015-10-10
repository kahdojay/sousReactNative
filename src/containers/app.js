import React from 'react-native';
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
import { Icon } from 'react-native-icons';
import { footerButtonIconColor, footerActiveHighlight } from '../utilities/colors';
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

  componentWillMount(){
    this.props.dispatch(actions.connectApp())
  }

  authenticatedRoute(route){
    let isAuthenticated = false;
    if(this.unauthenticatedRoutes.hasOwnProperty(route.name) === false){
      isAuthenticated = true;
    }
    return isAuthenticated;
  }

  getScene(route, nav) {
    const { session, teams, stations, messages, dispatch, purveyors, products } = this.props;

    let teamKey = session.teamKey;

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
                  stations={stations}
                  onAddStation={(name) => {
                    dispatch(actions.addStation(name, teamKey))
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
            navigator={nav}
            station={station}
            stationId={route.stationId}
            onAddNewTask={(stationId, taskName) => {
              dispatch(actions.addStationTask(stationId, {name: taskName}))
            }}
            onTaskCompletionNotification={(options) => {
              // console.log("OPTIONS", options);
              let params = {
                author: 'Sous',
                teamKey: options.teamKey,
                message: `${session.login} completed task ${options.task.name}`
              };
              dispatch(actions.completeStationTask(params))
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
    let footer = <View />;
    let applyHighlight = '';

    if(_.includes(['StationIndex', 'StationView', 'TaskView'], route.name)){
      applyHighlight = 'Prep'
    } else if(_.includes(['Feed'], route.name)){
      applyHighlight = 'Feed'
    } else if(_.includes(['PurveyorIndex', 'PurveyorView', 'ProductView'], route.name)){
      applyHighlight = 'Order'
    }

    let prepFooterHighlight = (applyHighlight == 'Prep' ? styles.footerActiveHighlight : {});
    let feedFooterHighlight = (applyHighlight == 'Feed' ? styles.footerActiveHighlight : {});
    let orderFooterHighlight = (applyHighlight == 'Order' ? styles.footerActiveHighlight : {});

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
              <View style={styles.leftBtn}></View>
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

      footer = <View style={styles.footerContainer}>
        <View style={styles.footerItem}>
          <TouchableHighlight
            underlayColor='white'
            onPress={() => nav.replace({
              name: 'StationIndex'
            })}
            style={[styles.footerButton, prepFooterHighlight]}
          >
            <View>
              <Icon
                name='material|assignment'
                size={30}
                color={footerButtonIconColor}
                style={[styles.footerButtonIcon,prepFooterHighlight]}
              />
              <Text style={[styles.footerButtonText,prepFooterHighlight]}>
                Prep
              </Text>
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.footerItem}>
          <TouchableHighlight
            underlayColor="white"
            onPress={() => nav.replace({
              name: 'Feed'
            })}
            style={[styles.footerButton, feedFooterHighlight]}
          >
            <View>
              <Icon
                name='material|comments'
                size={24}
                color={footerButtonIconColor}
                style={[styles.footerButtonIcon,feedFooterHighlight]}
              />
              <Text style={[styles.footerButtonText,feedFooterHighlight]}>
                Feed
              </Text>
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.footerItem}>
          <TouchableHighlight
            underlayColor='white'
            onPress={() => nav.replace({
              name: 'PurveyorIndex'
            })}
            style={[styles.footerButton, orderFooterHighlight]}
          >
            <View>
              <Icon
                name='material|shopping-cart'
                size={30}
                color={footerButtonIconColor}
                style={[styles.footerButtonIcon, orderFooterHighlight]}
              />
              <Text style={styles.footerButtonText}>
                Order
              </Text>
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.footerItem}>
          <TouchableHighlight
            style={[styles.footerButton, styles.logoutButton]}
            onPress={() => { dispatch(actions.resetSession()) }}
          >
            <View>
              <Icon
                name='material|bus'
                size={30}
                color='#fff'
                style={[styles.footerButtonIcon]}
              />
              <Text style={[styles.footerButtonText,styles.logoutButtonText]}>
                Reset
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    }

    let footerStyle = styles.scene;
    // TODO: fix the height animation to prevent FOUC
    if(ui.keyboard.visible === true){
      footerStyle = [styles.scene, {
        height: ui.keyboard.marginBottom
      }];
    }

    return (
      <View style={styles.container}>
        {header}
        {scene}
        <View style={footerStyle}>
          {footer}
        </View>
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
  scene: {
  },
  nav: {
    backgroundColor: '#1825AD',
    justifyContent: 'space-between',
    margin: 0,
    flexDirection: 'row',
  },
  navSignUp: {
    justifyContent: 'center',
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
    width: 40,
    height: 40,
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
