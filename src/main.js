'use strict'

import React from 'react-native'
import { createStore } from 'redux';
import { Provider } from 'react-redux/native';
import App from './containers/app'
import todoApp from './reducers';

var {
  AppRegistry
} = React

let store = createStore(todoApp);

class SousApp extends React.Component {
  render() {
    return (
      <Provider store={store}>
        {() => <App />}
      </Provider>
    )
  }
}

AppRegistry.registerComponent('sousmobile', () => SousApp)
