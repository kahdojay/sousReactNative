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
import DeviceUUID from 'react-native-device-uuid';
import Device from 'react-native-device';
import KeyboardSpacer from 'react-native-keyboard-spacer';

const {
  Navigator,
  PropTypes,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

class App extends React.Component {
  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      connectionStats: {
        attempt: 0,
        reconnect: 0,
      },
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
          productAttributes: {},
        },
        OrderIndex: {
          showConfirmedOrders: false,
        },
        SearchView: {
          hideHeader: false,
        }
      },
      currentTeamInfo: {
        team: this.props.teams.currentTeam,
        purveyors: {},
        categories: {},
        products: {},
        orders: {},
        cartItems: {'cart':{}, 'orders':{}},
        messages: {},
        lastUpdated: {
          purveyors: null,
          categories: null,
          products: null,
          orders: null,
          messages: null,
        }
      }
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
    let currentTeamInfo = Object.assign({}, this.state.currentTeamInfo)
    currentTeamInfo.team = nextProps.teams.currentTeam
    if(currentTeamInfo.team !== null){
      if(nextProps.purveyors.teams.hasOwnProperty(currentTeamInfo.team.id) === true){
        currentTeamInfo.purveyors = nextProps.purveyors.teams[currentTeamInfo.team.id]
      } else {
        currentTeamInfo.purveyors = {}
      }
      currentTeamInfo.lastUpdated.purveyors = nextProps.purveyors.lastUpdated;
      if(nextProps.categories.teams.hasOwnProperty(currentTeamInfo.team.id) === true){
        currentTeamInfo.categories = nextProps.categories.teams[currentTeamInfo.team.id]
      } else {
        currentTeamInfo.categories = {}
      }
      currentTeamInfo.lastUpdated.categories = nextProps.categories.lastUpdated;
      if(nextProps.products.teams.hasOwnProperty(currentTeamInfo.team.id) === true){
        currentTeamInfo.products = nextProps.products.teams[currentTeamInfo.team.id]
      } else {
        currentTeamInfo.products = {}
      }
      currentTeamInfo.lastUpdated.products = nextProps.products.lastUpdated;
      if(nextProps.messages.teams.hasOwnProperty(currentTeamInfo.team.id) === true){
        currentTeamInfo.messages = nextProps.messages.teams[currentTeamInfo.team.id]
      } else {
        currentTeamInfo.messages = {}
      }
      currentTeamInfo.lastUpdated.messages = nextProps.messages.lastUpdated;
      if(nextProps.cartItems.teams.hasOwnProperty(currentTeamInfo.team.id) === true){
        currentTeamInfo.cartItems = nextProps.cartItems.teams[currentTeamInfo.team.id]
      } else {
        currentTeamInfo.cartItems = {'cart': {},'orders': {}}
      }
      currentTeamInfo.lastUpdated.cartItems = nextProps.cartItems.lastUpdated;
      if(nextProps.orders.teams.hasOwnProperty(currentTeamInfo.team.id) === true){
        currentTeamInfo.orders = nextProps.orders.teams[currentTeamInfo.team.id]
        // console.log('cWRP: ', nextProps.orders.teams[currentTeamInfo.team.id]["Tp3cqFkgne8Amznft"].confirm)
      } else {
        currentTeamInfo.orders = {}
      }
      currentTeamInfo.lastUpdated.orders = nextProps.orders.lastUpdated;
    }
    let connectionStats = Object.assign({}, this.state.connectionStats)
    let reconnectCountDown = false
    if(nextProps.connect.attempt !== connectionStats.attempt){
      connectionStats.attempt = nextProps.connect.attempt
      connectionStats.reconnect = nextProps.connect.timeoutMilliseconds
      reconnectCountDown = true
    }
    this.setState({
      connectionStats: connectionStats,
      installationRegistered: nextProps.connect.installationRegistered,
      isAuthenticated: nextProps.session.isAuthenticated,
      firstName: nextProps.session.firstName,
      lastName: nextProps.session.lastName,
      currentTeamInfo: currentTeamInfo,
    }, () => {
      if(reconnectCountDown === true){
        this.countDownReconnect()
        // console.log('here')
      }
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
      } else if(this.refs.appNavigator.getCurrentRoutes()[0].name === 'session/onboarding'){
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
      if (this.state.installationRegistered !== true && connect.status === actions.CONNECT.CONNECTED) {
        PushManager.requestPermissions((err, data) => {
          if (err) {
            dispatch(actions.registerInstallationError())
          } else {
            // if(userDoesNotAllow === true){
            //   dispatch(actions.registerInstallationDeclined())
            // }
            // if(data.hasOwnProperty('token') && data.token.indexOf('Error') === -1){
            if(data.hasOwnProperty('token')){
              dispatch(actions.registerInstallation({
                token: data.token,
                model: Device.model,
                deviceName: Device.deviceName,
                systemName: Device.systemName,
                systemVersion: Device.systemVersion,
              }))
            } else {
              dispatch(actions.registerInstallationError())
            }
          }
        });
      }
    }

    if(this.refs.appNavigator){
      const routeName = this.refs.appNavigator.getCurrentRoutes()[0].name

      // execute this condition to check certain routes when teams are present
      const checkRoutesForTeamsPresent = ['Loading','UserTeam']
      if(checkRoutesForTeamsPresent.indexOf(routeName) !== -1){
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

  onCreateProduct(route, nav) {
    const sceneState = Object.assign({}, this.state.sceneState);
    sceneState.ProductForm.submitReady = false;
    sceneState.ProductForm.productId = null
    sceneState.ProductForm.productAttributes = {}
    this.setState({
      sceneState: sceneState,
      category: null,
      product: null,
    }, () => {
      nav.push({
        name: 'ProductForm'
      })
    })
  }

  onProductEdit(route, nav, product) {
    let productCategory = null
    Object.keys(this.state.currentTeamInfo.categories).forEach((categoryId) => {
      const category = this.state.currentTeamInfo.categories[categoryId]
      if(category.products.indexOf(product.id) !== -1){
        productCategory = category
      }
    })
    const sceneState = Object.assign({}, this.state.sceneState);
    sceneState.ProductForm.submitReady = true;
    sceneState.ProductForm.productId = product.id
    sceneState.ProductForm.productAttributes = {
      name: product.name,
      purveyors: product.purveyors,
      amount: product.amount,
      unit: product.unit,
      previousCategoryId: productCategory.id,
      categoryId: productCategory.id,
    }
    this.setState({
      sceneState: sceneState,
      category: productCategory,
      product: product,
    }, () => {
      nav.push({
        name: 'ProductForm'
      })
    })
  }

  getScene(route, nav) {
    const { session, teams, messages, dispatch, purveyors, products, categories, errors, connect, settingsConfig } = this.props;

    switch (route.name) {
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
                // dispatch(actions.resetPurveyors());
                dispatch(actions.setCurrentTeam(teamId));
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
      case 'TeamView':
        return {
          component: Components.TeamView,
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
                "badge": 0
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
              const order = this.state.currentTeamInfo.orders[orderId]
              const purveyor = this.state.currentTeamInfo.purveyors[order.purveyorId]
              this.setState({
                order: order,
                purveyor: purveyor,
              },() => {
                nav.push({
                  name: 'OrderView'
                })
              })
            },
          },
        }
      case 'PurveyorIndex':
        return {
          component: Components.PurveyorIndex,
          props: {
            selectedSegmentationIndex: 1,
            segmentationList: ['Category', 'Purveyor', 'Search'],
            onSegmentationChange: (evt) => {
              const navValue = evt.nativeEvent.value
              switch(navValue){
                case 'Search':
                  nav.replace({
                    name: 'SearchView'
                  })
                  break
                case 'Purveyor':
                  // nav.replace({
                  //   name: 'PurveyorIndex',
                  // });
                  break;
                case 'Category':
                  nav.replace({
                    name: 'CategoryIndex',
                  });
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
            },
            onAddPurveyor: (name) => {
              dispatch(actions.addPurveyor(name))
            },
            onCreateProduct: this.onCreateProduct.bind(this, route, nav),
          },
        }
      case 'PurveyorView':
        // let purveyor = this.state.currentTeamInfo.purveyors[route.purveyorId]
        // let products = _.filter(this.state.currentTeamInfo.products, (product) => {
        //   return _.includes(product.purveyors, purveyor.id)
        // })
        const specificProductsPurveyor = _.sortBy(_.filter(this.state.currentTeamInfo.products, (product) => {
          return _.includes(product.purveyors, this.state.purveyor.id)
        }), 'name')
        return {
          component: Components.PurveyorView,
          props: {
            cartItems: this.state.currentTeamInfo.cartItems['cart'],
            categories: this.state.currentTeamInfo.categories,
            purveyor: this.state.purveyor,
            // purveyors: this.state.currentTeamInfo.purveyors,
            purveyors: [this.state.purveyor],
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
            selectedSegmentationIndex: 0,
            segmentationList: ['Category', 'Purveyor', 'Search'],
            onSegmentationChange: (evt) => {
              const navValue = evt.nativeEvent.value
              switch(navValue){
                case 'Search':
                  nav.replace({
                    name: 'SearchView'
                  })
                  break
                case 'Purveyor':
                  nav.replace({
                    name: 'PurveyorIndex',
                  });
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
            onCreateProduct: this.onCreateProduct.bind(this, route, nav),
          },
        }
      case 'CategoryView':
        const specificProductsCategory = _.sortBy(_.map(this.state.category.products, (productId) => {
          const product = this.state.currentTeamInfo.products[productId]
          return product
        }), 'name')
        return {
          component: Components.CategoryView,
          props: {
            category: this.state.category,
            cartItems: this.state.currentTeamInfo.cartItems['cart'],
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
      case 'SearchView':
        return {
          component: Components.SearchView,
          props: {
            selectedSegmentationIndex: 2,
            segmentationList: ['Category', 'Purveyor', 'Search'],
            onSegmentationChange: (evt) => {
              const navValue = evt.nativeEvent.value
              switch(navValue){
                case 'Search':
                  // nav.replace({
                  //   name: 'SearchView'
                  // })
                  break
                case 'Purveyor':
                  nav.replace({
                    name: 'PurveyorIndex',
                  });
                  break;
                case 'Category':
                  nav.replace({
                    name: 'CategoryIndex',
                  });
                  break;
                default:
                  // do nothing
                  break;
              }
            },
            products: this.state.currentTeamInfo.products,
            cartItems: this.state.currentTeamInfo.cartItems['cart'],
            purveyors: this.state.currentTeamInfo.purveyors,
            categories: this.state.currentTeamInfo.categories,
            onCreateProduct: this.onCreateProduct.bind(this, route, nav),
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
            onHideHeader: (hideHeader) => {
              const sceneState = Object.assign({}, this.state.sceneState);
              sceneState.SearchView.hideHeader = hideHeader;
              this.setState({
                sceneState: sceneState,
              })
            },
          },
        }
      case 'OrderIndex':
        // console.log(this.state.currentTeamInfo.orders["Tp3cqFkgne8Amznft"].confirm)
        return {
          component: Components.OrderIndex,
          props: {
            showConfirmedOrders: this.state.sceneState.OrderIndex.showConfirmedOrders,
            orders: this.state.currentTeamInfo.orders,
            cartItems: this.state.currentTeamInfo.cartItems['orders'],
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
                order: order,
                purveyor: purveyor,
              },() => {
                nav.push({
                  name: 'OrderView'
                })
              })
            },
          },
        }
      case 'OrderView':
        const cartItems = this.state.currentTeamInfo.cartItems['orders'][this.state.order.id]
        const orderProducts = _.sortBy(_.map(Object.keys(cartItems), (cartItemId) => {
          const cartItem = cartItems[cartItemId]
          return {
            product: this.state.currentTeamInfo.products[cartItem.productId],
            cartItem: cartItem,
          }
        }), 'name')
        // const orderMessages = _.sortBy(_.filter(this.state.currentTeamInfo.messages, (message) => {
        //   return message.hasOwnProperty('orderId') === true && message.orderId === this.state.order.id
        // }), 'createdAt')
        return {
          component: Components.OrderView,
          props: {
            userId: session.userId,
            order: this.state.order,
            purveyor: this.state.purveyor,
            products: orderProducts,
            teamsUsers: teams.teamsUsers,
            // messages: orderMessages,
            onConfirmOrderProduct: (cartItem, confirm) => {
              _.debounce(() => {
                dispatch(actions.updateCartItem({
                  id: cartItem.id,
                  teamId: cartItem.teamId,
                  purveyorId: cartItem.purveyorId,
                  orderId: cartItem.orderId,
                  productId: cartItem.productId,
                  status: cartItem.status,
                }))
              }, 25)()
            },
            onConfirmOrder: (order) => {
              _.debounce(() => {
                dispatch(actions.updateOrder(order.id, {
                  confirm: order.confirm
                }))
              }, 25)()
            },
            onSendConfirmationMessage: (msg) => {
              _.debounce(() => {
                dispatch(actions.createMessage(msg))
              }, 25)()
            },
            onNavToOrders: () => {
              nav.replacePreviousAndPop({
                name: 'OrderIndex',
              })
            },
          },
        }
      case 'Profile':
        return {
          component: Components.ProfileView,
          props: {
            session: session,
            onUpdateInfo: (data) => {
              _.debounce(() => {
                // console.log("DATA", data);
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
          },
        }
      case 'ProductForm':
        return {
          component: Components.ProductForm,
          props: {
            productCategory: this.state.category,
            product: this.state.product,
            team: this.state.currentTeamInfo.team,
            categories: this.state.currentTeamInfo.categories,
            purveyors: this.state.currentTeamInfo.purveyors,
            onProcessProduct: (productAttributes) => {
              const sceneState = Object.assign({}, this.state.sceneState);
              const existingProductAttributes = Object.assign({}, sceneState.ProductForm.productAttributes);
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
        const userContacts = _.sortBy(this.state.contactList.map(function (contact, idx) {
          contact.id = `contact-${idx}`
          contact.firstName = contact.firstName ? _.capitalize(contact.firstName) : ''
          return contact
        }), 'firstName')
        return {
          component: Components.InviteView,
          props: {
            contacts: userContacts,
            denied: this.state.contactsPermissionDenied,
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
        const cartPurveyors = _.sortBy(_.map(cartPurveyorIds, (purveyorId) => {
          return this.state.currentTeamInfo.purveyors[purveyorId]
        }), 'name')
        return {
          component: Components.CartView,
          props: {
            // team: this.state.currentTeamInfo.team,
            cartItems: this.state.currentTeamInfo.cartItems['cart'],
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
            onSubmitOrder: (purveyorIds, navigateToFeed) => {
              _.debounce(() => {
                dispatch(actions.sendCart(purveyorIds));
              }, 25)()
              if(navigateToFeed === true){
                nav.replacePreviousAndPop({
                  name: 'Feed',
                });
              }
            },
          },
        }
      case 'Loading':
        return {
          component: Components.Loading
        }
      case 'TeamMemberListing':
        return {
          component: Components.TeamMemberListing,
          props: {
            settingsConfig: settingsConfig,
            userId: session.userId,
            teamsUsers: teams.teamsUsers,
            currentTeamUsers: this.state.currentTeamInfo.team.users,
            onHandlePress: (type, value) => {
              if(type === 'call') {
                Communications.phonecall(value, true)
              } else if(type === 'email'){
                const to = value
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
            customNext: (
              <Components.FeedViewRightButton />
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
                cartItems={this.state.currentTeamInfo.cartItems['cart']}
              />
            )
          })
          break;
        case 'TeamView':
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
                cartItems={this.state.currentTeamInfo.cartItems['cart']}
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
                cartItems={this.state.currentTeamInfo.cartItems['cart']}
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
                content={this.state.category.name}
              />
            ),
            customNext: (
              <Components.CartRightButton
                onNavToCart={() => {
                  nav.push({ name: 'CartView', });
                }}
                cartItems={this.state.currentTeamInfo.cartItems['cart']}
              />
            )
          })
          break;
        case 'SearchView':
          if(this.state.sceneState.SearchView.hideHeader === true){
            navBar = null
          } else {
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
                  cartItems={this.state.currentTeamInfo.cartItems['cart']}
                />
              )
            })
          }
          break;
        case 'OrderIndex':
          const openOrders = _.filter(this.state.currentTeamInfo.orders, (order) => {
            return order.confirm.order === false
          })
          navBar = React.cloneElement(this.navBar, {
            navigator: nav,
            route: route,
            hidePrev: false,
            buttonsColor: Colors.greyText,
            customPrev: (
              <Components.NavBackButton iconFont={'material|close'} />
            ),
            // title: `${openOrders.length} Open Orders`,
            customTitle: (
              <TextComponents.NavBarTitle
                content={`${openOrders.length} Open Orders`}
              />
            ),
            hideNext: true,
          })
          break;
        case 'OrderView':
          let purveyorNameTitle = 'Processing'
          if(this.state.purveyor !== null){
            purveyorNameTitle = this.state.purveyor.name.substr(0,12) + (this.state.purveyor.name.length > 12 ? '...' : '')
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
            // title: this.state.purveyor.name.substr(0,16) + (this.state.purveyor.name.length > 16 ? '...' : ''),
            customTitle: (
              <TextComponents.NavBarTitle
                content={purveyorNameTitle}
              />
            ),
            customNext: (
              <Components.OrderRightButton
                purveyor={this.state.purveyor}
                onHandlePress={(type) => {
                  const order = this.state.order
                  const purveyor = this.state.purveyor
                  const team = this.state.currentTeamInfo.team
                  if(type === 'call') {
                    Communications.phonecall(purveyor.phone, true)
                  } else if(type === 'email'){
                    let timeZone = 'UTC';
                    if(purveyor.hasOwnProperty('timeZone') && purveyor.timeZone){
                      timeZone = purveyor.timeZone;
                    }
                    const orderDate = moment(order.orderedAt).tz(timeZone);
                    const to = purveyor.orderEmails.split(',')
                    const cc = ['orders@sousapp.com']
                    const subject = `re: ${purveyor.name} • Order Received from ${team.name} on ${orderDate.format('dddd, MMMM D')}`
                    Communications.email(to, cc, null, subject, null)
                  }
                }}
              />
            ),
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
              <Components.TeamMemberRightInvite
                connected={(connect.status === actions.CONNECT.CONNECTED)}
                toggleInviteModal={(value) => {
                  _.debounce(() => {
                    dispatch(actions.updateSession({ inviteModalVisible: value }))
                  }, 25)()
                }}
              />
            ),
          })
          break;
        case 'session/onboarding':
        case 'UserInfo':
        case 'UserTeam':
        case 'Loading':
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

  getRoute(route, nav) {
    const { session, settingsConfig } = this.props;
    // redirect to initial view
    if (this.state.isAuthenticated === true){
      if (route.name === 'Signup' || route.name === 'UserInfo' || route.name === 'UserTeam') {
        if (this.state.firstName === '' || this.state.lastName === '') {
          route.name = 'UserInfo';
        } else if(session.teamId === null) {
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
      if(route.name === 'CategoryIndex' || route.name === 'PurveyorIndex') {
        if(Object.keys(this.state.currentTeamInfo.purveyors).length === 0){
          route.name = 'OrderGuide';
        }
      }
    }
    // redirect to signup if requested view requires authentication
    else if(route.name !== 'Signup') {
      route.name = 'Signup'
    }

    return route
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
          ref='menu'
          team={this.state.currentTeamInfo.team}
          session={session}
          open={this.state.open}
          onNavToCategory={() => {
            nav.push({ name: 'CategoryIndex', })
          }}
          onNavToOrders={() => {
            nav.push({ name: 'OrderIndex', })
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

    let connectionStatus = null
    if(connect.status === actions.CONNECT.OFFLINE){
      let reconnectText = `reconnecting in ${Math.floor(this.state.connectionStats.reconnect/1000)}s`
      if(this.state.connectionStats.attempt === 0 || this.state.connectionStats.reconnect === 0){
        reconnectText = 'connecting...'
      }
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
          {connectionStatus}
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
    // backgroundColor: Colors.lightBlue,
    // borderRadius: 12,
    marginLeft: 12
  }
})

function mapStateToProps(state) {
  return {
    session: state.session,
    teams: state.teams,
    messages: state.messages,
    purveyors: state.purveyors,
    products: state.products,
    categories: state.categories,
    cartItems: state.cartItems,
    orders: state.orders,
    errors: state.errors,
    connect: state.connect,
    settingsConfig: state.settingsConfig,
  }
}

// --// connect(mapStateToProps, mapDispatchToProps, mergeProps, options = {})
export default connect(mapStateToProps)(App);
// export default App;
