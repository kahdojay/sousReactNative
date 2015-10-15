import React from 'react-native';
import Footer from '../components/footer';
import _ from 'lodash';
import NavigationBar from 'react-native-navbar';
import NavigationBarStyles from 'react-native-navbar/styles'
import { connect } from 'react-redux/native';
import { Icon } from 'react-native-icons';
import Login from '../components/login';
import Signup from '../components/signup';
import ImageGallery from '../components/imageGallery';
import StationIndex from '../components/stationIndex';
import StationView from '../components/stationView';
import UserInfo from '../components/userInfo';
import TaskView from '../components/taskView';
let SideMenu = require('react-native-side-menu');
import Menu from '../components/menu';
import Feed from '../components/feed';
import PurveyorIndex from '../components/purveyorIndex';
import PurveyorView from '../components/purveyorView';
import ProductView from '../components/productView';
import ProfileView from '../components/profileView';
import InviteView from '../components/inviteView';
import NavbarTitle from '../components/NavbarTitle';
import { BackBtn } from '../utilities/navigation';
import Colors from '../utilities/colors';
import * as actions from '../actions';

const {
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
  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      touchToClose: false,
      open: false,
    }
    this.initialRoute = 'Signup'
    this.unauthenticatedRoutes = {
      'Login': {},
      'Signup': {}
    }
    this.navBar = (
      <NavigationBar
        customTitle={<NavbarTitle />}
        style={styles.nav}
      />
    );
    this.navBarItem = (props, nextComponent) => {
      return React.addons.cloneWithProps((
        <TouchableOpacity
          onPress={() => {
            console.log('Oops, need to specify function')
          }}>
          <View style={NavigationBarStyles.navBarRightButton}>
            {nextComponent}
          </View>
        </TouchableOpacity>
      ), props)
    };
  }
  handleOpenWithTouchToClose() {
    this.setState({
      touchToClose: true,
      open: true,
    });
  }

  handleChange(isOpen) {
    if (!isOpen) {
      this.setState({
        touchToClose: false,
        open: false,
      });
    }
  }

  _back() {() => {
    if (route.index > 0) {
      navigator.pop();
    }
  }}

  componentWillMount() {
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
    const { ui, session, teams, stations, messages, dispatch, purveyors, products } = this.props;
    let teamId = session.teamId;

    switch (route.name) {
      // case 'Login':
      //   return <Login
      //             navigator={nav}
      //             session={session}
      //             onLogin={(sessionParams) => {
      //               dispatch(actions.createSession(sessionParams))
      //             }}
      //           />
      case 'Signup':
        return <Signup
                  navigator={nav}
                  session={session}
                  teams={teams}
                  onRegisterSession={(sessionParams) => {
                    dispatch(actions.registerSession(sessionParams))
                  }}
                />
      case 'StationIndex':
        return <StationIndex
                  navigator={nav}
                  stations={stations}
                  onAddStation={(name) => {
                    var stations = this.props.stations.data.map((station) => {
                      if (! station.deleted)
                        return station.name;
                    });
                    if (stations.indexOf(name) === -1) {
                      dispatch(actions.addStation(name, teamId))
                    } else {
                      console.log("ERROR: station already exists");
                    }
                  }}
                  onBack={() =>
                    this._back.bind(this)
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
                  teamId={session.teamId}
                  session={session}
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
                dispatch(actions.addPurveyor(name, teamId))
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
        return (
          <ProductView
            ui={ui}
            product={product}
            navigator={nav}
            purveyorId={route.purveyorId}
            onUpdatePurveyorProduct={(purveyorId, productId, productAttributes) => {
              dispatch(actions.updatePurveyorProduct(purveyorId, productId, productAttributes))
            }}
          />
        );
      case 'Profile':
        return (
          <ProfileView
            navigator={nav}
            session={session}
            onUpdateInfo={(data) => {
              console.log("DATA", data);
              dispatch(actions.updateSession(data));
            }}
            onUpdateAvatar={(image) => {
              console.log("IMAGE", image);
              dispatch(actions.updateSession({
                imageUrl: image.uri
              }));
            }}
          />
        );
      case 'ImageGallery':
        return (
          <ImageGallery
            navigator={nav}
            photos={route.photos}
            onUpdateAvatar={(image) => {
              dispatch(actions.updateSession({
                imageUrl: image.uri
              }));
            }}
          />
        );
      case 'UserInfo':
        return (
          <UserInfo
            onUpdateInfo={(data) => {
              console.log("DATA", data);
              dispatch(actions.updateSession(data));
            }}
            navigator={nav}
            />
        )
      case 'Camera':
        return <Camera navigator={nav} />
      case 'InviteView':
        return (
          <InviteView
            onSMSInvite={(contactList) => dispatch(actions.inviteContacts(contactList))}
          />
        );
      default:
        return <View />;
    }
  }

  showActionSheetStationView(navigator, route) {
    const { dispatch } = this.props;
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
        dispatch(actions.deleteStation(route.stationId))
        navigator.pop();
      }
    });
  }
  showActionSheetPurveyorView(navigator, route) {
    const { dispatch } = this.props;
    let buttons = [
      'Delete Purveyor',
      // 'Rename Purveyor',
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
      if (deleteAction === buttonIndex) {
        dispatch(actions.deletePurveyor(route.purveyorId));
        navigator.pop();
      }
    });
  }

  renderScene(route, nav) {
    // console.log("PROPS", this.props);
    const { dispatch, ui } = this.props;

    // redirect to initial view
    if (this.props.session.isAuthenticated){
      if (route.name === 'Login' || route.name === 'Signup' || route.name == 'UserInfo') {
        // check session for first name and last name - if none, redirect to UserInfo
        if (this.props.session.firstName === "" || this.props.session.lastName === "") {
          route.name = 'UserInfo';
        }
        // else send to StationIndex
        else {
          route.name = 'StationIndex';
        }
      }
    }
    // redirect to login if requested view requires authentication
    else if(route.name !== 'Login' && route.name !== 'Signup') {
      route.name = 'Signup'
    }

    let navBar = <View />;
    let nextItem = <View />;
    let scene = this.getScene(route, nav);

    // setup the header for unauthenticated routes
    if(this.authenticatedRoute(route) === false){
      navBar = <View />
    } else {
      switch(route.name) {
        case 'StationIndex':
          // nextItem = this.navBarItem({
          //   onPress: (navigator, route) => {
          //     console.log(arguments)
          //     navigator.push({
          //       name: 'Profile'
          //     })
          //   }
          // }, <View>
          //   {/* * /}<Icon
          //     name='material|account-circle'
          //     size={50}
          //     color='white'
          //     style={styles.iconFace}
          //     />{/* */}
          //   <Text style={[NavigationBarStyles.navBarText, NavigationBarStyles.navBarButtonText, ]}>Profile</Text>
          // </View>)
          // console.log(nextItem)
          console.log("THIS", this.context.menuActions);
          navBar = React.addons.cloneWithProps(this.navBar, {

            navigator: nav,
            route: route,
            hidePrev: true,
            onPrev: (navigator, route) => {
              this.setState({open: true, touchToClose: true })
              // this.context.menuActions.toggle();
            },
            // customNext: nextItem
            onNext: (navigator, route) => {
              navigator.push({
                name: 'Profile',
              });
            },
            // onPrev: null,
            nextTitle: 'profile',
            prevTitle: 'menu',
          })
          break;
        case 'Feed':
          navBar = React.addons.cloneWithProps(this.navBar, {
            navigator: nav,
            route: route,
            hidePrev: true,
            onNext: null,
          })
          break;
        case 'PurveyorIndex':
          navBar = React.addons.cloneWithProps(this.navBar, {
            navigator: nav,
            route: route,
            hidePrev: true,
            onNext: null,
            onPrev: null,
          })
          break;
        case "StationView":
          navBar = React.addons.cloneWithProps(this.navBar, {
            navigator: nav,
            route: route,
            onNext: (navigator, route) => this.showActionSheetStationView(navigator, route),
            nextTitle: '...',
            hidePrev: false,
          })
          break;
        case "PurveyorView":
          navBar = React.addons.cloneWithProps(this.navBar, {
            navigator: nav,
            route: route,
            onNext: (navigator, route) => this.showActionSheetPurveyorView(navigator, route),
            nextTitle: '...',
            hidePrev: false,
          })
          break;
        case 'ProductView':
          navBar = React.addons.cloneWithProps(this.navBar, {
            navigator: nav,
            route: route,
            onNext: null,
            hidePrev: false,
          })
          break;
        case 'Profile':
          navBar = React.addons.cloneWithProps(this.navBar, {
            navigator: nav,
            route: route,
            onNext: (navigator, route) => {
              navigator.push({
                name: 'InviteView',
                navigationBar: navBar,
              })
            },
            hidePrev: false,
            nextTitle: 'Invite',
          })
          break;
        default:
          navBar = React.addons.cloneWithProps(this.navBar, {
            hidePrev: false,
            navigator: nav,
            route: route,
            onNext: null,
          })
      }
    }

    // console.log(ui.keyboard.visible);
    if(ui.keyboard.visible === true){
      // header = <View/>
    }
    // console.log('app.js navBar', navBar)

    let stylesContainer = [styles.container, {height: ui.keyboard.screenY}];
    // console.log(ui.keyboard.screenY);

    // // TODO: fix the height animation to prevent FOUC
    if(ui.keyboard.visible === true){
      // stylesContainer = [styles.container, {height: ui.keyboard.screenY}];
    }

    let footer = (
      <Footer
        onPressResetSession={() => {
          dispatch(actions.resetSession())
        }}
        nav={nav}
        ui={ui}
        route={route}
        />
    );
    let pageFooter = route.name == "UserInfo" ? <View></View> : footer;
    return (

        <View style={styles.container}>
          {navBar}
          {scene}
          {pageFooter}
        </View>

    );
  }

  configureScene(route) {
    // // TODO: commented out to prevent ghosting, review animation options later
    if (route.sceneConfig) {
      return route.sceneConfig;
    }
    return Navigator.SceneConfigs.FloatFromRight;
  }

  render() {
    return (
      <SideMenu
        menu={<Menu session={this.props.session} open={this.state.open}/> }
        touchToClose={this.state.touchToClose}
        onChange={this.handleChange.bind(this)}>
      <Navigator
        initialRoute={{
          index: 0,
          name: this.initialRoute
        }}
        renderScene={this.renderScene.bind(this)}
        configureScene={this.configureScene.bind(this)}
      />
    </SideMenu>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1
  },
  scene: {
    flex: 1
  },
  nav: {
    backgroundColor: Colors.navbarColor,
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

// App.contextTypes = {
//   menuActions: React.PropTypes.object.isRequired
// };

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
