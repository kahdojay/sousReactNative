import React from 'react-native';
import { Icon } from 'react-native-icons';
import _ from 'lodash';
import moment from 'moment-timezone';
import NavigationBar from 'react-native-navbar';
import NavigationBarStyles from 'react-native-navbar/styles';
import { connect } from 'react-redux/native';
import SideMenu from 'react-native-side-menu';
import { BackBtn } from '../utilities/navigation';
import Colors from '../utilities/colors';
import Urls from '../resources/urls';
import * as actions from '../actions';
import * as Components from '../components';
import * as SessionComponents from '../components/session';
import * as TextComponents from '../components/text';
import * as ModalComponents from '../components/modal';
import Dimensions from 'Dimensions';
import PushManager from 'react-native-remote-push/RemotePushIOS';
import Communications from 'react-native-communications';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import semver from 'semver';

const {
  Navigator,
  NetInfo,
  PropTypes,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

class App extends React.Component {
  constructor(props, ctx) {
    super(props, ctx)
    const constructorNow = (new Date()).getTime()
    this.state = {
      category: null,
      connectionStats: {
        attempt: 0,
        reconnect: 0,
      },
      currentTeamInfo: {
        cart: {},
        cartItems: {'cart':{}, 'orders':{}},
        categories: {},
        messages: {},
        orders: {},
        products: {},
        purveyors: {},
        resources: {},
        betaAccess: {},
        team: this.props.teams.currentTeam,
        lastUpdated: {
          purveyors: null,
          categories: null,
          products: null,
          orders: null,
          messages: null,
          betaAccess: null,
        },
      },
      email: this.props.session.email,
      firstName: this.props.session.firstName,
      genericModalCallback: () => {},
      genericModalMessage: '',
      installationRegistered: false,
      installationRegisterInProgress: false,
      isAuthenticated: this.props.session.isAuthenticated,
      lastName: this.props.session.lastName,
      open: false,
      orderId: null,
      order: null,
      orderProducts: null,
      product: null,
      purveyor: null,
      showGenericModal: false,
      sceneState: {
        ProductForm: {
          cartItem: null,
          submitReady: false,
          productId: null,
          productAttributes: {},
        },
        OrderIndex: {
          showConfirmedOrders: false,
        },
        OrderInvoiceUpload: {
          invoiceImages: [],
        }
      },
      touchToClose: false,
      lastResourceInfoRetrieval: (new Date(constructorNow - ((60*60*1000) + 100) )).toISOString(),
      lastResourceInfoFetching: false,
      networkConnected: true,
    }
    this.reconnectTimeout = null
    this.initialRoute = 'Signup'
    this.unauthenticatedRoutes = {
      'Signup': {}
    }
    this.navBar = (
      <NavigationBar style={styles.nav} />
    );
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
    const {dispatch} = nextProps
    let processRedirect = false
    let currentTeamInfo = Object.assign({}, this.state.currentTeamInfo)
    currentTeamInfo.team = nextProps.teams.currentTeam
    if(currentTeamInfo.team !== null){
      processRedirect = true
      // ---------------------------------------------------
      // purveyors
      // ---------------------------------------------------
      if(nextProps.purveyors.teams.hasOwnProperty(currentTeamInfo.team.id) === true){
        currentTeamInfo.purveyors = nextProps.purveyors.teams[currentTeamInfo.team.id]
        currentTeamInfo.lastUpdated.purveyors = nextProps.purveyors.lastUpdated
        const sortedPurveyors = _.sortBy(currentTeamInfo.purveyors, 'updatedAt')
        if(sortedPurveyors.length > 0){
          const lastPurveyor = _.last(sortedPurveyors)
          if(lastPurveyor.hasOwnProperty('updatedAt') === true){
            currentTeamInfo.lastUpdated.purveyors = _.last(sortedPurveyors).updatedAt
          }
        }
      } else {
        currentTeamInfo.purveyors = {}
        currentTeamInfo.lastUpdated.purveyors = null
      }
      // ---------------------------------------------------
      // categories
      // ---------------------------------------------------
      if(nextProps.categories.teams.hasOwnProperty(currentTeamInfo.team.id) === true){
        currentTeamInfo.categories = nextProps.categories.teams[currentTeamInfo.team.id]
        currentTeamInfo.lastUpdated.categories = nextProps.categories.lastUpdated
        const sortedCategories = _.sortBy(currentTeamInfo.categories, 'updatedAt')
        if(sortedCategories.length > 0){
          const lastCategory = _.last(sortedCategories)
          if(lastCategory.hasOwnProperty('updatedAt') === true){
            currentTeamInfo.lastUpdated.categories = _.last(sortedCategories).updatedAt
          }
        }
      } else {
        currentTeamInfo.categories = {}
        currentTeamInfo.lastUpdated.categories = null
      }

      // ---------------------------------------------------
      // products
      // ---------------------------------------------------
      if(nextProps.products.teams.hasOwnProperty(currentTeamInfo.team.id) === true){
        currentTeamInfo.products = nextProps.products.teams[currentTeamInfo.team.id]
        currentTeamInfo.lastUpdated.products = nextProps.products.lastUpdated
        const sortedProducts = _.sortBy(currentTeamInfo.products, 'updatedAt')
        if(sortedProducts.length > 0){
          const lastProduct = _.last(sortedProducts)
          if(lastProduct.hasOwnProperty('updatedAt') === true){
            currentTeamInfo.lastUpdated.products = _.last(sortedProducts).updatedAt
          }
        }
      } else {
        currentTeamInfo.products = {}
        currentTeamInfo.lastUpdated.products = null
      }
      // ---------------------------------------------------
      // messages
      // ---------------------------------------------------
      if(nextProps.messages.teams.hasOwnProperty(currentTeamInfo.team.id) === true){
        currentTeamInfo.messages = nextProps.messages.teams[currentTeamInfo.team.id]
        currentTeamInfo.lastUpdated.messages = nextProps.messages.lastUpdated
        const sortedMessages = _.sortBy(currentTeamInfo.messages, 'updatedAt')
        if(sortedMessages.length > 0){
          const lastMessage = _.last(sortedMessages)
          if(lastMessage.hasOwnProperty('updatedAt') === true){
            currentTeamInfo.lastUpdated.messages = _.last(sortedMessages).updatedAt
          }
        }
      } else {
        currentTeamInfo.messages = {}
        currentTeamInfo.lastUpdated.messages = null
      }
      // ---------------------------------------------------
      // cartItems
      // ---------------------------------------------------
      if(nextProps.cartItems.teams.hasOwnProperty(currentTeamInfo.team.id) === true){
        currentTeamInfo.cartItems = nextProps.cartItems.teams[currentTeamInfo.team.id]
        currentTeamInfo.cart = {}
        // console.log(currentTeamInfo.cartItems.cart)
        _.each(Object.keys(currentTeamInfo.cartItems.cart), (purveyorId) => {
          if(currentTeamInfo.cart.hasOwnProperty(purveyorId) === false){
            currentTeamInfo.cart[purveyorId] = {}
          }
          _.each(Object.keys(currentTeamInfo.cartItems.cart[purveyorId]), (productId) => {
            const cartItemId = currentTeamInfo.cartItems.cart[purveyorId][productId]
            const cartItem = nextProps.cartItems.items[cartItemId]
            currentTeamInfo.cart[purveyorId][productId] = cartItem
          })
        })
      } else {
        currentTeamInfo.cart = {}
        currentTeamInfo.cartItems = {'cart': {},'orders': {}}
      }
      currentTeamInfo.lastUpdated.cartItems = nextProps.cartItems.lastUpdated;
      // ---------------------------------------------------
      // orders
      // ---------------------------------------------------
      if(nextProps.orders.teams.hasOwnProperty(currentTeamInfo.team.id) === true){
        currentTeamInfo.orders = nextProps.orders.teams[currentTeamInfo.team.id]
        // console.log('cWRP: ', nextProps.orders.teams[currentTeamInfo.team.id]["Tp3cqFkgne8Amznft"].confirm)
        currentTeamInfo.lastUpdated.orders = nextProps.orders.lastUpdated
        const sortedOrders = _.sortBy(currentTeamInfo.orders, 'updatedAt')
        if(sortedOrders.length > 0){
          const lastOrder = _.last(sortedOrders)
          if(lastOrder.hasOwnProperty('updatedAt') === true){
            currentTeamInfo.lastUpdated.orders = _.last(sortedOrders).updatedAt
          }
        }
      } else {
        currentTeamInfo.orders = {}
        currentTeamInfo.lastUpdated.orders = null
      }
      // ---------------------------------------------------
      // resources
      // ---------------------------------------------------
      if(nextProps.teams.teamResources.hasOwnProperty(currentTeamInfo.team.id) === true){
        currentTeamInfo.resources = nextProps.teams.teamResources[currentTeamInfo.team.id]
        // console.log('cWRP: ', nextProps.orders.teams[currentTeamInfo.team.id]["Tp3cqFkgne8Amznft"].confirm)
      } else {
        currentTeamInfo.resources = {}
      }
      // ---------------------------------------------------
      // betaAccess
      // ---------------------------------------------------
      if(nextProps.teams.teamBetaAccess.hasOwnProperty(currentTeamInfo.team.id) === true){
        currentTeamInfo.betaAccess = nextProps.teams.teamBetaAccess[currentTeamInfo.team.id]
        // console.log('cWRP: ', nextProps.orders.teams[currentTeamInfo.team.id]["Tp3cqFkgne8Amznft"].confirm)
      } else {
        currentTeamInfo.betaAccess = {}
      }
    }
    // console.log(processRedirect, currentTeamInfo.resources)
    let connectionStats = Object.assign({}, this.state.connectionStats)
    let reconnectCountDown = false
    if(nextProps.connect.attempt !== connectionStats.attempt){
      connectionStats.attempt = nextProps.connect.attempt
      connectionStats.reconnect = nextProps.connect.timeoutMilliseconds
      reconnectCountDown = true
    }
    let componentWillReceivePropsStateUpdate = {
      connectionStats: connectionStats,
      // installationRegistered: nextProps.connect.installationRegistered,
      isAuthenticated: nextProps.session.isAuthenticated,
      firstName: nextProps.session.firstName,
      lastName: nextProps.session.lastName,
      email: nextProps.session.email,
      currentTeamInfo: currentTeamInfo,
    }

    if(currentTeamInfo.team !== null){
      if(currentTeamInfo.resources && currentTeamInfo.resources.meta && currentTeamInfo.resources.meta.retrievedAt){
        componentWillReceivePropsStateUpdate.lastResourceInfoRetrieval = currentTeamInfo.resources.meta.retrievedAt;
      } else {
        componentWillReceivePropsStateUpdate.lastResourceInfoRetrieval = this.state.lastResourceInfoRetrieval
      }
      if(
        moment().diff(componentWillReceivePropsStateUpdate.lastResourceInfoRetrieval) > (60*1000)
        && this.state.lastResourceInfoFetching === false
      ){
        componentWillReceivePropsStateUpdate.lastResourceInfoFetching = true
        // console.log('Dispatching ')
        dispatch(actions.getTeamResourceInfo(currentTeamInfo.team.id))
      } else {
        // console.log(moment().diff(componentWillReceivePropsStateUpdate.lastResourceInfoRetrieval), (60*1000))
        componentWillReceivePropsStateUpdate.lastResourceInfoFetching = false
      }
    }

    let updatedOrder = null
    if(
      this.state.order !== null
      && this.state.order.hasOwnProperty('id') === true
      && currentTeamInfo.orders.hasOwnProperty(this.state.order.id) === true
    ){
      updatedOrder = currentTeamInfo.orders[this.state.order.id]
      componentWillReceivePropsStateUpdate.order = updatedOrder
      if(
        updatedOrder.hasOwnProperty('purveyorId') === true
        && currentTeamInfo.purveyors.hasOwnProperty(updatedOrder.purveyorId) === true
      ){
        componentWillReceivePropsStateUpdate.purveyor = currentTeamInfo.purveyors[updatedOrder.purveyorId]
      }
    }
    if(
      this.state.orderId !== null
      && this.state.order === null
      && currentTeamInfo.orders.hasOwnProperty(this.state.orderId) === true
    ){
      updatedOrder = currentTeamInfo.orders[this.state.orderId]
      componentWillReceivePropsStateUpdate.order = updatedOrder
      if(
        updatedOrder.hasOwnProperty('purveyorId') === true
        && currentTeamInfo.purveyors.hasOwnProperty(updatedOrder.purveyorId) === true
      ){
        componentWillReceivePropsStateUpdate.purveyor = currentTeamInfo.purveyors[updatedOrder.purveyorId]
      }
    }
    this.setState(componentWillReceivePropsStateUpdate, () => {
      // const cwrpRouteName = this.refs.appNavigator.getCurrentRoutes()[0].name
      // console.log(this.props.cartItems)
      if(reconnectCountDown === true){
        this.countDownReconnect()
      }
      if(processRedirect === true){
        this.redirectBasedOnData()
      }
    })
  }

  componentWillUpdate(nextProps, nextState) {
    if(this.refs.appNavigator){
      const cwuRouteName = this.refs.appNavigator.getCurrentRoutes()[0].name

      // console.log('componentWillUpdate ', cwuRouteName)
      if(cwuRouteName === 'TeamIndex'){
        if(this.state.currentTeamInfo.team !== null){
          setTimeout(() => {
            this.refs.appNavigator.replacePrevious({
              name: 'Feed'
            });
          }, 10)
        }
      } else if(cwuRouteName === 'session/onboarding'){
        if(nextProps.session.viewedOnboarding === true){
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
      if(connect.status === actions.CONNECT.CONNECTED){
        if (
          this.state.installationRegistered === false
          && this.state.installationRegisterInProgress === false
        ) {
          this.setState({
            installationRegistered: true,
            installationRegisterInProgress: true,
          }, () => {
            PushManager.requestPermissions((err, data) => {
              if (err) {
                dispatch(actions.registerInstallationError())
              } else {
                // if(userDoesNotAllow === true){
                //   dispatch(actions.registerInstallationDeclined())
                // }
                if(data.hasOwnProperty('token')){
                  dispatch(actions.registerInstallation({
                    token: data.token,
                  }))
                } else {
                  dispatch(actions.registerInstallationError())
                }
              }
              this.setState({
                installationRegisterInProgress: false,
              })
            });
          })
        }
      }
    }
    this.redirectBasedOnData()
  }

  componentDidMount() {
    NetInfo.addEventListener('change', (reach) => {
      let reachVal = reach.toUpperCase();
      this.setState({
        networkConnected: reachVal && reachVal !== 'NONE' && reachVal !== 'UNKNOWN' ? true : false,
        // showGenericModal: true,
        // genericModalMessage: (
        //   <Text style={{textAlign: 'center'}}>{JSON.stringify(reach)}</Text>
        // )
      })
    })
    NetInfo.isConnected.fetch().then((isConnected) => {
      this.setState({
        networkConnected: isConnected ? true : false,
      })
    })
  }

  redirectBasedOnData() {
    if(this.refs.appNavigator){
      const rbodRoutes = this.refs.appNavigator.getCurrentRoutes()
      const rbodRouteName = rbodRoutes[(rbodRoutes.length-1)].name

      if( this.state.currentTeamInfo.resources.hasOwnProperty('counts') === true && rbodRouteName === 'OrderGuideLoading'){
        let totalProductCounts = this.state.currentTeamInfo.resources.counts.products
        let actualProducts = Object.keys(this.state.currentTeamInfo.products).length
        // console.log(rbodRouteName, totalProductCounts, actualProducts)
        if(totalProductCounts === actualProducts){
          this.refs.appNavigator.pop();
        } else {
          this.refs.appNavigator.push({
            name: 'OrderGuideLoading'
          })
        }
      }

      // execute this condition to check certain routes when teams are present
      const checkRoutesForTeamsPresent = ['Loading','UserTeam']
      if(checkRoutesForTeamsPresent.indexOf(rbodRouteName) !== -1){
        if(this.state.currentTeamInfo.team !== null){
          this.refs.appNavigator.replacePrevious({
            name: 'Feed'
          });
        } else if(this.props.teams.data.length > 0){
          this.refs.appNavigator.replacePrevious({
            name: 'TeamIndex'
          });
        }
      }

      // redirect to Feed if app is on Update view and it shouldnt be there.
      if(rbodRouteName === 'Update'){
        if(
          this.props.connect.settings.appVersion
          && this.props.connect.appStoreVersion
        ){
          if(semver.lt(this.props.connect.settings.appVersion, this.props.connect.appStoreVersion) === false){
            this.refs.appNavigator.replacePrevious({
              name: 'Feed'
            });
          }
        } else {
          this.refs.appNavigator.replacePrevious({
            name: 'Feed'
          });
        }
      }

      // ...
    }
  }

  countDownReconnect() {
    clearTimeout(this.reconnectTimeout)
    const reconnect = () => {
      this.setState({
        connectionStats: {
          reconnect: (this.state.connectionStats.reconnect - 1000)
        }
      }, () => {
        if(this.state.connectionStats.reconnect > 999){
          this.countDownReconnect()
        }
      })
    }

    this.reconnectTimeout = setTimeout(reconnect, 1000)
  }

  authenticatedRoute(route){
    let isAuthenticated = false;
    if(this.unauthenticatedRoutes.hasOwnProperty(route.name) === false){
      isAuthenticated = true;
    }
    return isAuthenticated;
  }

  onCreateProduct(route, nav, category) {
    const sceneState = Object.assign({}, this.state.sceneState);
    sceneState.ProductForm.submitReady = false;
    sceneState.ProductForm.cartItem = null;
    sceneState.ProductForm.productId = null;
    sceneState.ProductForm.productAttributes = {};
    const routeName = route.name;
    this.setState({
      sceneState: sceneState,
      category: category,
      product: null,
    }, () => {
      nav.push({
        name: 'ProductForm',
        newRoute: routeName,
      })
    })
  }

  onProductEdit(route, nav, product) {
    // console.log(route, nav, product)
    let productCategory = null
    Object.keys(this.state.currentTeamInfo.categories).forEach((categoryId) => {
      const category = this.state.currentTeamInfo.categories[categoryId]
      if(category.products.indexOf(product.id) !== -1){
        productCategory = category
      }
    })
    let submitReady = false
    if (
      productCategory !== null
      && product
      && (
        product.purveyors.length > 0 &&
        product.amount &&
        product.unit &&
        product.name !== ''
      )
    ){
      submitReady = true
    }

    const cartPurveyorIds = Object.keys(this.state.currentTeamInfo.cartItems.cart)
    let productFormCartItem = null
    if(cartPurveyorIds.length > 0){
      cartPurveyorIds.forEach((purveyorId) => {
        if(
          product.purveyors.indexOf(purveyorId) !== -1
          && this.state.currentTeamInfo.cart[purveyorId].hasOwnProperty(product.id) === true
        ) {
          productFormCartItem = this.state.currentTeamInfo.cart[purveyorId][product.id];
        }
      })
    }

    const sceneState = Object.assign({}, this.state.sceneState);
    sceneState.ProductForm.submitReady = submitReady;
    sceneState.ProductForm.cartItem = productFormCartItem;
    sceneState.ProductForm.productId = product.id;
    sceneState.ProductForm.productAttributes = {
      name: product ? product.name : '',
      purveyors: product.purveyors,
      amount: product.amount,
      unit: product.unit,
      previousCategoryId: productCategory ? productCategory.id : null,
      categoryId: productCategory ? productCategory.id : null,
    }
    this.setState({
      sceneState: sceneState,
      category: productCategory,
      product: product,
    }, () => {
      nav.push({
        name: 'ProductForm',
        newRoute: route.name,
      })
    })
  }

  getOrderItems(orderId) {
    if(this.state.currentTeamInfo.cartItems['orders'].hasOwnProperty(orderId) === true){
      const orderItemsIds = Object.keys(this.state.currentTeamInfo.cartItems['orders'][orderId])
      let orderProducts = []
      _.each(orderItemsIds, (cartItemId) => {
        const cartItem = this.props.cartItems.items[cartItemId]
        const product = this.state.currentTeamInfo.products[cartItem.productId]
        cartItem.amount = product.amount
        cartItem.unit = product.unit
        orderProducts.push({
          product: product,
          cartItem: cartItem,
        })
      })
      return _.sortBy(orderProducts, 'product.name')
    } else {
      return null
    }
  }

  getRoute(route, nav) {
    const { session, settingsConfig, connect } = this.props;

    // redirect to loading screen and show a modal
    // console.log(semver.lt(connect.settings.appVersion, connect.appStoreVersion))
    if(
      connect.settings.appVersion
      && connect.appStoreVersion
      && semver.lt(connect.settings.appVersion, connect.appStoreVersion) === true
    ){
      route.name = 'Update';
    }

    // redirect to initial view
    if (this.state.isAuthenticated === true){
      if (route.name === 'Signup' || route.name === 'UserInfo' || route.name === 'UserTeam') {
        if(session.teamId === null) {
          route.name = 'UserTeam';
        } else if(session.viewedOnboarding !== true && settingsConfig.hasOwnProperty('onboardingSettings') === true ) {
          route.name = 'session/onboarding';
        } else if(this.state.currentTeamInfo.team !== null){
          route.name = 'Feed';
        } else {
          route.name = 'Loading';
        }
      } else if(session.viewedOnboarding !== true && settingsConfig.hasOwnProperty('onboardingSettings') === true) {
        route.name = 'session/onboarding';
      }

      if(route.name === 'CategoryIndex' || route.name === 'CategoryView' || route.name === 'PurveyorIndex' || route.name === 'PurveyorView') {
        if(Object.keys(this.state.currentTeamInfo.purveyors).length === 0){
          route.name = 'OrderGuide';
        // } else {
        //   if( this.state.currentTeamInfo.resources.hasOwnProperty('counts') === true){
        //     let totalProductCounts = this.state.currentTeamInfo.resources.counts.products
        //     let actualProducts = Object.keys(this.state.currentTeamInfo.products).length
        //     // console.log('Before: ', route.name, totalProductCounts, actualProducts, (totalProductCounts !== actualProducts))
        //     if(totalProductCounts !== actualProducts){
        //       route.name = 'OrderGuideLoading';
        //       // console.log('After: ', route.name)
        //     }
        //   }
        }
      }

      const userInfoPresent = (!this.state.firstName || !this.state.lastName || !this.state.email)
      if (userInfoPresent) {
        route.name = 'UserInfo';
      }
    }
    // redirect to signup if requested view requires authentication
    else if(route.name !== 'Signup') {
      route.name = 'Signup'
    }

    // console.log('getRoute ', route.name)

    return route
  }

  getScene(route, nav) {
    const {
      cartItems,
      categories,
      connect,
      contacts,
      dispatch,
      errors,
      messages,
      orders,
      products,
      purveyors,
      session,
      settingsConfig,
      teams,
      offline,
    } = this.props;

    let orderId = this.state.orderId
    let orderProducts = this.getOrderItems(orderId)
    let order = this.state.order

    switch (route.name) {
      case 'Update':
        return {
          component: Components.Update,
          props: {
            settingsConfig: settingsConfig,
          },
        }

      case 'session/onboarding':
        return {
          component: SessionComponents.Onboarding,
          props: {
            settingsConfig: settingsConfig,
            onNavToFeed: () => {
              dispatch(actions.updateSession({
                viewedOnboarding: true
              }))
              nav.replacePreviousAndPop({
                name: 'Feed',
              })
            }
          },
        }

      case 'Signup':
        return {
          component: Components.Signup,
          props: {
            session: session,
            errors: errors.data,
            onRegisterSession: (sessionParams) => {
              _.debounce(() => {
                dispatch(actions.registerSession(sessionParams))
              }, 25)()
            },
          },
        }

      case 'OrderGuide':
        return {
          component: Components.OrderGuide,
          props: {
            emailAddress: session.email,
            onLearnMore: () => {
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
                    <Text style={{fontWeight: 'bold'}}> Send an Order Guide.</Text>
                  </Text>
                  <Text style={{textAlign: 'center', marginTop: 10}}>
                    Or press
                    <Text style={{fontWeight: 'bold'}}> Contact Sous </Text>
                    to email us directly.
                  </Text>

                </View>
              )
              this.setState({
                genericModalMessage: learnMoreMsg,
                showGenericModal: true
              })
            },
            onNavToOrderGuideUpload: () => {
              nav.push({
                name: 'OrderGuideUpload',
              })
            },
            onSendEmail: (emailAddress) => {
              dispatch(actions.sendEmail({
                type: 'REQUEST_ORDER_GUIDE',
                fromEmail: emailAddress,
                fromName: `${session.firstName} ${session.lastName}`,
                body: `Order guide request from: ${emailAddress}`,
              }));
              const sessionData = {
                email: emailAddress
              }
              dispatch(actions.updateSession(sessionData))
              dispatch(actions.receiveSessionTeamsUser(sessionData))
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
            },
          },
        }
      case 'OrderGuideLoading':
        let totalProducts = 1
        if(
          this.state.currentTeamInfo.resources.hasOwnProperty('counts') === true
          && this.state.currentTeamInfo.resources.counts.hasOwnProperty('products') === true
        ){
          totalProducts = this.state.currentTeamInfo.resources.counts.products
        }
        return {
          component: Components.OrderGuideLoading,
          props: {
            actualProducts: Object.keys(this.state.currentTeamInfo.products).length,
            totalProducts: totalProducts,
          },
        }
      case 'OrderGuideUpload':
        return {
          component: Components.OrderGuideUpload,
          props: {
            emailAddress: session.email,
            onUploadOrderGuide: (emailAddress, selectedPhotos) => {
              const attachments = _.map(selectedPhotos, (source, idx) => {
                return {
                  "type": "image/jpeg",
                  "name": `${this.state.currentTeamInfo.team.teamCode}-Order_Guide-${(idx+1)}.jpeg`,
                  "content": source.data,
                }
              })
              dispatch(actions.sendEmail({
                type: 'UPLOAD_ORDER_GUIDE',
                fromEmail: emailAddress,
                fromName: `${session.firstName} ${session.lastName}`,
                subject: `Order Guide Upload - ${this.state.currentTeamInfo.team.name}`,
                body: `Order Guide from ${this.state.currentTeamInfo.team.name}`,
                attachments: attachments,
              }))
              const sessionData = {
                email: emailAddress
              }
              dispatch(actions.updateSession(sessionData))
              dispatch(actions.receiveSessionTeamsUser(sessionData))
              const learnMoreMsg = (
                <View>
                  <Text style={{textAlign: 'center'}}>
                    Thanks for uploading your order guide - we typically respond within
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
            },
          },
        }
      case 'TeamIndex':
        return {
          component: Components.TeamIndex,
          props: {
            currentTeam: this.state.currentTeamInfo.team,
            teams: teams,
            messagesByTeams: messages.teams,
            onUpdateTeam: (teamId) => {
              _.debounce(() => {
                const teamIndexNow = (new Date()).getTime()
                this.setState({
                  lastResourceInfoRetrieval: (new Date(teamIndexNow - ((60*60*1000) + 100) )).toISOString(),
                }, () => {
                  // dispatch(actions.resetPurveyors());
                  dispatch(actions.setCurrentTeam(teamId));
                })
              }, 25)()
              nav.replacePreviousAndPop({
                name: 'Feed',
              })
            },
            onAddTeam: (name) => {
              dispatch(actions.addTeam(name))
            },
            onLeaveTeam: (teamId) => {
              _.debounce(() => {
                dispatch(actions.leaveCurrentTeam(teamId));
              }, 25)()
              nav.replacePreviousAndPop({
                name: 'Feed',
              })
            },
            onShowLeaveError: () => {
              this.setState({
                genericModalMessage: (
                  <TextComponents.LeaveTeamErrorMessage />
                ),
                showGenericModal: true,
                // genericModalCallback: () => {
                //   nav.replacePreviousAndPop({
                //     name: 'Feed',
                //   })
                // }
              })
            },
            onBack: () => {
              this._back.bind(this)
            },
          },
        }
      case 'TeamTasksView':
        return {
          component: Components.TeamTasksView,
          props: {
            teamTasks: this.state.currentTeamInfo.team.tasks,
            onNavToTask: (recipeId) => {
              // console.log(recipeId)
              nav.push({
                name: 'TaskView',
                recipeId: recipeId,
              })
            },
            onAddNewTask: (taskName) => {
              _.debounce(() => {
                // console.log(taskName);
                dispatch(actions.addTeamTask({name: taskName}))
              }, 25)()
            },
            onTaskCompletionNotification: (task) => {
              _.debounce(() => {
                // console.log("TASK: ", task);
                // var text = `{{author}} completed ${task.name}`;
                var msg = {
                  text: task.name,
                  type: 'taskCompletion',
                }
                dispatch(actions.completeTeamTask(msg, session.firstName))
              }, 25)()
            },
            onDeleteTeam: () => {
              _.debounce(() => {
                dispatch(actions.deleteTeam())
              }, 25)()
            },
            onUpdateTeamTask: (taskId, taskAttributes) => {
              _.debounce(() => {
                dispatch(actions.updateTeamTask(taskId, taskAttributes))
              }, 25)()
            },
          },
        }
      case 'TaskView':
        const task = _.filter(this.state.currentTeamInfo.team.tasks, {recipeId: route.recipeId})[0]
        return {
          component: Components.TaskView,
          props: {
            task: task,
            onUpdateTeamTask: (taskId, taskAttributes) => {
              _.debounce(() => {
                dispatch(actions.updateTeamTask(taskId, taskAttributes))
              }, 25)()
            },
            onDeleteTaskPop: () => {
              nav.pop()
            },
          },
        }
      case 'Feed':
        return {
          component: Components.Feed,
          props: {
            teamsUsers: teams.teamsUsers,
            messagesFetching: messages.isFetching,
            messages: this.state.currentTeamInfo.messages,
            onClearBadge: () => {
              dispatch(actions.updateInstallation({
                badge: 0,
              }))
            },
            onGetMoreMessages: () => {
              dispatch(actions.getTeamMessages(this.state.currentTeamInfo.team.id));
            },
            onCreateMessage: (msg) => {
              _.debounce(() => {
                dispatch(actions.createMessage(msg))
              }, 25)()
            },
            onNavToOrder: (orderId) => {
              let order = null
              let purveyor = null
              if(this.state.currentTeamInfo.orders.hasOwnProperty(orderId) === true){
                order = this.state.currentTeamInfo.orders[orderId]
                if(
                  order
                  && order.hasOwnProperty('purveyorId') === true
                  && this.state.currentTeamInfo.purveyors.hasOwnProperty(order.purveyorId) === true
                ){
                  purveyor = this.state.currentTeamInfo.purveyors[order.purveyorId]
                }
              }
              this.setState({
                orderId: orderId,
                order: order,
                purveyor: purveyor,
              }, () => {
                nav.push({
                  name: 'OrderView',
                })
              })
            },
          },
        }
      case 'PurveyorIndex':
        return {
          component: Components.PurveyorIndex,
          props: {
            selectedSegmentationIndex: 0,
            segmentationList: ['Purveyor', 'Category'],
            onSegmentationChange: (evt) => {
              const navValue = evt.nativeEvent.value
              switch(navValue){
                case 'Purveyor':
                  this.setState({
                    order: null,
                    orderId: null,
                    category: null,
                    purveyor: null,
                  })
                  // nav.replace({
                  //   name: 'PurveyorIndex',
                  // });
                  break;
                case 'Category':
                  this.setState({
                    order: null,
                    orderId: null,
                    category: null,
                    purveyor: null,
                  }, () => {
                    nav.replace({
                      name: 'CategoryIndex',
                    });
                  })
                  break;
                default:
                  // do nothing
                  break;
              }
            },
            purveyors: this.state.currentTeamInfo.purveyors,
            session: session,
            onNavToPurveyor: (purveyorId) => {
              const purveyor = this.state.currentTeamInfo.purveyors[purveyorId];
              this.setState({
                order: null,
                orderId: null,
                purveyor: purveyor,
                category: null,
                // specificProducts: _.sortBy(_.filter(this.state.currentTeamInfo.products, (product) => {
                //   return _.includes(product.purveyors, purveyor.id)
                // }), 'name')
              }, () => {
                nav.push({
                  name: 'PurveyorView'
                })
              })
            },
            onAddPurveyor: (name) => {
              dispatch(actions.addPurveyor(name))
            },
            onCreateProduct: this.onCreateProduct.bind(this, route, nav, null),
          },
        }
      case 'PurveyorView':

        let specificProductsPurveyor = null
        if(products.purveyors.hasOwnProperty(this.state.purveyor.id) === true){
          specificProductsPurveyor = _.sortBy(_.map(Object.keys(products.purveyors[this.state.purveyor.id]), (productId) => {
            const product = this.state.currentTeamInfo.products[productId]
            product.nameToLower = product.name.toLowerCase()
            return product
          }), 'nameToLower')
        } else {
          specificProductsPurveyor = _.sortBy(_.filter(this.state.currentTeamInfo.products, (product) => {
            product.nameToLower = product.name.toLowerCase()
            return _.includes(product.purveyors, this.state.purveyor.id)
          }), 'nameToLower')
        }

        // console.log(specificProductsPurveyor)

        let specificPurveyor = {}
        specificPurveyor[this.state.purveyor.id] = this.state.purveyor
        return {
          component: Components.PurveyorView,
          props: {
            actionType: this.props.actionType,
            cartItems: this.state.currentTeamInfo.cart,
            categories: this.state.currentTeamInfo.categories,
            purveyor: this.state.purveyor,
            // purveyors: this.state.currentTeamInfo.purveyors,
            purveyors: specificPurveyor,
            products: specificProductsPurveyor,
            onProductDelete: (productId) => {
              _.debounce(() => {
                dispatch(actions.deleteProduct(productId));
              }, 25)()
            },
            onProductEdit: this.onProductEdit.bind(this, route, nav),
            onUpdateProductInCart: (cartAction, cartAttributes) => {
              _.debounce(() => {
                switch(cartAction){
                  case actions.CART.DELETE:
                    dispatch(actions.deleteCartItem(cartAttributes))
                    break;
                  case actions.CART.UPDATE:
                    dispatch(actions.updateCartItem(cartAttributes))
                    break;
                  case actions.CART.ADD:
                  default:
                    dispatch(actions.addCartItem(cartAttributes))
                    break;
                }
              }, 25)()
            },
          },
        }
      // case 'ProductView':
      //   let purveyor = _.filter(purveyors.data, { id: route.purveyorId })[0]
      //   let product = _.filter(purveyor.products, { productId: route.productId })[0]
      //   return {
      //     component: Components.ProductView,
      //     props: {
      //       product: product,
      //       purveyorId: route.purveyorId,
      //       onUpdatePurveyorProduct: (purveyorId, productId, productAttributes) => {
      //         _.debounce(() => {
      //           dispatch(actions.updatePurveyorProduct(purveyorId, productId, productAttributes))
      //         }, 25)()
      //       },
      //       onDeleteProduct: () => {
      //         nav.pop()
      //       },
      //     },
      //   }
      case 'CategoryIndex':
        return {
          component: Components.CategoryIndex,
          props: {
            selectedSegmentationIndex: 1,
            segmentationList: ['Purveyor', 'Category'],
            onSegmentationChange: (evt) => {
              const navValue = evt.nativeEvent.value
              switch(navValue){
                case 'Purveyor':
                  this.setState({
                    order: null,
                    orderId: null,
                    category: null,
                    purveyor: null,
                  }, () => {
                    nav.replace({
                      name: 'PurveyorIndex',
                    });
                  })
                  break;
                case 'Category':
                  // nav.replace({
                  //   name: 'CategoryIndex',
                  // });
                  break;
                default:
                  // do nothing
                  break;
              }
            },
            products: this.state.currentTeamInfo.products,
            categories: this.state.currentTeamInfo.categories,
            onNavigateToCategory: (categoryId) => {
              const category = this.state.currentTeamInfo.categories[categoryId]
              this.setState({
                purveyor: null,
                order: null,
                orderId: null,
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
            },
            onCreateProduct: this.onCreateProduct.bind(this, route, nav, null),
          },
        }
      case 'CategoryView':
        const specificProductsCategory = _.sortBy(_.map(this.state.category.products, (productId) => {
          let product = this.state.currentTeamInfo.products[productId]
          product.nameToLower = product.name.toLowerCase()
          return product
        }), 'nameToLower')
        return {
          component: Components.CategoryView,
          props: {
            category: this.state.category,
            cartItems: this.state.currentTeamInfo.cart,
            products: specificProductsCategory,
            purveyors: this.state.currentTeamInfo.purveyors,
            onProductDelete: (productId) => {
              _.debounce(() => {
                dispatch(actions.deleteProduct(productId));
              }, 25)()
            },
            onProductEdit: this.onProductEdit.bind(this, route, nav),
            onUpdateProductInCart: (cartAction, cartAttributes) => {
              _.debounce(() => {
                switch(cartAction){
                  case actions.CART.DELETE:
                    dispatch(actions.deleteCartItem(cartAttributes))
                    break;
                  case actions.CART.UPDATE:
                    dispatch(actions.updateCartItem(cartAttributes))
                    break;
                  case actions.CART.ADD:
                  default:
                    dispatch(actions.addCartItem(cartAttributes))
                    break;
                }
              }, 25)()
            },
          },
        }
      case 'OrderIndex':
        // console.log(this.state.currentTeamInfo.orders["Tp3cqFkgne8Amznft"].confirm)
        let totalOrders = null
        if(
          this.state.currentTeamInfo.resources.hasOwnProperty('counts') === true
          && this.state.currentTeamInfo.resources.counts.hasOwnProperty('orders') === true
        ){
          totalOrders = this.state.currentTeamInfo.resources.counts.orders
        }
        return {
          component: Components.OrderIndex,
          props: {
            showConfirmedOrders: this.state.sceneState.OrderIndex.showConfirmedOrders,
            totalOrders: totalOrders,
            orderFetching: orders.isFetching,
            orders: this.state.currentTeamInfo.orders,
            cartItemsOrders: this.state.currentTeamInfo.cartItems['orders'],
            cartItems: cartItems.items,
            purveyors: this.state.currentTeamInfo.purveyors,
            teamsUsers: teams.teamsUsers,
            currentTeamUsers: this.state.currentTeamInfo.team.users,
            onProcessShowOrders: (showConfirmedOrders) => {
              const sceneState = Object.assign({}, this.state.sceneState);
              sceneState.OrderIndex.showConfirmedOrders = showConfirmedOrders;
              this.setState({
                sceneState: sceneState
              })
            },
            onNavToOrder: (orderId) => {
              const order = this.state.currentTeamInfo.orders[orderId]
              const purveyor = this.state.currentTeamInfo.purveyors[order.purveyorId]
              this.setState({
                orderId: orderId,
                order: order,
                purveyor: purveyor,
              }, () => {
                nav.push({
                  name: 'OrderView'
                })
              })
            },
            onGetMoreOrders: () => {
              dispatch(actions.getMoreTeamOrders());
            },
          },
        }
      case 'OrderView':
        if(order === null && this.state.orderId){
          order = this.state.currentTeamInfo.orders[orderId]
        }
        let purveyor = null
        if(order && order.hasOwnProperty('purveyorId') === true){
          purveyor = this.state.currentTeamInfo.purveyors[order.purveyorId]
        }
        return {
          component: Components.OrderView,
          props: {
            actionType: this.props.actionType,
            team: this.state.currentTeamInfo.team,
            userId: session.userId,
            userImgUrl: session.imageUrl,
            userName: session.firstName,
            orderId: orderId,
            orderFetching: orders.isFetching,
            order: order,
            purveyor: purveyor,
            products: orderProducts,
            teamsUsers: teams.teamsUsers,
            onNavToOrderContents: () => {
              this.setState({
                order: order,
                products: orderProducts,
                purveyor: purveyor,
              }, () => {
                nav.push({
                  name: 'OrderContentsView',
                })
              })
            },
            onUpdateOrder: (order) => {
              _.debounce(() => {
                dispatch(actions.updateOrder(order.id, order))
              }, 25)()
            },
            onNavToInvoices: (orderId) => {
              const order = this.state.currentTeamInfo.orders[orderId]
              const purveyor = this.state.currentTeamInfo.purveyors[order.purveyorId]
              this.setState({
                orderId: orderId,
                order: order,
                purveyor: purveyor,
              }, () => {
                if(order.hasOwnProperty('invoices') === true && order.invoices.length > 0){
                  nav.push({
                    name: 'OrderInvoices'
                  })
                } else {
                  nav.push({
                    name: 'OrderInvoiceUpload'
                  })
                }
              })
            },
            onGetOrderDetails: (orderId) => {
              dispatch(actions.getOrders([orderId]))
            }
          },
        }
      case 'OrderContentsView':
        return {
          component: Components.OrderContentsView,
          props: {
            order: this.state.order,
            purveyor: this.state.purveyor,
            products: orderProducts,
            userId: session.userId,
            userName: session.firstName,
            onProductEdit: this.onProductEdit.bind(this, route, nav),
            onConfirmOrderProduct: (updateCartItem) => {
              _.debounce(() => {
                dispatch(actions.updateCartItem({
                  id: updateCartItem.id,
                  teamId: updateCartItem.teamId,
                  purveyorId: updateCartItem.purveyorId,
                  orderId: this.state.order.id,
                  productId: updateCartItem.productId,
                  status: updateCartItem.status,
                  quantityReceived: updateCartItem.quantityReceived || updateCartItem.quantity,
                }))
              }, 25)()
            },
            onGetOrderDetails: (orderId) => {
              dispatch(actions.getOrders([orderId]))
            },
            onNavToInvoices: (orderId) => {
              const order = this.state.currentTeamInfo.orders[orderId]
              const purveyor = this.state.currentTeamInfo.purveyors[order.purveyorId]
              this.setState({
                orderId: orderId,
                order: order,
                purveyor: purveyor,
              }, () => {
                if(order.hasOwnProperty('invoices') === true && order.invoices.length > 0){
                  nav.push({
                    name: 'OrderInvoices'
                  })
                } else {
                  nav.push({
                    name: 'OrderInvoiceUpload'
                  })
                }
              })
            },
            onSendConfirmationMessage: (msg) => {
              _.debounce(() => {
                dispatch(actions.createMessage(msg))
              }, 25)()
            },
            onUpdateOrder: (order) => {
              _.debounce(() => {
                dispatch(actions.updateOrder(order.id, order))
              }, 25)()
            },
          },
        }
      case 'OrderInvoices':
        return {
          component: Components.OrderInvoices,
          props: {
            order: this.state.order,
          }
        }
      case 'OrderInvoiceUpload':
        return {
          component: Components.OrderInvoiceUpload,
          props: {
            order: this.state.order,
            onAddInvoices: (invoiceImages) => {
              const sceneStateOrderInvoiceUpload = Object.assign({}, this.state.sceneState);
              sceneStateOrderInvoiceUpload.OrderInvoiceUpload.invoiceImages = invoiceImages;
              this.setState({
                sceneState: sceneStateOrderInvoiceUpload,
              })
            }
          }
        }
      case 'Profile':
        return {
          component: Components.ProfileView,
          props: {
            session: session,
            onUpdateInfo: (data) => {
              _.debounce(() => {
                // console.log("DATA", data);
                // this.setState({
                //   firstName: data.firstName,
                //   lastName: data.lastName,
                //   email: data.email,
                // })
                dispatch(actions.updateSession(data))
                dispatch(actions.receiveSessionTeamsUser(data))
              }, 25)()
            },
            onUpdateAvatar: (image) => {
              _.debounce(() => {
                // console.log("IMAGE", image);
                dispatch(actions.updateSession({
                  imageData: image.data,
                  // imageUrl: image.uri,
                }));
              }, 25)()
            },
            onStoreImages: (data) => {
              nav.push({
                name: 'ImageGallery',
                photos: data,
              });
            },
            onLogout: () => {
              dispatch(actions.logout())
            }
          },
        }
      case 'ProductForm':
        return {
          component: Components.ProductForm,
          props: {
            productCategory: this.state.category,
            fromPurveyorId: this.state.purveyor ? this.state.purveyor.id : null,
            product: this.state.product,
            team: this.state.currentTeamInfo.team,
            categories: this.state.currentTeamInfo.categories,
            purveyors: this.state.currentTeamInfo.purveyors,
            onProcessProduct: (productAttributes) => {
              const cartPurveyorIds = Object.keys(this.state.currentTeamInfo.cartItems.cart)
              let productFormCartItem = null
              if(cartPurveyorIds.length > 0){
                cartPurveyorIds.forEach((purveyorId) => {
                  if(
                    this.state.product !== null
                    && this.state.product.purveyors.indexOf(purveyorId) !== -1
                    && this.state.currentTeamInfo.cart[purveyorId].hasOwnProperty(this.state.product.id) === true
                  ) {
                    productFormCartItem = this.state.currentTeamInfo.cart[purveyorId][this.state.product.id];
                  }
                })
              }
              const sceneState = Object.assign({}, this.state.sceneState);
              const existingProductAttributes = Object.assign({}, sceneState.ProductForm.productAttributes);
              sceneState.ProductForm.cartItem = productFormCartItem;
              sceneState.ProductForm.submitReady = true;
              sceneState.ProductForm.productAttributes = Object.assign({}, existingProductAttributes, productAttributes);
              this.setState({
                sceneState: sceneState
              })
            },
            onProductNotReady: () => {
              const sceneState = Object.assign({}, this.state.sceneState);
              sceneState.ProductForm.submitReady = false;
              this.setState({
                sceneState: sceneState
              })
            },
          },
        }
      case 'UserInfo':
        return {
          component: Components.UserInfo,
          props: {
            session: session,
            onUpdateInfo: (data) => {
              _.debounce(() => {
                dispatch(actions.updateSession(data));
                if(session.teamId === null) {
                  const teamName = `${data.firstName}'s Team`
                  const demoTeam = true
                  dispatch(actions.addTeam(teamName, demoTeam));
                }
              }, 25)()
            },
          },
        }
      case 'UserTeam':
        return {
          component: Components.UserTeam,
          props: {
            session: session,
            onCreateTeam: (teamName) => {
              _.debounce(() => {
                dispatch(actions.addTeam(teamName));
              }, 25)()
            },
            onSearchForTeam: () => {
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
            },
          },
        }
      case 'InviteView':
        return {
          component: Components.InviteView,
          props: {
            contacts: contacts.data,
            isFetching: contacts.isFetching,
            denied: contacts.contactsPermissionDenied,
            getContacts: () => {
              dispatch(actions.getContacts())
            },
            onSMSInvite: (contacts) => {
              if (contacts.length === 0)
                return

              _.debounce(() => {
                const contactList = _.map(contacts, 'number')
                dispatch(actions.inviteContacts(contactList))
              }, 25)()

              let invitees = _.pluck(contacts,'firstName').toString().replace(/,/g , ', ')

              let msg = {
                text: `${session.firstName} invited to ${this.props.teams.currentTeam.name}: ${invitees}`
              }

              let author = 'Sous'
              let imageUrl = Urls.msgLogo

              _.debounce(() => {
                dispatch(actions.createMessage(msg, author, imageUrl))
              }, 25)()
              nav.replacePreviousAndPop({
                name: 'Feed',
              });
            },
          },
        }
      case 'CartView':
        const cartPurveyorIds = Object.keys(this.state.currentTeamInfo.cartItems['cart'])
        let cartPurveyors = _.sortBy(_.map(cartPurveyorIds, (purveyorId) => {
          return this.state.currentTeamInfo.purveyors[purveyorId]
        }), 'name')
        cartPurveyors = _.filter(cartPurveyors,(purveyor) => {
          return (purveyor) ? true : false
        })
        return {
          component: Components.CartView,
          props: {
            // team: this.state.currentTeamInfo.team,
            offlineQueueCount: Object.keys(offline.queue).length,
            teamBetaAccess: this.state.currentTeamInfo.betaAccess,
            onProductEdit: this.onProductEdit.bind(this, route, nav),
            cartItems: this.state.currentTeamInfo.cart,
            cartPurveyors: cartPurveyors,
            products: this.state.currentTeamInfo.products,
            onUpdateProductInCart: (cartAction, cartAttributes) => {
              _.debounce(() => {
                switch(cartAction){
                  case actions.CART.DELETE:
                    dispatch(actions.deleteCartItem(cartAttributes))
                    break;
                  case actions.CART.UPDATE:
                  default:
                    dispatch(actions.updateCartItem(cartAttributes))
                    break;
                }
              }, 25)()
            },
            onSendCart: (cartInfo, navigateToFeed) => {

              NetInfo.isConnected.fetch().then((isConnected) => {
                if(isConnected === true){
                  _.debounce(() => {
                    dispatch(actions.sendCart(cartInfo));
                  }, 25)()
                  if(navigateToFeed === true){
                    nav.replacePreviousAndPop({
                      name: 'Feed',
                    });
                  }
                } else {
                  dispatch(actions.createError('network-connectivity', 'Please check that your device is connected to the internet and try again'))
                }
              })

            },
          },
        }
      case 'Loading':
        return {
          component: Components.Loading
        }
      case 'TeamView':
        return {
          component: Components.TeamView,
          props: {
            settingsConfig: settingsConfig,
            userId: session.userId,
            teamsUsers: teams.teamsUsers,
            currentTeamUsers: this.state.currentTeamInfo.team.users,
            onHandlePress: (type, value) => {
              if(type === 'call') {
                Communications.phonecall(value, true)
              } else if(type === 'email'){
                const to = [value]
                const cc = null
                const subject = null
                const body = null
                Communications.email(to, cc, null, subject, body)
              }
            },
          },
        }
      default:
        return;
    }
  }

  getNavBar(route, nav) {
    const { dispatch, teams, session, connect } = this.props;

    let navBar = null;
    let nextItem = <View />;

    // setup the header for unauthenticated routes
    if(this.authenticatedRoute(route) === false){
      navBar = <View />
    } else {
      switch(route.name) {
        case 'OrderGuide':
          navBar = React.cloneElement(this.navBar, {
            navigator: nav,
            route: route,
            buttonsColor: Colors.greyText,
            customPrev: (
              <Components.NavBackButton iconFont={'material|close'} />
            ),
            // title: 'Order Guide',
            customTitle: (
              <TextComponents.NavBarTitle
                content={'Order Guide'}
              />
            ),
            hideNext: true,
          })
          break;
        case 'OrderGuideLoading':
          navBar = React.cloneElement(this.navBar, {
            navigator: nav,
            route: route,
            buttonsColor: Colors.greyText,
            customPrev: (
              <Components.NavBackButton iconFont={'material|close'} />
            ),
            // title: 'Order Guide',
            customTitle: (
              <TextComponents.NavBarTitle
                content={'Order Guide'}
              />
            ),
            hideNext: true,
          })
          break;
        case 'OrderGuideUpload':
          navBar = React.cloneElement(this.navBar, {
            navigator: nav,
            route: route,
            // title: 'Order Guide Upload',
            customTitle: (
              <TextComponents.NavBarTitle
                content={'Order Guide Upload'}
              />
            ),
            hideNext: true,
            customPrev: (
              <Components.NavBackButton pop={true} />
            ),
          })
          break;
        case 'TeamIndex':
          navBar = React.cloneElement(this.navBar, {
            navigator: nav,
            route: route,
            hidePrev: false,
            buttonsColor: Colors.greyText,
            customPrev: (
              <Components.NavBackButton iconFont={'material|close'} />
            ),
            // title: 'Switch Teams',
            customTitle: (
              <TextComponents.NavBarTitle
                content={'Switch Teams'}
              />
            ),
          })
          break;
        case 'Feed':
          navBar = React.cloneElement(this.navBar, {
            navigator: nav,
            route: route,
            hidePrev: false,
            // title: this.state.currentTeamInfo.team ? this.state.currentTeamInfo.team.name : 'Sous',
            customTitle: (
              <TextComponents.NavBarTitle
                content={this.state.currentTeamInfo.team ? this.state.currentTeamInfo.team.name : 'Sous'}
              />
            ),
            titleColor: 'black',
            customPrev: (
              <Components.FeedViewLeftButton
                disabled={(this.state.currentTeamInfo.team === null)}
              />
            ),
          })
          break;
        case 'PurveyorIndex':
          navBar = React.cloneElement(this.navBar, {
            navigator: nav,
            route: route,
            customPrev: (
              <Components.NavBackButton iconFont={'material|close'} />
            ),
            // title: 'Order Guide',
            customTitle: (
              <TextComponents.NavBarTitle
                content={'Order Guide'}
              />
            ),
            customNext: (
              <Components.CartRightButton
                onNavToCart={() => {
                  nav.push({ name: 'CartView', });
                }}
                onCreateProduct={this.onCreateProduct.bind(this, route, nav, null)}
                cartItems={this.state.currentTeamInfo.cart}
              />
            )
          })
          break;
        case 'TeamTasksView':
          navBar = React.cloneElement(this.navBar, {
            navigator: nav,
            route: route,
            buttonsColor: Colors.greyText,
            // title: this.state.currentTeamInfo.team.name,
            customTitle: (
              <TextComponents.NavBarTitle
                content={this.state.currentTeamInfo.team.name}
              />
            ),
            customPrev: (
              <Components.NavBackButton iconFont={'material|close'} />
            ),
          })
          break;
        case 'PurveyorView':
          navBar = React.cloneElement(this.navBar, {
            navigator: nav,
            route: route,
            customPrev: (
              <Components.NavBackButton
                iconFont={'material|chevron-left'}
                pop={true}
              />
            ),
            // title: this.state.purveyor.name.substr(0,20) + (this.state.purveyor.name.length > 20 ? '...' : ''),
            customTitle: (
              <TextComponents.NavBarTitle
                content={this.state.purveyor.name.substr(0,20) + (this.state.purveyor.name.length > 20 ? '...' : '')}
              />
            ),
            customNext: (
              <Components.CartRightButton
                onNavToCart={() => {
                  nav.push({ name: 'CartView', });
                }}
                onCreateProduct={this.onCreateProduct.bind(this, route, nav, null)}
                cartItems={this.state.currentTeamInfo.cart}
              />
            )
          })
          break;
        case 'CategoryIndex':
          navBar = React.cloneElement(this.navBar, {
            navigator: nav,
            route: route,
            hidePrev: false,
            buttonsColor: Colors.greyText,
            customPrev: (
              <Components.NavBackButton iconFont={'material|close'} />
            ),
            // title: 'Order Guide',
            customTitle: (
              <TextComponents.NavBarTitle
                content={'Order Guide'}
              />
            ),
            customNext: (
              <Components.CartRightButton
                onNavToCart={() => {
                  nav.push({ name: 'CartView', });
                }}
                onCreateProduct={this.onCreateProduct.bind(this, route, nav, null)}
                cartItems={this.state.currentTeamInfo.cart}
              />
            )
          })
          break;
        case 'CategoryView':
          navBar = React.cloneElement(this.navBar, {
            navigator: nav,
            route: route,
            customPrev: (
              <Components.NavBackButton
                navName='CategoryIndex'
                iconFont={'material|chevron-left'}
              />
            ),
            // title: this.state.category.name,
            customTitle: (
              <TextComponents.NavBarTitle
                content={this.state.category.name || ''}
              />
            ),
            customNext: (
              <Components.CartRightButton
                onNavToCart={() => {
                  nav.push({ name: 'CartView', });
                }}
                onCreateProduct={this.onCreateProduct.bind(this, route, nav, this.state.category)}
                cartItems={this.state.currentTeamInfo.cart}
              />
            )
          })
          break;
        case 'OrderIndex':
          navBar = React.cloneElement(this.navBar, {
            navigator: nav,
            route: route,
            hidePrev: false,
            buttonsColor: Colors.greyText,
            customPrev: (
              <Components.NavBackButton iconFont={'material|close'} />
            ),
            customTitle: (
              <TextComponents.NavBarTitle
                content="Receiving Guide"
              />
            ),
            hideNext: true,
          })
          break;
        case 'OrderView':
          navBar = React.cloneElement(this.navBar, {
            navigator: nav,
            route: route,
            customPrev: (
              <Components.NavBackButton
                pop={true}
                iconFont={'material|chevron-left'}
              />
            ),
            customTitle: (
              <TextComponents.NavBarTitle
                content={'Order'}
              />
            ),
          })
          break;
        case 'OrderContentsView':
          navBar = React.cloneElement(this.navBar, {
            navigator: nav,
            route: route,
            customPrev: (
              <Components.NavBackButton
                pop={true}
                iconFont={'material|chevron-left'}
              />
            ),
            customTitle: (
              <TextComponents.NavBarTitle
                content={'Order Contents'}
              />
            ),
          })
          break;
        case 'OrderInvoices':
          let titleOrderInvoices = 'Processing'
          if(this.state.purveyor !== null){
            titleOrderInvoices = this.state.purveyor.name.substr(0,12) + (this.state.purveyor.name.length > 12 ? '...' : '')
          }
          navBar = React.cloneElement(this.navBar, {
            navigator: nav,
            route: route,
            customPrev: (
              <Components.NavBackButton
                pop={true}
                iconFont={'material|chevron-left'}
              />
            ),
            customTitle: (
              <TextComponents.NavBarTitle
                content={titleOrderInvoices}
              />
            ),
            customNext: (
              <Components.InvoicesRightButton
                onNavtoUploadInvoices={(orderId) => {
                  nav.push({
                    name: 'OrderInvoiceUpload'
                  })
                }}
              />
            )
          })
          break;
        case 'OrderInvoiceUpload':
          const displayInvoicedUploadButton = this.state.sceneState.OrderInvoiceUpload.invoiceImages.length > 0 ? true : false;


          navBar = React.cloneElement(this.navBar, {
            navigator: nav,
            route: route,
            customPrev: (
              <Components.NavBackButton
                pop={true}
                iconText={'Cancel'}
              />
            ),
            customTitle: (
              <TextComponents.NavBarTitle
                content={'Upload Invoice/Photo'}
              />
            ),
            customNext: (
              <Components.InvoicesUploadRightButton
                uploadReady={displayInvoicedUploadButton}
                onUploadInvoices={() => {
                  if(this.state.sceneState.OrderInvoiceUpload.invoiceImages.length > 0){
                    const invoiceImages = Object.assign({}, this.state.sceneState.OrderInvoiceUpload.invoiceImages)
                    dispatch(actions.updateOrderInvoices(this.state.order.id, {
                      invoiceImages: invoiceImages
                    }))
                    this.setState({
                      sceneState: Object.assign({}, this.state.sceneState, {
                        OrderInvoiceUpload: {
                          invoiceImages: []
                        }
                      })
                    }, () => {
                      nav.replacePreviousAndPop({
                        name: 'OrderInvoices'
                      })
                    })
                  }
                }}
              />
            )
          })
          break;
        // case 'ProductView':
        //   navBar = React.cloneElement(this.navBar, {
        //     navigator: nav,
        //     route: route,
        //     onNext: null,
        //     hidePrev: false,
        //   })
        //   break;
        case 'Profile':
          navBar = React.cloneElement(this.navBar, {
            navigator: nav,
            route: route,
            hidePrev: false,
            customPrev: (
              <Components.NavBackButton
                iconFont={'material|chevron-left'}
              />
            ),
            // title: 'Account',
            customTitle: (
              <TextComponents.NavBarTitle
                content={'Account'}
              />
            ),
          })
          break;
        case 'InviteView':
          navBar = React.cloneElement(this.navBar, {
            navigator: nav,
            route: route,
            customPrev: (
              <Components.NavBackButton
                iconFont={'material|close'}
              />
            ),
            // title: 'Invite Teammates',
            customTitle: (
              <TextComponents.NavBarTitle
                content={'Invite Teammates'}
              />
            ),
          })
          break;
        case 'CartView':
          navBar = React.cloneElement(this.navBar, {
            navigator: nav,
            route: route,
            customPrev: (
              <Components.NavBackButton
                pop={true}
                iconFont={'material|chevron-left'}
              />
            ),
            // title: 'Cart',
            customTitle: (
              <TextComponents.NavBarTitle
                content={'Cart'}
              />
            ),
          })
          break;
        case 'ProductForm':
          navBar = React.cloneElement(this.navBar, {
            ref: 'navBar',
            navigator: nav,
            route: route,
            customPrev: (
              <Components.NavBackButton
                iconFont={'material|close'}
                pop={true}
              />
            ),
            // title: (this.state.product === null) ? 'Add New Product' : 'Edit Product',
            customTitle: (
              <TextComponents.NavBarTitle
                content={(this.state.product === null) ? 'Add New Product' : 'Edit Product'}
              />
            ),
            customNext: (
              <Components.ProductFormRightCheckbox
                submitReady={this.state.sceneState.ProductForm.submitReady}
                onProcessProduct={() => {
                  _.debounce(() => {
                    const {productId, productAttributes} = this.state.sceneState.ProductForm
                    if(productId === null){
                      dispatch(actions.addProduct(productAttributes))
                      dispatch(actions.getTeamResourceInfo(this.state.currentTeamInfo.team.id))
                    } else {
                      dispatch(actions.updateProduct(productId, productAttributes))
                    }
                    if(this.state.sceneState.ProductForm.cartItem){
                      const cartItemPurveyorId = this.state.sceneState.ProductForm.cartItem.purveyorId
                      if(productAttributes.purveyors.indexOf(cartItemPurveyorId) === -1){
                        dispatch(actions.deleteCartItem(this.state.sceneState.ProductForm.cartItem))
                      }
                    }
                    nav.replacePreviousAndPop({
                      name: route.newRoute,
                    });
                  }, 5)()
                }}
              />
            ),
          })
          break;
        case 'TeamView':
          navBar = React.cloneElement(this.navBar, {
            navigator: nav,
            route: route,
            customPrev: (
              <Components.NavBackButton
                iconFont={'material|close'}
                pop={true}
              />
            ),
            // title: 'Team Members',
            customTitle: (
              <TextComponents.NavBarTitle
                content={'Team Members'}
              />
            ),
            customNext: (
              <Components.TeamViewRightInvite
                connected={(connect.status === actions.CONNECT.CONNECTED)}
                navigateToInviteView={() => {
                  nav.push({
                    name: 'InviteView',
                  })
                }}
              />
            ),
          })
          break;
        case 'session/onboarding':
        case 'UserInfo':
        case 'UserTeam':
        case 'Loading':
        case 'Update':
          navBar = null;
          break;
        default:
          navBar = React.cloneElement(this.navBar, {
            hidePrev: false,
            navigator: nav,
            route: route,
            onNext: null,
            customPrev: (
              <Components.NavBackButton pop={true} />
            ),
          })
          break;
      }
    }
    return navBar;
  }

  renderScene(route, nav) {
    const { dispatch, session, teams, messages, purveyors, products, categories, errors, connect } = this.props;

    route = this.getRoute(route, nav);

    let navBar = this.getNavBar(route, nav);
    const sceneAttrs = this.getScene(route, nav);
    let sceneComponentProps = sceneAttrs.props || {};
    sceneComponentProps.connected = (connect.status === actions.CONNECT.CONNECTED);
    let scene = React.createElement(sceneAttrs.component || View, sceneComponentProps, sceneAttrs.children || null);

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

    const genericModalDismiss = () => {
      const cb = this.state.genericModalCallback();
      this.setState({
        genericModalMessage: '',
        showGenericModal: false,
        genericModalCallback: () => {}
      }, cb);
    }
    const genericModal = (
      <ModalComponents.GenericModal
        modalVisible={this.state.showGenericModal}
        onHideModal={genericModalDismiss}
        leftButton={{
          text: 'Ok',
          onPress: genericModalDismiss
        }}
      >
        {this.state.genericModalMessage}
      </ModalComponents.GenericModal>
    )

    let CustomSideView = View
    let menu = <View />
    const noSideMenuRoutes = [
      'Signup',
      'UserInfo',
      'UserTeam',
      'session/onboarding',
      'Loading',
    ]

    // if(this.state.isAuthenticated === true && this.state.currentTeamInfo.team !== null && session.viewedOnboarding === true){
    if(noSideMenuRoutes.indexOf(route.name) === -1){
      CustomSideView = SideMenu
      menu = (
        <Components.Menu
          connected={(connect.status === actions.CONNECT.CONNECTED)}
          ref='menu'
          team={this.state.currentTeamInfo.team}
          session={session}
          open={this.state.open}
          onNavToPurveyor={() => {
            if(this.state.currentTeamInfo.resources.hasOwnProperty('lastUpdated') === true){
              const resourcesLastUpdated = this.state.currentTeamInfo.resources.lastUpdated
              // console.log('update? ', resourcesLastUpdated.categories, this.state.currentTeamInfo.lastUpdated.categories, moment(resourcesLastUpdated.categories).diff(this.state.currentTeamInfo.lastUpdated.categories), (60*1000))
              if(
                resourcesLastUpdated.hasOwnProperty('categories') === true
                && moment(resourcesLastUpdated.categories).diff(this.state.currentTeamInfo.lastUpdated.categories) > 0
              ) {
                // console.log('Dispatching get categories...')
                dispatch(actions.getCategories(session.teamId))
              }
            }
            this.setState({
              order: null,
              orderId: null,
            }, () => {
              nav.push({ name: 'PurveyorIndex', })
            })
          }}
          onNavToOrders={() => {
            nav.push({ name: 'OrderIndex', })
          }}
          onNavToProfile={() => {
            nav.push({ name: 'Profile', })
          }}
          onNavToTeam={() => {
            nav.push({ name: 'TeamTasksView', })
          }}
          onNavToTeamView={() => {
            nav.push({ name: 'TeamView', })
          }}
          onNavToTeamIndex={() => {
            nav.push({ name: 'TeamIndex', })
          }}
        />
      );
    }

    let connectionStatus = null
    if(connect.status === actions.CONNECT.OFFLINE){
      let reconnectText = `reconnecting in ${Math.floor(this.state.connectionStats.reconnect/1000)}s`
      // if(this.state.connectionStats.attempt === 0 || this.state.connectionStats.reconnect === 0){
      //   reconnectText = 'connecting...'
      // }
      connectionStatus = (
        <TouchableHighlight
          onPress={() => {
            this.setState({
              genericModalMessage: (
                <TextComponents.LearnMoreMessage />
              ),
              showGenericModal: true,
            })
          }}
          underlayColor='transparent'
        >
          <View style={styles.offlineContainer}>
            <View style={styles.offlineInnerContainer}>
              <Icon name='material|info' size={20} color={'white'} style={styles.offlineIcon} />
              <Text style={styles.offlineText}>Connection offline, {reconnectText}</Text>
            </View>
          </View>
        </TouchableHighlight>
      )
    }
    let reactStatus = null
    if(this.state.networkConnected === false){
      reactStatus = (
        <View style={[styles.offlineContainer, {backgroundColor: Colors.error}]}>
          <View style={styles.offlineInnerContainer}>
            <Text style={[styles.offlineText, {paddingTop: 3,}]}>Network connectivity issues</Text>
          </View>
        </View>
      )
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
          {genericModal}
          {connectionStatus}
          {reactStatus}
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
    paddingTop: 20,
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
  offlineContainer: {
    width: window.width,
    height: 32,
    backgroundColor: Colors.darkGrey,
  },
  offlineInnerContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    padding: 4,
  },
  offlineText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'OpenSans',
    fontSize: 12,
  },
  offlineIcon: {
    width: 24,
    height: 24,
    marginLeft: 12
  }
})

function mapStateToProps(state) {
  return {
    cartItems: state.cartItems,
    categories: state.categories,
    connect: state.connect,
    contacts: state.contacts,
    errors: state.errors,
    messages: state.messages,
    orders: state.orders,
    products: state.products,
    purveyors: state.purveyors,
    session: state.session,
    settingsConfig: state.settingsConfig,
    teams: state.teams,
    offline: state.offline,
    actionType: state.actionType,
  }
}

// --// connect(mapStateToProps, mapDispatchToProps, mergeProps, options = {})
export default connect(mapStateToProps)(App);
// export default App;
