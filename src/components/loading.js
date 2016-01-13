import React from 'react-native';
import Colors from '../utilities/colors';

const {
  ActivityIndicatorIOS,
  StyleSheet,
  View,
} = React;

class Loading extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicatorIOS
          animating={true}
          color={Colors.greyText}
          style={styles.activity}
          size={'large'}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  activity: {
    flex: 1,
    marginTop: -44,
    justifyContent: 'center'
  },
})

export default Loading
