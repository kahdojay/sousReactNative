import React from 'react-native';
import _ from 'lodash';
import NavigationBar from 'react-native-navbar';
import NavigationBarStyles from 'react-native-navbar/styles'
import { connect } from 'react-redux/native';
import { Icon } from 'react-native-icons';
import Login from '../components/login';
import Signup from '../components/signup';
import TeamIndex from '../components/teamIndex';
import TeamView from '../components/teamView';
import UserInfo from '../components/userInfo';
import TaskView from '../components/taskView';
import SideMenu from 'react-native-side-menu';
import Menu from '../components/menu';
import Feed from '../components/feed';
import FeedViewLeftButton from '../components/feedViewLeftButton';
import PurveyorIndex from '../components/purveyorIndex';
import PurveyorView from '../components/purveyorView';
import ProductView from '../components/productView';
import CategoryIndex from '../components/categoryIndex';
import CategoryView from '../components/categoryView';
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
  TouchableOpacity,
  ScrollView,
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
    const { ui, session, teams, messages, dispatch, purveyors, products } = this.props;

    switch (route.name) {
      case 'Signup':
        return (
          <Signup
            navigator={nav}
            session={session}
            onRegisterSession={(sessionParams) => {
              dispatch(actions.registerSession(sessionParams))
            }}
            ui={ui}
          />
        );
      case 'TeamIndex':
        return <TeamIndex
                  navigator={nav}
                  teams={teams}
                  messages={messages}
                  onUpdateTeam={(teamId) => {
                    dispatch(actions.updateSession({
                      teamId: teamId
                    }));
                    dispatch(actions.resetMessages());
                    dispatch(actions.resetPurveyors());
                  }}
                  onAddTeam={(name) => {
                    var teams = this.props.teams.data.map((team) => {
                      if (! team.deleted)
                        return team.name;
                    });
                    if (teams.indexOf(name) === -1) {
                      dispatch(actions.addTeam(name))
                    } else {
                      console.log("ERROR: team already exists");
                    }
                  }}
                  onBack={() =>
                    this._back.bind(this)
                  }
                />;
      case 'TeamView':
        var team = _.filter(teams.data, { id: session.teamId })[0]
        return (
          <TeamView
            ui={ui}
            navigator={nav}
            team={team}
            onAddNewTask={(taskName) => {
              // console.log(taskName);
              dispatch(actions.addTeamTask({name: taskName}))
            }}
            onTaskCompletionNotification={(task) => {
              // console.log("TASK: ", task);
              var msg = `{{author}} completed task ${task.name}`;
              dispatch(actions.completeTeamTask(msg))
            }}
            onDeleteTeam={() => {
              dispatch(actions.deleteTeam())
            }}
            onUpdateTeamTask={(taskId, taskAttributes) => {
              dispatch(actions.updateTeamTask(taskId, taskAttributes))
            }}
          />
        );
      case 'TaskView':
        var team = _.filter(teams.data, { id: session.teamId })[0]
        var task = _.filter(team.tasks, {recipeId: route.recipeId})[0]
        return <TaskView
                  ui={ui}
                  task={task}
                  navigator={nav}
                  onUpdateTeamTask={(taskId, taskAttributes) => {
                    dispatch(actions.updateTeamTask(taskId, taskAttributes))
                  }}
                />;
      case 'Feed':
        return (
          <Feed
            navigator={nav}
            messages={messages}
            userEmail={session.login}
            session={session}
            onCreateMessage={(msg) => {
              dispatch(actions.createMessage(msg))
            }}
          />
        );
      case 'PurveyorIndex':
        return (
          <PurveyorIndex
            navigator={nav}
            purveyors={purveyors}
            session={session}
            onAddPurveyor={(name) => {
              var purveyors = this.props.purveyors.data.map((purveyor) => {
                if (! purveyor.deleted)
                  return purveyor.name;
              });
              if (purveyors.indexOf(name) === -1) {
                dispatch(actions.addPurveyor(name))
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
              let products = purveyor.products.map((product) => {
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
        let purveyor = _.filter(purveyors.data, { id: route.purveyorId })[0]
        let product = _.filter(purveyor.products, { productId: route.productId })[0]
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
      case 'CategoryIndex':
        var team = _.filter(teams.data, { id: session.teamId })[0]
        return (
          <CategoryIndex
            navigator={nav}
            categories={team.categories}
          />
      );
      case 'CategoryView':
        var team = _.filter(teams.data, { id: session.teamId })[0]
        var category = _.filter(team.categories, { id: route.categoryId })[0]
        // console.log('teams products', teams.products)
        // console.log('route', route)
        // console.log('category', category)
        // console.log('team', team)
        return (
          <CategoryView
            ui={ui}
            navigator={nav}
            category={category}
            cart={team.cart}
            products={teams.products}
            onUpdateProductInCart={(cartAction, cartAttributes) => {
              // console.log(cartAction, cartAttributes)
              dispatch(actions.updateProductInCart(cartAction, cartAttributes))
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
      case 'UserInfo':
        return (
          <UserInfo
            onUpdateInfo={(data) => {
              // console.log("DATA", data);
              dispatch(actions.updateSession(data));
            }}
            navigator={nav}
            />
        )
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

  showActionSheetTeamView(navigator, route) {
    const { dispatch } = this.props;
    let buttons = [
      'Delete Team',
      // 'Rename Team',
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
        dispatch(actions.deleteTeam(route.teamId))
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
    const { dispatch, ui, teams } = this.props;

    // redirect to initial view
    if (this.props.session.isAuthenticated){
      if (route.name === 'Login' || route.name === 'Signup' || route.name == 'UserInfo') {
        if (this.props.session.firstName === "" || this.props.session.lastName === "") {
          route.name = 'UserInfo';
        } else {
          // else send to Feed
          route.name = 'Feed';
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
        case 'TeamIndex':
          navBar = React.addons.cloneWithProps(this.navBar, {
            navigator: nav,
            route: route,
            customPrev: <FeedViewLeftButton />,
            onNext: (navigator, route) => {
              navigator.push({
                name: 'Profile',
              });
            },
            nextTitle: 'profile',
          })
          break;
        case 'Feed':
          // console.log("PROPS", this);
          navBar = React.addons.cloneWithProps(this.navBar, {
            navigator: nav,
            route: route,
            onNext: null,
            customPrev: <FeedViewLeftButton />,
          })
          break;
        case 'PurveyorIndex':
          navBar = React.addons.cloneWithProps(this.navBar, {
            navigator: nav,
            route: route,
            onNext: null,
            customPrev: <FeedViewLeftButton />,
          })
          break;
        case 'TeamView':
          navBar = React.addons.cloneWithProps(this.navBar, {
            navigator: nav,
            route: route,
            onNext: (navigator, route) => this.showActionSheetTeamView(navigator, route),
            nextTitle: '...',
            customPrev: <FeedViewLeftButton />,
          })
          break;
        case 'PurveyorView':
          navBar = React.addons.cloneWithProps(this.navBar, {
            navigator: nav,
            route: route,
            onNext: (navigator, route) => this.showActionSheetPurveyorView(navigator, route),
            nextTitle: '...',
            hidePrev: false,
          })
          break;
        case 'CategoryIndex':
          navBar = React.addons.cloneWithProps(this.navBar, {
            navigator: nav,
            route: route,
            onNext: null,
            customPrev: <FeedViewLeftButton />,
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
            customPrev: <FeedViewLeftButton />,
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

    var CustomSideView = SideMenu
    if(this.props.session.isAuthenticated !== true){
      CustomSideView = View
    }

    return (
      <CustomSideView
        menu={
          <Menu
            nav={nav}
            teams={teams}
            session={this.props.session}
            open={this.state.open}
          />
        }
        touchToClose={this.state.touchToClose}
        onChange={this.handleChange.bind(this)}
      >
        <View style={styles.container} >
          {navBar}
          {scene}
        </View>
      </CustomSideView>
    );
  }

  configureScene(route) {
    if (route.sceneConfig) {
      return route.sceneConfig;
    }
    return Navigator.SceneConfigs.FloatFromRight;
  }

  render() {
    return (
      <Navigator
        initialRoute={{
          index: 0,
          name: this.initialRoute
        }}
        renderScene={this.renderScene.bind(this)}
        configureScene={this.configureScene.bind(this)}
      />
    )
  }
}

let styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    backgroundColor: 'white',
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

function select(state) {
  return {
    ui: state.ui,
    session: state.session,
    teams: state.teams,
    messages: state.messages,
    purveyors: state.purveyors,
    products: state.products,
  }
}

export default connect(select)(App);
