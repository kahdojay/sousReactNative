import React from 'react-native'

class SousApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      rehydrated: false
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.android.js
        </Text>
        <Text style={styles.instructions}>
          Shake or press menu button for dev menu
        </Text>
      </View>
    )
  }
}

AppRegistry.registerComponent('sousmobile', () => SousApp)
