import { Icon } from 'react-native-icons';
import React from 'react-native';
import { BackBtn } from '../utilities/navigation';
import { NavigationBarStyles } from '../utilities/styles';
import { mainBackgroundColor, navbarColor } from '../utilities/colors';
const {
  View,
  Text,
  TextInput,
  Image,
  PropTypes,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  ActionSheetIOS,
  CameraRoll,
} = React;

class Camera extends React.Component {
  render() {
    return (
      <View>
        <ScrollView style={styles.container}>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  logoImage: {
    width: 45,
    height: 45,
    marginLeft: 95,
    marginTop: 5,
    // marginTop: -10
  },
  iconMore: {
    width: 40,
    height: 40,
    // marginTop: -4
  },
  container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
  },
  imageGrid: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center'
  },
  imageButton: {

  },
  image: {
      width: 100,
      height: 100,
      margin: 10,
  },
});


export default Camera;
