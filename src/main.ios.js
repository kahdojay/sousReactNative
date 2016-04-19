import _ from 'lodash';
import React from 'react-native';
import { createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider, connect } from 'react-redux/native';
import { persistStore, autoRehydrate } from 'redux-persist';
import App from './containers/app';
import * as actions from './actions';
import reducers from './reducers';
import Colors from './utilities/colors';
import Loading from './components/loading';
import Analytics from './utilities/analytics';

const {
  AppRegistry,
  AsyncStorage,
  View,
  Text,
  StyleSheet,
  Image,
} = React

let store = compose(
  applyMiddleware(thunkMiddleware, Analytics),
  autoRehydrate()
)(createStore)(reducers);

class SousAppBase extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      rehydrated: false
    }
  }

  componentWillMount() {
    const {connect} = store.getState()
    // connect the app with server
    const willMountTimeoutMilliseconds = 1000
    const willMountTimeoutId = setTimeout(() => {
      // connect the app with server
      store.dispatch(actions.connectApp())
    }, 1000)
    store.dispatch(actions.connectDDPTimeoutId(willMountTimeoutId, willMountTimeoutMilliseconds))
    // persist the store
    persistStore(
      store,
      {
        storage: AsyncStorage,
        debounce: 250, // debounce interval applied to storage calls.
      },
      () => {
        // dispatch(actions.connectApp())
        this.setState({ rehydrated: true })
      }
    )
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.connect.status === actions.CONNECT.OFFLINE && nextProps.connect.timeoutId === null){
      // const {connect} = store.getState()
      let willReceivePropsTimeoutMilliseconds = 3000
      // if(connect.attempt > 21){
      //   willReceivePropsTimeoutMilliseconds = 15000
      // } else if(connect.attempt > 13){
      //   willReceivePropsTimeoutMilliseconds = 15000
      // } else if(connect.attempt > 8){
      //   willReceivePropsTimeoutMilliseconds = 10000
      // } else if(connect.attempt > 5){
      //   willReceivePropsTimeoutMilliseconds = 5000
      // } else if (connect.attempt > 3) {
        // willReceivePropsTimeoutMilliseconds = 3000
      // }
      const willReceivePropsTimeoutId = setTimeout(() => {
        // connect the app with server
        store.dispatch(actions.connectDDPClient())
      }, willReceivePropsTimeoutMilliseconds)
      store.dispatch(actions.connectDDPTimeoutId(willReceivePropsTimeoutId, willReceivePropsTimeoutMilliseconds))
    }
  }

  render() {
    if (this.state.rehydrated === false) {
      return (
        <Loading />
      )
    } else {
      return (
        <Provider store={store} >
          {() => <App />}
        </Provider>
      )
    }
  }
}

class ConnectedSousApp extends React.Component {
  render() {
    const SousApp = connect((state) => {
      return { connect: state.connect }
    })(SousAppBase)
    return (
      <Provider store={store} >
        {() => <SousApp />}
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    alignItems: 'center'
  },
  scene: {
    flex: 1
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
  connecting: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 20,
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
    color: '#555',
  },
  logoImage: {
    borderRadius: 15,
    width: 80,
    height: 70
  },
  loadingText: {
    color: 'white',
    alignSelf: 'center'
  }
})

AppRegistry.registerComponent('sousmobile', () => {
  return ConnectedSousApp
})
