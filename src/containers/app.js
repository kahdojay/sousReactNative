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
import _ from 'lodash';
import { BackBtn } from '../utilities/navigation';
import { NavigationBarStyles } from '../utilities/styles';
import { connect } from 'react-redux/native';
import { Icon } from 'react-native-icons';
import { footerButtonIconColor } from '../utilities/colors';
import {
  createSession,
  registerSession,
  resetSession,
  // resetSessionInfo,
  fetchTeams,
  resetStations,
  addStation,
  updateStation,
  addStationTask,
  updateStationTask,
  deleteStation,
  getStations,
  updateTask,
  addTask,
  toggleTask,
  createMessage,
  getMessages,
  resetMessages,
  addPurveyor,
  deletePurveyor,
  getPurveyors,
  updateProduct,
  addProduct,
  toggleProduct,
} from '../actions';

const {
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
    this.props.dispatch(fetchTeams());
    this.props.dispatch(resetMessages());
    //NOTE: instead of clearing the contents, try temporarily dispatching the
    // reset calls, for example:
    // // this call will reset the session info: stations, tasks (todo), etc
    this.props.dispatch(resetStations());
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
                  onResetSession={() => {
                    dispatch(resetSession())
                  }}
                  onSignup={(sessionParams) => {
                    dispatch(registerSession(sessionParams))
                  }}
                />
      case 'StationIndex':
        let teamKey = session.teamKey;
        return <StationIndex
                  navigator={nav}
                  stations={stations}
                  onGetStations={() => {
                    dispatch(getStations())
                  }}
                  onAddStation={(name) => {
                    dispatch(addStation(name, teamKey))
                  }}
                  onBack={() =>
                    this._back.bind(this)
                  }
                  onLogout={() =>
                    dispatch(resetSession())
                  }
                />;
      case 'StationView':
        let station = _.filter(stations.data, { id: route.stationId })[0]
        return (
          <StationView
            navigator={nav}
            station={station}
            stationId={route.stationId}
            onAddNewTask={(stationId, taskName) => {
              // dispatch(addTask(text, stationId))
              dispatch(addStationTask(stationId, {name: taskName}))
            }}
            onDeleteStation={(stationId) => {
              dispatch(deleteStation(stationId))
            }}
            onUpdateStationTask={(stationId, taskId, taskAttributes) => {
              dispatch(updateStationTask(stationId, taskId, taskAttributes))
            }}
          />
        );
      case 'TaskView':
        return <TaskView
                  taskIdx={taskId}
                  task={station.tasks[route.taskId]}
                  navigator={nav}
                  onDeleteTask={(deletedTask) =>
                    dispatch(updateTask(deletedTask))
                  }
                  saveTaskDescription={(newTask) =>
                    dispatch(updateTask(newTask))
                  }
                />;
      case 'Feed':
        return <Feed
                  navigator={nav}
                  messages={messages}
                  userEmail={session.login}
                  teamKey={session.teamKey}
                  onCreateMessage={(msg) => {
                    dispatch(createMessage(msg))
                  }}
                  onGetMessages={() => {
                    dispatch(getMessages())
                  }}
                />;
      case 'Order':
        return (
          <PurveyorIndex
            navigator={nav}
            purveyors={purveyors}
            products={products}
            onAddPurveyor={name => {
              dispatch(addPurveyor(name))
            }}
            onBack={() => this._back.bind(this)}
          />
        );
      case 'PurveyorView':
        let purveyor = _.filter(purveyors.data, { key: route.purveyorKey })[0]
        let purveyorProducts = _.filter(products, { purveyorKey: route.purveyorKey })

        return (
          <PurveyorView
            navigator={nav}
            purveyor={purveyor}
            products={purveyorProducts}
            onAddNewProduct={(text, purveyorKey) => {
              dispatch(addProduct(text, purveyorKey))
            }}
            onDeletePurveyor={(purveyorKey) => {
              dispatch(deletePurveyor(purveyorKey))
            }}
            onToggleProduct={(productId) => dispatch(toggleProduct(productId))}
            updateProductQuantity={(newProduct) => {
              dispatch(updateProduct(newProduct))
            }}
          />
        );
        case 'ProductView':
        return <ProductView
                  product={products[route.productId]}
                  navigator={nav}
                  onDeleteProduct={(deletedProduct) =>
                    dispatch(updateProduct(deletedProduct))
                  }
                  saveProductDescription={(newProduct) =>
                    dispatch(updateProduct(newProduct))
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
      switch(route.name) {
        case 'StationIndex':
        case 'Feed':
        case 'Order':
          header =  (
            <View style={styles.nav}>
              <Image source={require('image!Logo')} style={styles.logoImage}/>
              <Icon
                name='material|account-circle'
                size={50}
                color='white'
                style={styles.iconFace}
              />
            </View>
          );
          break;
        case "StationView":
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
              <Text style={[styles.footerButtonText,prepFooterHighlight]}>
                Prep
              </Text>
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
              name: 'Order'
            })}
            style={styles.footerButton}
          >
            <View>
              <Icon
                name='material|shopping-cart'
                size={30}
                color={footerButtonIconColor}
                style={styles.footerButtonIcon}
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
            onPress={() => { dispatch(resetSession()) }}
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
    backgroundColor: 'pink'
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
    messages: state.messages,
    purveyors: state.purveyors,
    products: state.products,
  }
}

export default connect(select)(App);
