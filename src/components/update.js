import React from 'react-native';
import Colors from '../utilities/colors';

const {
  Image,
  LinkingIOS,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

class Update extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.spacer} />
        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <View style={styles.logoWrap}>
              <Image source={require('image!Logo')} style={styles.logoImage}></Image>
            </View>
          </View>
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsHeader}>Welcome Back!</Text>
            <Text style={styles.instructions}>We've updated Sous, and we'd love it if you could download the latest version in the app store.</Text>
          </View>
          <TouchableHighlight
            onPress={() => {
              const url = this.props.settingsConfig.itunesUrl
              LinkingIOS.canOpenURL(url, (supported) => {
                if (!supported) {
                	console.log('Can\'t handle url: ' + url);
                } else {
                	LinkingIOS.openURL(url);
                }
            	});
            }}
            style={styles.updateButtonContainer}
          >
            <Text style={styles.updateButtonText}>Update Sous</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.spacer} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  spacer: {
    flex: 1,
  },
  contentContainer: {
    flex: 3,
    margin: 20,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    width: 260,
    flexDirection: 'column',
  },
  logoContainer: {
    flex: 1,
    paddingTop: 10,
  },
  logoWrap: {
    borderRadius: 75/2,
    backgroundColor: Colors.button,
    paddingLeft: 10,
    paddingTop: 15,
    width: 75,
    height: 75,
    alignSelf: 'center',
  },
  logoImage: {
    borderRadius: 15,
    width: 55,
    height: 50,
  },
  instructionsContainer: {
    flex: 1,
    padding: 15,
    paddingTop: 0,
  },
  instructionsHeader: {
    fontFamily: 'OpenSans',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  instructions: {
    fontFamily: 'OpenSans',
    textAlign: 'center',
  },
  updateButtonContainer: {
    alignSelf: 'center',
    borderTopWidth: 1,
    borderColor: Colors.lightGrey,
  },
  updateButtonText: {
    width: 258,
    fontFamily: 'OpenSans',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: Colors.gold,
    color: 'white',
    padding: 12,
    textAlign: 'center',
  },
})

export default Update
