import React from 'react-native';
import _ from 'lodash';
import NavigationBar from 'react-native-navbar';
import NavigationBarStyles from 'react-native-navbar/styles'
import { connect } from 'react-redux/native';
import { Icon } from 'react-native-icons';
import SideMenu from 'react-native-side-menu';
import ErrorModal from '../components/errorModal';
import InviteModal from '../components/inviteModal';
import { BackBtn } from '../utilities/navigation';
import Colors from '../utilities/colors';
import Urls from '../resources/urls';
import * as actions from '../actions';
import * as Components from '../components';
import Dimensions from 'Dimensions';
import KeyboardSpacer from 'react-native-keyboard-spacer';

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
      isAuthenticated: this.props.session.isAuthenticated,
      firstName: this.props.session.firstName,
      lastName: this.props.session.lastName,
      category: null,
      categoryProducts: null,
      currentTeam: this.props.teams.currentTeam,
    }
    this.initialRoute = 'Signup'
    this.unauthenticatedRoutes = {
      'Login': {},
      'Signup': {}
    }
    this.navBar = (
      <NavigationBar
        style={styles.nav}
      />
    );
    this.navBarItem = (props, nextComponent) => {
      return React.addons.cloneWithProps((
        <TouchableOpacity
          onPress={() => {
            // console.log('Oops, need to specify function')
          }}
        >
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

  // componentWillMount() {
  //   // this.props.dispatch(actions.connectApp())
  // }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isAuthenticated: nextProps.session.isAuthenticated,
      firstName: nextProps.session.firstName,
      lastName: nextProps.session.lastName,
      currentTeam: nextProps.teams.currentTeam
    })
  }

  componentDidUpdate() {
    if(this.refs.appNavigator && this.state.currentTeam !== null && this.refs.appNavigator.getCurrentRoutes()[0].name == 'Loading'){
      setTimeout(() => {
        this.refs.appNavigator.replacePrevious({
          name: 'Feed'
        });
      }, 100)
    }
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
          <Components.Signup
            session={session}
            onRegisterSession={(sessionParams) => {
              _.debounce(() => {
                dispatch(actions.registerSession(sessionParams))
              }, 25)()
            }}
            ui={ui}
          />
        )
      case 'TeamIndex':
        return (
          <Components.TeamIndex
            teams={teams}
            messages={messages}
            onUpdateTeam={(teamId) => {
              _.debounce(() => {
                // dispatch(actions.resetPurveyors());
                dispatch(actions.resetMessages());
                dispatch(actions.setCurrentTeam(teamId));
                dispatch(actions.updateSession({ teamId: teamId }));
              }, 25)()
              nav.replacePreviousAndPop({
                name: 'Feed',
              })
            }}
            onAddTeam={(name) => {
              dispatch(actions.addTeam(name))
            }}
            onBack={() =>
              this._back.bind(this)
            }
          />
        )
      case 'TeamView':
        return (
          <Components.TeamView
            ui={ui}
            team={this.state.currentTeam}
            onNavToTask={(recipeId) => {
              // console.log(recipeId)
              nav.push({
                name: 'TaskView',
                recipeId: recipeId,
              })
            }}
            onAddNewTask={(taskName) => {
              _.debounce(() => {
                // console.log(taskName);
                dispatch(actions.addTeamTask({name: taskName}))
              }, 25)()
            }}
            onTaskCompletionNotification={(task) => {
              _.debounce(() => {
                // console.log("TASK: ", task);
                var msg = `{{author}} completed ${task.name}`;
                dispatch(actions.completeTeamTask(msg))
              }, 25)()
            }}
            onDeleteTeam={() => {
              _.debounce(() => {
                dispatch(actions.deleteTeam())
              }, 25)()
            }}
            onUpdateTeamTask={(taskId, taskAttributes) => {
              _.debounce(() => {
                dispatch(actions.updateTeamTask(taskId, taskAttributes))
              }, 25)()
            }}
          />
        )
      case 'TaskView':
        var task = _.filter(this.state.currentTeam.tasks, {recipeId: route.recipeId})[0]
        return (
          <Components.TaskView
            keyboardVisible={ui.keyboard.visible }
            task={task}
            onUpdateTeamTask={(taskId, taskAttributes) => {
              _.debounce(() => {
                dispatch(actions.updateTeamTask(taskId, taskAttributes))
              }, 25)()
            }}
            onDeleteTaskPop={() => {
              nav.pop()
            }}
          />
        )
      case 'Feed':
        return (
          <Components.Feed
            messages={messages}
            userEmail={session.login}
            session={session}
            onCreateMessage={(msg) => {
              _.debounce(() => {
                dispatch(actions.createMessage(msg))
              }, 25)()
            }}
          />
        )
      // case 'PurveyorIndex':
      //   return (
      //     <Components.PurveyorIndex
      //       purveyors={purveyors}
      //       session={session}
      //       onNavToPurveyor={() => {
      //         nav.push({
      //           name: 'PurveyorView',
      //           purveyorId: purveyor.id
      //         })
      //       }}
      //       onAddPurveyor={(name) => {
      //         const purveyors = this.props.purveyors.data.map((purveyor) => {
      //           if (! purveyor.deleted)
      //             return purveyor.name;
      //         });
      //         if (purveyors.indexOf(name) === -1) {
      //           dispatch(actions.addPurveyor(name))
      //         } else {
      //           // console.log("ERROR: purveyor already exists");
      //         }
      //       }}
      //       onBack={() => {
      //         this._back()
      //       }}
      //     />
      //   )
      // case 'PurveyorView':
      //   var purveyor = _.filter(purveyors.data, { id: route.purveyorId })[0]
      //   return (
      //     <Components.PurveyorView
      //       ui={ui}
      //       purveyor={purveyor}
      //       onAddNewProduct={(purveyorId, productName) => {
      //         const products = purveyor.products.map((product) => {
      //           if (! product.deleted)
      //             return product.name;
      //         });
      //         if (products.indexOf(productName) === -1) {
      //           dispatch(actions.addPurveyorProduct(purveyorId, {name: productName}))
      //         } else {
      //           // console.log("ERROR: Product already exists");
      //         }
      //       }}
      //       onDeletePurveyor={(purveyorId) => {
      //         _.debounce(() => {
      //           dispatch(actions.deletePurveyor(purveyorId))
      //         }, 25)()
      //       }}
      //       onUpdatePurveyorProduct={(purveyorId, productId, productAttributes) => {
      //         _.debounce(() => {
      //           dispatch(actions.updatePurveyorProduct(purveyorId, productId, productAttributes))
      //         }, 25)()
      //       }}
      //     />
      //   )
      // case 'ProductView':
      //   let purveyor = _.filter(purveyors.data, { id: route.purveyorId })[0]
      //   let product = _.filter(purveyor.products, { productId: route.productId })[0]
      //   return (
      //     <Components.ProductView
      //       keyboardVisible={ui.keyboard.visible}
      //       product={product}
      //       purveyorId={route.purveyorId}
      //       onUpdatePurveyorProduct={(purveyorId, productId, productAttributes) => {
      //         _.debounce(() => {
      //           dispatch(actions.updatePurveyorProduct(purveyorId, productId, productAttributes))
      //         }, 25)()
      //       }}
      //       onDeleteProduct={() => {
      //         nav.pop()
      //       }}
      //     />
      //   )
      case 'CategoryIndex':
        return (
          <Components.CategoryIndex
            products={teams.products}
            categories={teams.defaultCategories}
            onNavigateToCategory={(category, categoryProducts) => {
              this.setState({
                category: category,
                categoryProducts: categoryProducts
              }, () => {
                nav.push({
                  name: 'CategoryView',
                  categoryId: category.id
                })
              })
            }}
          />
        )
      case 'CategoryView':
        // var category = _.filter(this.state.currentTeam.categories, { id: route.categoryId })[0]
        // var category = _.filter(teams.defaultCategories, { id: route.categoryId })[0]
        // console.log(route);
        return (
          <Components.CategoryView
            ui={ui}
            category={this.state.category}
            cart={this.state.currentTeam.cart}
            products={this.state.categoryProducts}
            purveyors={purveyors}
            onCreateProduct={(categoryId) => {
              nav.push({
                name: 'ProductCreate',
                categoryId: categoryId,
              })
            }}
            onUpdateProductInCart={(cartAction, cartAttributes) => {
              _.debounce(() => {
                dispatch(actions.updateProductInCart(cartAction, cartAttributes))
              }, 25)()
            }}
          />
        )
      case 'Profile':
        return (
          <Components.ProfileView
            session={session}
            onUpdateInfo={(data) => {
              _.debounce(() => {
                // console.log("DATA", data);
                dispatch(actions.updateSession(data));
              }, 25)()
            }}
            onUpdateAvatar={(image) => {
              _.debounce(() => {
                // console.log("IMAGE", image);
                dispatch(actions.updateSession({
                  imageUrl: image.uri
                }));
              }, 25)()
            }}
            onStoreImages={(data) => {
              nav.push({
                name: 'ImageGallery',
                photos: data,
              });
            }}
          />
        )
      // case 'ProductCreate':
      //   return (
      //     <Components.ProductCreate
      //       appState={this.props}
      //       purveyors={this.props.purveyors}
      //       onAddProduct={(productAttributes) => {
      //         _.debounce(() => {
      //           // console.log('PRODUCT ADDED', productAttributes);
      //         }, 25)()
      //         nav.pop();
      //       }}
      //     />
      //   )
      case 'UserInfo':
        return (
          <Components.UserInfo
            onUpdateInfo={(data) => {
              _.debounce(() => {
                dispatch(actions.updateSession(data));
              }, 25)()
            }}
          />
        )
      case 'InviteView':
        return (
          <Components.InviteView
            onSMSInvite={(contactList) => {
              _.debounce(() => {
                dispatch(actions.inviteContacts(contactList))
              }, 25)()
              nav.replacePreviousAndPop({
                name: 'Feed',
              });
            }}
          />
        )
      case 'CartView':
        return (
          <Components.CartView
            team={this.state.currentTeam}
            purveyors={this.props.purveyors.data}
            appState={this.props}
            onDeleteProduct={(purveyorId, productId) => {
              _.debounce(() => {
                dispatch(actions.updateProductInCart(
                  'REMOVE_FROM_CART',
                  {purveyorId: purveyorId, productId: productId}
                ))
              }, 25)()
            }}
            onSubmitOrder={() => {
              _.debounce(() => {
                dispatch(actions.sendCart());
              }, 25)()
              nav.replacePreviousAndPop({
                name: 'Feed',
              });
            }}
          />
        )
      case 'Loading':
        return (
          <View style={{flex: 1, backgroundColor: '#f2f2f2', alignItems: 'center'}}>
            <View style={styles.logoContainer}>
              <Image source={require('image!Logo')} style={styles.logoImage}></Image>
            </View>
            <Text style={styles.loadingText}>SETTING UP YOUR WORKSPACE.</Text>
          </View>
        )
      default:
        return <View />;
    }
  }

  // showActionSheetPurveyorView(nav, route) {
  //   const { dispatch } = this.props;
  //   let buttons = [
  //     'Delete Purveyor',
  //     // 'Rename Purveyor',
  //     'Cancel'
  //   ]
  //   let deleteAction = 0;
  //   let cancelAction = 2;
  //   ActionSheetIOS.showActionSheetWithOptions({
  //     options: buttons,
  //     cancelButtonIndex: cancelAction,
  //     destructiveButtonIndex: deleteAction,
  //   },
  //   (buttonIndex) => {
  //     if (deleteAction === buttonIndex) {
  //       dispatch(actions.deletePurveyor(route.purveyorId));
  //       nav.pop();
  //     }
  //   });
  // }

  getNavBar(route, nav) {
    const { dispatch, ui, teams, session } = this.props;

    let navBar = <View />;
    let nextItem = <View />;
    let scene = this.getScene(route, nav);

    // setup the header for unauthenticated routes
    if(this.authenticatedRoute(route) === false){
      navBar = <View />
    } else {
      switch(route.name) {
        //TODO: remove cloneWithProps as it's deprecated
        case 'TeamIndex':
          navBar = React.addons.cloneWithProps(this.navBar, {
            navigator: nav,
            route: route,
            hidePrev: false,
            buttonsColor: '#ccc',
            customPrev: (
              <Components.NavBackButton
                iconFont={'fontawesome|times'}
              />
            ),
            title: 'Switch Teams',
          })
          break;
        case 'Feed':
          navBar = React.addons.cloneWithProps(this.navBar, {
            navigator: nav,
            route: route,
            hidePrev: false,
            title: this.state.currentTeam ? this.state.currentTeam.name : 'Sous',
            titleColor: 'black',
            customPrev: (
              <Components.FeedViewLeftButton />
            ),
            customNext: (
              <Components.FeedViewRightButton />
            ),
          })
          break;
        // case 'PurveyorIndex':
        //   navBar = React.addons.cloneWithProps(this.navBar, {
        //     navigator: nav,
        //     route: route,
        //     customPrev: <Components.FeedViewLeftButton />,
        //     onNext: null,
        //   })
        //   break;
        case 'TeamView':
          // console.log(this.state.currentTeam)
          navBar = React.addons.cloneWithProps(this.navBar, {
            navigator: nav,
            route: route,
            buttonsColor: '#ccc',
            title: this.state.currentTeam.name,
            customPrev: (
              <Components.NavBackButton
                iconFont={'fontawesome|times'}
              />
            ),
          })
          break;
        // case 'PurveyorView':
        //   navBar = React.addons.cloneWithProps(this.navBar, {
        //     navigator: nav,
        //     route: route,
        //     hidePrev: false,
        //     onNext: (navigator, route) => this.showActionSheetPurveyorView(navigator, route),
        //     nextTitle: '...',
        //   })
        //   break;
        case 'CategoryIndex':
          navBar = React.addons.cloneWithProps(this.navBar, {
            navigator: nav,
            route: route,
            hidePrev: false,
            buttonsColor: '#ccc',
            customPrev: (
              <Components.NavBackButton
                iconFont={'fontawesome|times'}
              />
            ),
            title: 'Order Guide',
            customNext: (
              <Components.CategoryViewRightButton
                onNavToCart={() => {
                  nav.push({ name: 'CartView', });
                }}
                cart={this.state.currentTeam.cart}
              />
            )
          })
          break;
        case 'CategoryView':
          navBar = React.addons.cloneWithProps(this.navBar, {
            navigator: nav,
            route: route,
            customPrev: (
              <Components.NavBackButton
                navName='CategoryIndex'
                iconFont={'fontawesome|chevron-left'}
              />
            ),
            title: this.state.category.name,
            customNext: (
              <Components.CategoryViewRightButton
                cart={this.state.currentTeam.cart}
              />
            )
          })
          break;
        // case 'ProductView':
        //   navBar = React.addons.cloneWithProps(this.navBar, {
        //     navigator: nav,
        //     route: route,
        //     onNext: null,
        //     hidePrev: false,
        //   })
        //   break;
        case 'Profile':
          navBar = React.addons.cloneWithProps(this.navBar, {
            navigator: nav,
            route: route,
            hidePrev: false,
            customPrev: (
              <Components.NavBackButton
                iconFont={'fontawesome|chevron-left'}
              />
            ),
            title: 'Account',
          })
          break;
        case 'InviteView':
          navBar = React.addons.cloneWithProps(this.navBar, {
            navigator: nav,
            route: route,
            customPrev: (
              <Components.NavBackButton
                iconFont={'fontawesome|times'}
              />
            ),
            title: 'Invite Teammates',
          })
          break;
        case 'CartView':
          navBar = React.addons.cloneWithProps(this.navBar, {
            navigator: nav,
            route: route,
            customPrev: (
              <Components.NavBackButton
                navName='CategoryIndex'
                iconFont={'fontawesome|chevron-left'}
              />
            ),
            title: 'Cart',
          })
          break;
        // case 'ProductCreate':
        //   navBar = React.addons.cloneWithProps(this.navBar, {
        //     navigator: nav,
        //     route: route,
        //     hideNext: true,
        //     customPrev: (
        //       <Components.NavBackButton
        //         iconFont={'fontawesome|times'}
        //         pop={true}
        //       />
        //     ),
        //     title: 'Add New Product',
        //     // customNext: (
        //       <ProductCreateRightCheckbox
        //         disabled={true}
        //       />
        //     ),
        //   })
        //   break;
        case 'UserInfo':
        case 'Loading':
          navBar = <View />;
          break;
        default:
          navBar = React.addons.cloneWithProps(this.navBar, {
            hidePrev: false,
            navigator: nav,
            route: route,
            onNext: null,
          })
          break;
      }
    }
    return navBar;
  }

  renderScene(route, nav) {
    const { dispatch, ui, teams, session, errors, connect } = this.props;

    // redirect to initial view
    if (this.state.isAuthenticated){
      if (route.name === 'Login' || route.name === 'Signup' || route.name == 'UserInfo') {
        if (this.state.firstName === "" || this.state.lastName === "") {
          route.name = 'UserInfo';
        } else {

          if(this.state.currentTeam !== null){
            // else send to Feed
            route.name = 'Feed';
          } else {
            route.name = 'Loading';
          }
        }
      }
    }
    // redirect to login if requested view requires authentication
    else if(route.name !== 'Login' && route.name !== 'Signup') {
      route.name = 'Signup'
    }

    let navBar = this.getNavBar(route, nav);
    let scene = this.getScene(route, nav);
    let errorModal = (
      <ErrorModal
        onDeleteError={(errorIdList) => {
          _.debounce(() => {
            dispatch(actions.deleteErrors(errorIdList))
          }, 25)()
        }}
        errors={errors.data}
      />
    )

    let inviteModal = (
      <InviteModal
        currentTeam={this.state.currentTeam}
        modalVisible={session.inviteModalVisible}
        toggleInviteModal={(value, doNav) => {
          _.debounce(() => {
            dispatch(actions.updateSession({ inviteModalVisible: value }))
          }, 25)()
          if(doNav === true){
            nav.push({
              name: 'InviteView',
            })
          }
        }}
        onSMSInvite={(contactList) => {
          _.debounce(() => {
            dispatch(actions.inviteContacts(contactList))
          }, 25)()
        }}
      />
    )

    let CustomSideView = SideMenu
    if(this.state.isAuthenticated !== true || this.state.currentTeam === null){
      CustomSideView = View
    }
    // console.log('app.js', this.props)
    // console.log('app.js render, errors:', this.props.errors.data)
    return (
      <CustomSideView
        menu={(
          <Components.Menu
            team={this.state.currentTeam}
            session={session}
            open={this.state.open}
            toggleInviteModal={(value) => {
              _.debounce(() => {
                dispatch(actions.updateSession({ inviteModalVisible: value }))
              }, 25)()
            }}
            onNavToCategory={() => {
              nav.push({
                name: 'CategoryIndex',
              })
            }}
            onNavToProfile={() => {
              nav.push({
                name: 'Profile',
              })
            }}
            onNavToTeam={() => {
              nav.push({
                name: 'TeamView',
              })
            }}
          />
        )}
        touchToClose={true}
        // openMenuOffset={500} // changes menu width
        onChange={::this.handleChange}
      >
        <View style={styles.container} >
          {navBar}
          {errorModal}
          {inviteModal}
          {scene}
          <KeyboardSpacer />
        </View>
      </CustomSideView>
    );
  }

  configureScene(route) {
    if (route.sceneConfig) {
      return route.sceneConfig;
    }
    return Object.assign({}, Navigator.SceneConfigs.FloatFromRight, {
      springTension: 100,
      springFriction: 1,
    });
  }

  render() {
    return (
      <Navigator
        ref="appNavigator"
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

const window = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: window.height,
    width: window.width,
    marginTop: 20,
    flex: 1,
    backgroundColor: 'white',
  },
  scene: {
    flex: 1
  },
  nav: {
    backgroundColor: Colors.navbarColor,
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
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
  loadingText: {
    alignSelf: 'center',
    fontSize: 16,
    color: '#cfcfcf',
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
  logoContainer: {
    marginTop: 50,
    marginBottom: 15,
    borderRadius: 100/2,
    backgroundColor: '#dfdfdf',
    paddingLeft: 10,
    paddingTop: 15,
    width: 100,
    height: 100,
    alignSelf: 'center'
  },
  logoImage: {
    borderRadius: 15,
    width: 80,
    height: 70
  },
})

function mapStateToProps(state) {
  return {
    ui: state.ui,
    session: state.session,
    teams: state.teams,
    messages: state.messages,
    purveyors: state.purveyors,
    products: state.products,
    errors: state.errors,
    connect: state.connect,
  }
}

// --// connect(mapStateToProps, mapDispatchToProps, mergeProps, options = {})
export default connect(mapStateToProps)(App);
// export default App;
