import React from 'react-native';
import Colors from '../utilities/colors';

const {
  Image,
  StyleSheet,
  Text,
  View,
} = React;

class Loading extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require('image!Logo')} style={styles.logoImage}></Image>
        </View>
        <Text style={styles.loadingText}>LOADING</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
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
  logoImage: {
    borderRadius: 15,
    width: 80,
    height: 70,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 20,
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
    color: '#555',
  },
})

export default Loading
