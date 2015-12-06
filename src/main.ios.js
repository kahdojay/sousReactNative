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

const {
  AppRegistry,
  AsyncStorage,
  View,
  Text,
  StyleSheet,
  Image,
} = React

let store = compose(
  applyMiddleware(thunkMiddleware),
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
    // connect the app with server
    var timeoutId = setTimeout(() => {
      // connect the app with server
      store.dispatch(actions.connectApp())
    }, 1000)
    store.dispatch(actions.connectDDPTimeoutId(timeoutId))
    // persist the store
    persistStore(
      store,
      {storage: AsyncStorage},
      () => {
        // dispatch(actions.connectApp())
        this.setState({ rehydrated: true })
      }
    )
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.connect.status === actions.CONNECT.OFFLINE && nextProps.connect.timeoutId === null){
      var timeoutId = setTimeout(() => {
        // connect the app with server
        store.dispatch(actions.connectDDPClient())
      }, 1500)
      store.dispatch(actions.connectDDPTimeoutId(timeoutId))
    }
  }

  render() {
    if (this.state.rehydrated === false || this.props.connect.status === actions.CONNECT.OFFLINE) {
      return (
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image source={require('image!Logo')} style={styles.logoImage}></Image>
          </View>
          <Text style={styles.connecting}>LOADING</Text>
        </View>
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
