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
  ActivityIndicatorIOS,
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
        this.setState({ rehydrated: true })
      }
    )
  }

  render() {
    if (this.state.rehydrated === false) {
      return (
        <View>
          <ActivityIndicatorIOS
            animating={true}
            color={'#808080'}
            size={'small'} />
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
