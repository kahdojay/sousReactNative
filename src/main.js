import React from 'react-native'
import { createStore, compose } from 'redux';
import { Provider } from 'react-redux/native';
import { persistStore, autoRehydrate } from 'redux-persist'
import App from './containers/app'
import reducers from './reducers';

var {
  AppRegistry,
  AsyncStorage
} = React

// let store = createStore(reducers);
let store = compose(autoRehydrate())(createStore)(reducers);

persistStore(store, {storage: AsyncStorage}, () => {
  // console.log('restored')
})

class SousApp extends React.Component {
  render() {
    return (
      <Provider store={store} >
        {() => <App />}
      </Provider>
    )
  }
}

AppRegistry.registerComponent('sousmobile', () => SousApp)
