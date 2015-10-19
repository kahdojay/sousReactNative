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
} = React

let store = compose(
  applyMiddleware(thunkMiddleware),
  autoRehydrate()
  )(createStore)(reducers);

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
        // connect to the w
        this.setState({ rehydrated: true })
      }
    )
  }

  render() {
    if (this.state.rehydrated === false) {
      return (
        <View style={{
          marginTop: 20,
          flex: 1,
          backgroundColor: '#18008E',
        }}>
          <Text style={{color: 'white', alignSelf: 'center'}}>LOADING</Text>
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
