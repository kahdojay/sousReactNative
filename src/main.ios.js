import React from 'react-native'
import { createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux/native';
import { persistStore, autoRehydrate } from 'redux-persist'
import App from './containers/app'
import reducers from './reducers';

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

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
  },
  scene: {
    flex: 1
  },
  logoContainer: {
    marginTop: 50,
    marginBottom: 15,
    borderRadius: 100/2,
    backgroundColor: '#1825AD',
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
  loadingText: {
    color: 'white',
    alignSelf: 'center'
  }
})

class SousApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      rehydrated: false
    }
  }

  componentWillMount(){
    persistStore(
      store,
      {storage: AsyncStorage},
      () => {
        // TODO: move action.connectApp here:
          // dispatch(actions.connectApp())
        this.setState({ rehydrated: true })
      }
    )
  }

  render() {
    if (this.state.rehydrated === false) {
      return (
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image source={require('image!Logo')} style={styles.logoImage}></Image>
          </View>
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

AppRegistry.registerComponent('sousmobile', () => SousApp)
