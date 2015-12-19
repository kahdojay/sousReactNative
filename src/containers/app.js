import React from 'react-native';
import _ from 'lodash';
import NavigationBar from 'react-native-navbar';
import NavigationBarStyles from 'react-native-navbar/styles'
import { connect } from 'react-redux/native';
import { Icon } from 'react-native-icons';
import SideMenu from 'react-native-side-menu';
import { BackBtn } from '../utilities/navigation';
import Colors from '../utilities/colors';
import Urls from '../resources/urls';
import * as actions from '../actions';
import * as Components from '../components';
import Dimensions from 'Dimensions';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import PushManager from 'react-native-remote-push/RemotePushIOS';

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
      installationRegistered: this.props.connect.installationRegistered,
      touchToClose: false,
      open: false,
      isAuthenticated: this.props.session.isAuthenticated,
      firstName: this.props.session.firstName,
      lastName: this.props.session.lastName,
      product: null,
      category: null,
      // specificProducts: null,
      purveyor: null,
      contactList: [],
      showGenericModal: false,
      genericModalMessage: '',
      genericModalCallback: () => {},
      sceneState: {
        ProductForm: {
          submitReady: false,
          productId: null,
          productAttributes: {}
        }
      },
      currentTeamInfo: {
        team: this.props.teams.currentTeam,
        purveyors: {},
        categories: {},
        products: {},
        messages: {},
        lastUpdated: {
          purveyors: null,
          categories: null,
          products: null,
          messages: null,
        }
      }
    }
    this.initialRoute = 'Signup'
    this.unauthenticatedRoutes = {
      'Login': {},
      'Signup': {}
    }
    this.navBar = (
      <NavigationBar style={styles.nav} />
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

  componentWillReceiveProps(nextProps) {
    let currentTeamInfo = this.state.currentTeamInfo
    currentTeamInfo.team = nextProps.teams.currentTeam
    if(currentTeamInfo.team !== null){
      if(nextProps.purveyors.teams.hasOwnProperty(currentTeamInfo.team.id) === true){
        currentTeamInfo.purveyors = nextProps.purveyors.teams[currentTeamInfo.team.id]
        currentTeamInfo.lastUpdated.purveyors = nextProps.purveyors.lastUpdated;
      }
      if(nextProps.categories.teams.hasOwnProperty(currentTeamInfo.team.id) === true){
        currentTeamInfo.categories = nextProps.categories.teams[currentTeamInfo.team.id]
        currentTeamInfo.lastUpdated.categories = nextProps.categories.lastUpdated;
      }
      if(nextProps.products.teams.hasOwnProperty(currentTeamInfo.team.id) === true){
        currentTeamInfo.products = nextProps.products.teams[currentTeamInfo.team.id]
        currentTeamInfo.lastUpdated.products = nextProps.products.lastUpdated;
      }
      if(nextProps.messages.teams.hasOwnProperty(currentTeamInfo.team.id) === true){
        currentTeamInfo.messages = nextProps.messages.teams[currentTeamInfo.team.id]
        currentTeamInfo.lastUpdated.messages = nextProps.messages.lastUpdated;
      }
    }
    this.setState({
      installationRegistered: nextProps.connect.installationRegistered,
      isAuthenticated: nextProps.session.isAuthenticated,
      firstName: nextProps.session.firstName,
      lastName: nextProps.session.lastName,
      currentTeamInfo: currentTeamInfo,
    })
  }

  componentWillUpdate(nextProps) {
    if(this.refs.appNavigator){
      if(this.refs.appNavigator.getCurrentRoutes()[0].name === 'TeamIndex'){
        if(this.state.currentTeamInfo.team !== null){
          setTimeout(() => {
            this.refs.appNavigator.replacePrevious({
              name: 'Feed'
            });
          }, 10)
        }
      }
    }
  }

  componentDidUpdate() {
    // console.log(this.state.currentTeamInfo.team)
    if(this.state.isAuthenticated === true && this.state.currentTeamInfo.team !== null){
      const {dispatch, connect, session} = this.props
      if (this.state.installationRegistered !== true && connect.status === actions.CONNECT.CONNECTED) {
        PushManager.requestPermissions((err, data) => {
          if (err) {
            dispatch(actions.registerInstallationError(session.userId))
          } else {
            // if(userDoesNotAllow === true){
            //   dispatch(actions.registerInstallationDeclined(session.userId))
            // }
            if(data.hasOwnProperty('token') && data.token.indexOf('Error') === -1){
              dispatch(actions.registerInstallation(session.userId, data))
            } else {
              dispatch(actions.registerInstallationError(session.userId))
            }
          }
        });
      }
    }
    if(this.refs.appNavigator){
      if(this.refs.appNavigator.getCurrentRoutes()[0].name === 'Loading'){
        if(this.state.currentTeamInfo.team !== null){
          setTimeout(() => {
            this.refs.appNavigator.replacePrevious({
              name: 'Feed'
            });
          }, 10)
        } else if(this.props.teams.data.length > 0){
          setTimeout(() => {
            this.refs.appNavigator.replacePrevious({
              name: 'TeamIndex'
            });
          }, 10)
        }
      } else if(this.refs.appNavigator.getCurrentRoutes()[0].name === 'UserTeam'){
        if(this.state.currentTeamInfo.team !== null){
          setTimeout(() => {
            this.refs.appNavigator.replacePrevious({
              name: 'Feed'
            });
          }, 10)
        }
      }
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
    const { ui, session, teams, messages, dispatch, purveyors, products, categories, errors } = this.props;

    switch (route.name) {
      case 'Signup':
        return (
          <Components.Signup
            session={session}
            errors={errors.data}
            onRegisterSession={(sessionParams) => {
              _.debounce(() => {
                dispatch(actions.registerSession(sessionParams))
              }, 25)()
            }}
            ui={ui}
          />
        )
      case 'AddOrderGuide':
        return (
          <Components.AddOrderGuide
            emailAddress={session.email}
            onLearnMore={() => {
              const learnMoreMsg = (
                <View>
                  <Text style={{textAlign: 'center'}}>
                    With Sous, you can create and send
                    <Text style={{fontWeight: 'bold'}}> purchase orders </Text>
                    by adding your
                    <Text style={{fontWeight: 'bold'}}> order guide </Text>
                    to the platform. Once the orders are placed, Sous
                    will notify the entire team to expect an order.
                  </Text>
                  <Text style={{textAlign: 'center', marginTop: 10}}>
                    To get started press
                    <Text style={{fontWeight: 'bold'}}> Contact Sous.</Text>
                  </Text>
                </View>
              )
              this.setState({
                genericModalMessage: learnMoreMsg,
                showGenericModal: true
              })
            }}
            onSendEmail={(emailAddress) => {
              dispatch(actions.sendEmail({
                type: 'REQUEST_ORDER_GUIDE',
                body: `Order guide request from: ${emailAddress}`
              }));
              dispatch(actions.updateSession({
                email: emailAddress
              }))
              const learnMoreMsg = (
                <View>
                  <Text style={{textAlign: 'center'}}>
                    Thanks for reaching out - we typically respond within
                    <Text style={{fontWeight: 'bold'}}> 24 hours </Text>
                  </Text>
                </View>
              )
              this.setState({
                genericModalMessage: learnMoreMsg,
                showGenericModal: true,
                genericModalCallback: () => {
                  nav.replacePreviousAndPop({
                    name: 'Feed',
                  })
                }
              })
            }}
          />
        )
      case 'TeamIndex':
        return (
          <Components.TeamIndex
            teams={teams}
            messagesByTeams={messages.teams}
            onUpdateTeam={(teamId) => {
              _.debounce(() => {
                // dispatch(actions.resetPurveyors());
                dispatch(actions.resetMessages(teamId));
                dispatch(actions.getTeamMessages(teamId));
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
            teamTasks={this.state.currentTeamInfo.team.tasks}
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
                // var text = `{{author}} completed ${task.name}`;
                var msg = {
                  text: task.name,
                  type: 'taskCompletion',
                }
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
        var task = _.filter(this.state.currentTeamInfo.team.tasks, {recipeId: route.recipeId})[0]
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
            teamsUsers={teams.teamsUsers}
            messagesFetching={messages.isFetching}
            messages={this.state.currentTeamInfo.messages}
            userEmail={session.login}
            onGetMoreMessages={() => {
              dispatch(actions.getTeamMessages(this.state.currentTeamInfo.team.id));
            }}
            onCreateMessage={(msg) => {
              _.debounce(() => {
                dispatch(actions.createMessage(msg))
              }, 25)()
            }}
          />
        )
      case 'PurveyorIndex':
        return (
          <Components.PurveyorIndex
            purveyors={this.state.currentTeamInfo.purveyors}
            session={session}
            onNavToPurveyor={(purveyorId) => {
              const purveyor = this.state.currentTeamInfo.purveyors[purveyorId];
              this.setState({
                purveyor: purveyor,
                // specificProducts: _.sortBy(_.filter(this.state.currentTeamInfo.products, (product) => {
                //   return _.includes(product.purveyors, purveyor.id)
                // }), 'name')
              }, () => {
                nav.push({
                  name: 'PurveyorView',
                  purveyorId: purveyor.id
                })
              })
            }}
            onAddPurveyor={(name) => {
              dispatch(actions.addPurveyor(name))
            }}
            onCreateProduct={() => {
              nav.push({
                name: 'ProductForm'
              })
            }}
          />
        )
      case 'PurveyorView':
        // let purveyor = this.state.currentTeamInfo.purveyors[route.purveyorId]
        // let products = _.filter(this.state.currentTeamInfo.products, (product) => {
        //   return _.includes(product.purveyors, purveyor.id)
        // })
        const specificProductsPurveyor = _.sortBy(_.filter(this.state.currentTeamInfo.products, (product) => {
          return _.includes(product.purveyors, this.state.purveyor.id)
        }), 'name')
        return (
          <Components.PurveyorView
            cart={this.state.currentTeamInfo.team.cart}
            ui={ui}
            purveyor={this.state.purveyor}
            purveyors={this.state.currentTeamInfo.purveyors}
            products={specificProductsPurveyor}
            onAddNewProduct={(purveyorId, productName) => {
              const products = purveyor.products.map((product) => {
                if (!product.deleted) {
                  return product.name;
                }
              });
              if (products.indexOf(productName) === -1) {
                dispatch(actions.addPurveyorProduct(purveyorId, {name: productName}))
              } else {
                // console.log("ERROR: Product already exists");
              }
            }}
            onDeletePurveyor={(purveyorId) => {
              _.debounce(() => {
                dispatch(actions.deletePurveyor(purveyorId))
              }, 25)()
            }}
            onUpdatePurveyorProduct={(purveyorId, productId, productAttributes) => {
              _.debounce(() => {
                dispatch(actions.updatePurveyorProduct(purveyorId, productId, productAttributes))
              }, 25)()
            }}
            onUpdateProductInCart={(cartAction, cartAttributes) => {
              _.debounce(() => {
                dispatch(actions.updateProductInCart(cartAction, cartAttributes))
              }, 25)()
            }}
          />
        )
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
            products={this.state.currentTeamInfo.products}
            categories={this.state.currentTeamInfo.categories}
            onNavigateToCategory={(categoryId) => {
              const category = this.state.currentTeamInfo.categories[categoryId]
              this.setState({
                category: category,
                // specificProducts: _.sortBy(_.map(category.products, (productId) => {
                //   const product = this.state.currentTeamInfo.products[productId]
                //   return product
                // }), 'name')
              }, () => {
                nav.push({
                  name: 'CategoryView',
                  categoryId: category.id
                })
              })
            }}
            onCreateProduct={() => {
              nav.push({
                name: 'ProductForm'
              })
            }}
          />
        )
      case 'CategoryView':
        const specificProductsCategory = _.sortBy(_.map(this.state.category.products, (productId) => {
          const product = this.state.currentTeamInfo.products[productId]
          return product
        }), 'name')
        return (
          <Components.CategoryView
            ui={ui}
            category={this.state.category}
            cart={this.state.currentTeamInfo.team.cart}
            products={specificProductsCategory}
            purveyors={this.state.currentTeamInfo.purveyors}
            onProductDelete={(productId) => {
              _.debounce(() => {
                dispatch(actions.deleteProduct(productId));
              }, 25)()
            }}
            onProductEdit={(product) => {
              const sceneState = Object.assign({}, this.state.sceneState);
              sceneState.ProductForm.submitReady = true;
              sceneState.ProductForm.productId = product.id
              sceneState.ProductForm.productAttributes = {
                name: product.name,
                purveyors: product.purveyors,
                amount: product.amount,
                unit: product.unit,
                categoryId: this.state.category.id,
              }
              this.setState({
                product: product
              }, () => {
                nav.push({
                  name: 'ProductForm'
                })
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
                  imageData: image.data,
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
      case 'ProductForm':
        return (
          <Components.ProductForm
            product={this.state.product}
            team={this.state.currentTeamInfo.team}
            categories={this.state.currentTeamInfo.categories}
            purveyors={this.state.currentTeamInfo.purveyors}
            onProcessProduct={(productAttributes) => {
              const sceneState = Object.assign({}, this.state.sceneState);
              sceneState.ProductForm.submitReady = true;
              sceneState.ProductForm.productAttributes = productAttributes
              this.setState({
                sceneState: sceneState
              })
            }}
            onProductNotReady={() => {
              const sceneState = Object.assign({}, this.state.sceneState);
              sceneState.ProductForm.submitReady = false;
              this.setState({
                sceneState: sceneState
              })
            }}
          />
        )
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
      case 'UserTeam':
        return (
          <Components.UserTeam
            session={session}
            onCreateTeam={(teamName) => {
              _.debounce(() => {
                dispatch(actions.addTeam(teamName));
              }, 25)()
            }}
            onSearchForTeam={() => {
              let searchForTeamMsg = (
                <Text style={{textAlign: 'center'}}>
                  If you're trying to join another person's team,
                  ask them to invite you by selecting <Text style={{fontWeight: 'bold'}}>"Invite to Team"</Text> from the menu.
                </Text>
              )
              this.setState({
                genericModalMessage: searchForTeamMsg,
                showGenericModal: true,
              })
            }}
          />
        )
      case 'InviteView':
        return (
          <Components.InviteView
            contacts={this.state.contactList}
            denied={this.state.contactsPermissionDenied}
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
            team={this.state.currentTeamInfo.team}
            purveyors={this.state.currentTeamInfo.purveyors}
            products={this.state.currentTeamInfo.products}
            onDeleteProduct={(purveyorId, productId) => {
              _.debounce(() => {
                dispatch(actions.updateProductInCart(
                  'REMOVE_FROM_CART',
                  {purveyorId: purveyorId, productId: productId}
                ))
              }, 25)()
            }}
            onUpdateProductInCart={(cartAction, cartAttributes) => {
              _.debounce(() => {
                dispatch(actions.updateProductInCart(cartAction, cartAttributes))
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
          <View style={{flex: 1, alignItems: 'center'}}>
            <View style={styles.logoContainer}>
              <Image source={require('image!Logo')} style={styles.logoImage}></Image>
            </View>
            <Text style={styles.loadingText}>LOADING</Text>
          </View>
        )
      case 'TeamMemberListing':
        return (
          <Components.TeamMemberListing
            teamsUsers={teams.teamsUsers}
            currentTeamUsers={this.state.currentTeamInfo.team.users}
          />
        )
      default:
        return <View />;
    }
  }

  getNavBar(route, nav) {
    const { dispatch, ui, teams, session } = this.props;

    let navBar = <View />;
    let nextItem = <View />;

    // setup the header for unauthenticated routes
    if(this.authenticatedRoute(route) === false){
      navBar = <View />
    } else {
      switch(route.name) {
        //TODO: remove cloneWithProps as it's deprecated
        case 'AddOrderGuide':
          navBar = React.addons.cloneWithProps(this.navBar, {
            navigator: nav,
            route: route,
            buttonsColor: '#ccc',
            customPrev: (
              <Components.NavBackButton iconFont={'fontawesome|times'} />
            ),
            title: 'Order Guide',
            hideNext: true,
          })
          break;
        case 'TeamIndex':
          navBar = React.addons.cloneWithProps(this.navBar, {
            navigator: nav,
            route: route,
            hidePrev: false,
            buttonsColor: '#ccc',
            customPrev: (
              <Components.NavBackButton iconFont={'fontawesome|times'} />
            ),
            title: 'Switch Teams',
          })
          break;
        case 'Feed':
          navBar = React.addons.cloneWithProps(this.navBar, {
            navigator: nav,
            route: route,
            hidePrev: false,
            title: this.state.currentTeamInfo.team ? this.state.currentTeamInfo.team.name : 'Sous',
            titleColor: 'black',
            customPrev: (
              <Components.FeedViewLeftButton />
            ),
            customNext: (
              <Components.FeedViewRightButton />
            ),
          })
          break;
        case 'PurveyorIndex':
          navBar = React.addons.cloneWithProps(this.navBar, {
            navigator: nav,
            route: route,
            customPrev: (
              <Components.NavBackButton iconFont={'fontawesome|times'} />
            ),
            customTitle: (
              <Components.NavOrderGuide
                selectedIndex={1}
                onChange={() => {
                  nav.replace({
                    name: 'CategoryIndex'
                  })
                }}
              />
            ),
            customNext: (
              <Components.CategoryViewRightButton
                onNavToCart={() => {
                  nav.push({ name: 'CartView', });
                }}
                cart={this.state.currentTeamInfo.team.cart}
              />
            )
          })
          break;
        case 'TeamView':
          navBar = React.addons.cloneWithProps(this.navBar, {
            navigator: nav,
            route: route,
            buttonsColor: '#ccc',
            title: this.state.currentTeamInfo.team.name,
            customPrev: (
              <Components.NavBackButton iconFont={'fontawesome|times'} />
            ),
          })
          break;
        case 'PurveyorView':
          navBar = React.addons.cloneWithProps(this.navBar, {
            navigator: nav,
            route: route,
            customPrev: (
              <Components.NavBackButton
                iconFont={'fontawesome|chevron-left'}
                pop={true}
              />
            ),
            title: this.state.purveyor.name.substr(0,20) + (this.state.purveyor.name.length > 20 ? '...' : ''),
            customNext: (
              <Components.CategoryViewRightButton
                onNavToCart={() => {
                  nav.push({ name: 'CartView', });
                }}
                cart={this.state.currentTeamInfo.team.cart}
              />
            )
          })
          break;
        case 'CategoryIndex':
          navBar = React.addons.cloneWithProps(this.navBar, {
            navigator: nav,
            route: route,
            hidePrev: false,
            buttonsColor: '#ccc',
            customPrev: (
              <Components.NavBackButton iconFont={'fontawesome|times'} />
            ),
            customTitle: (
              <Components.NavOrderGuide
                selectedIndex={0}
                onChange={() => {
                  nav.replace({
                    name: 'PurveyorIndex'
                  })
                }}
              />
            ),
            customNext: (
              <Components.CategoryViewRightButton
                onNavToCart={() => {
                  nav.push({ name: 'CartView', });
                }}
                cart={this.state.currentTeamInfo.team.cart}
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
                onNavToCart={() => {
                  nav.push({ name: 'CartView', });
                }}
                cart={this.state.currentTeamInfo.team.cart}
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
                pop={true}
                iconFont={'fontawesome|chevron-left'}
              />
            ),
            title: 'Cart',
          })
          break;
        case 'ProductForm':
          navBar = React.addons.cloneWithProps(this.navBar, {
            ref: 'navBar',
            navigator: nav,
            route: route,
            customPrev: (
              <Components.NavBackButton
                iconFont={'fontawesome|times'}
                pop={true}
              />
            ),
            title: (this.state.product === null) ? 'Add New Product' : 'Edit Product',
            customNext: (
              <Components.ProductFormRightCheckbox
                submitReady={this.state.sceneState.ProductForm.submitReady}
                onProcessProduct={() => {
                  _.debounce(() => {
                    const {productId, productAttributes} = this.state.sceneState.ProductForm
                    if(productId === null){
                      dispatch(actions.addProduct(productAttributes))
                    } else {
                      dispatch(actions.updateProduct(productId, productAttributes))
                    }
                  }, 5)()
                  if(this.state.product === null){
                    nav.replacePreviousAndPop({
                      name: 'CategoryIndex',
                    });
                  } else {
                    nav.replace({
                      name: 'CategoryView',
                      categoryId: this.state.category.id
                    })
                  }
                }}
              />
            ),
          })
          break;
        case 'TeamMemberListing':
          navBar = React.addons.cloneWithProps(this.navBar, {
            navigator: nav,
            route: route,
            customPrev: (
              <Components.NavBackButton
                iconFont={'fontawesome|times'}
                pop={true}
              />
            ),
            title: 'Team Members',
            customNext: (
              <Components.TeamMemberRightInvite
                toggleInviteModal={(value) => {
                  _.debounce(() => {
                    dispatch(actions.updateSession({ inviteModalVisible: value }))
                  }, 25)()
                }}
              />
            ),
          })
          break;
        case 'UserInfo':
        case 'UserTeam':
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

  getRoute(route, nav) {
    const { session } = this.props;

    // redirect to initial view
    if (this.state.isAuthenticated){
      if (route.name === 'Login' || route.name === 'Signup' || route.name === 'UserInfo') {
        if (this.state.firstName === '' || this.state.lastName === '') {
          route.name = 'UserInfo';
        } else {
          if(this.state.currentTeamInfo.team !== null){
            // else send to Feed
            route.name = 'Feed';
          } else if(session.teamId === null) {
            route.name = 'UserTeam';
          } else {
            route.name = 'Loading';
          }
        }
      }
      if(Object.keys(this.state.currentTeamInfo.purveyors).length === 0){
        if(route.name === 'CategoryIndex' || route.name === 'PurveyorIndex') {
          route.name = 'AddOrderGuide';
        }
      }
    }
    // redirect to login if requested view requires authentication
    else if(route.name !== 'Login' && route.name !== 'Signup') {
      route.name = 'Signup'
    }

    return route
  }

  renderScene(route, nav) {
    const { dispatch, ui, session, teams, messages, purveyors, products, categories, errors, connect } = this.props;

    route = this.getRoute(route, nav);

    let navBar = this.getNavBar(route, nav);
    let scene = this.getScene(route, nav);
    let errorModal = (
      <Components.ErrorModal
        onDeleteError={(errorIdList) => {
          _.debounce(() => {
            dispatch(actions.deleteErrors(errorIdList))
          }, 25)()
        }}
        errors={errors.data}
      />
    )

    const inviteModal = (
      <Components.InviteModal
        ref='inviteModal'
        currentTeam={this.state.currentTeamInfo.team}
        modalVisible={session.inviteModalVisible}
        hideInviteModal={() => {
          // nav.refs.inviteModal.setState({ modalVisible: true });
          dispatch(actions.updateSession({ inviteModalVisible: false }))
        }}
        navigateToInviteView={(contactList, denied) => {
          this.setState({
            contactList: contactList,
            contactsPermissionDenied: denied,
          }, () => {
            // console.log('going to InviteView')
            nav.push({
              name: 'InviteView',
            })
          });
        }}
        onSMSInvite={(contactList) => {
          _.debounce(() => {
            dispatch(actions.inviteContacts(contactList))
          }, 25)()
        }}
      />
    )

    const genericModal = (
      <Components.GenericModal
        ref='genericModal'
        modalMessage={this.state.genericModalMessage}
        currentTeam={this.state.currentTeamInfo.team}
        modalVisible={this.state.showGenericModal}
        hideModal={() => {
          const cb = this.state.genericModalCallback();
          this.setState({
            genericModalMessage: '',
            showGenericModal: false,
            genericModalCallback: () => {}
          }, cb);
          // TODO: do we need to make the callback execute on hide?
        }}
      />
    )

    let CustomSideView = View
    let menu = View
    if(this.state.isAuthenticated === true && this.state.currentTeamInfo.team !== null){
      CustomSideView = SideMenu
      menu = (
        <Components.Menu
          ref='menu'
          team={this.state.currentTeamInfo.team}
          session={session}
          open={this.state.open}
          onNavToCategory={() => {
            nav.push({ name: 'CategoryIndex', })
          }}
          onNavToProfile={() => {
            nav.push({ name: 'Profile', })
          }}
          onNavToTeam={() => {
            nav.push({ name: 'TeamView', })
          }}
          onNavToTeamMemberListing={() => {
            nav.push({ name: 'TeamMemberListing', })
          }}
          onNavToTeamIndex={() => {
            nav.push({ name: 'TeamIndex', })
          }}
        />
      );
    }

    return (
      <CustomSideView
        ref='customSideView'
        menu={menu}
        touchToClose={true}
        onChange={::this.handleChange}
      >
        <View style={styles.container} >
          {navBar}
          {errorModal}
          {inviteModal}
          {genericModal}
          {scene}
          {session.inviteModalVisible === false ? <KeyboardSpacer /> : <View />}
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
        ref='appNavigator'
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
    textAlign: 'center',
    marginTop: 20,
    fontSize: 20,
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
    color: '#555',
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
    backgroundColor: Colors.button,
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
    categories: state.categories,
    errors: state.errors,
    connect: state.connect,
  }
}

// --// connect(mapStateToProps, mapDispatchToProps, mergeProps, options = {})
export default connect(mapStateToProps)(App);
// export default App;
