import React from 'react-native'
import { createStore } from 'redux';
import { Provider } from 'react-redux/native';
import App from './containers/app'
import reducers from './reducers';

var {
  AppRegistry
} = React

let store = createStore(reducers);

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
