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

class ImageGallery extends React.Component {
  render() {
    console.log("IMAGE PROPS", this.props);
    var photos = this.props.photos.edges.map((photo) => {
      return photo.node.image;
    });
    return (
      <View>
      <View style={[
        NavigationBarStyles.navBarContainer,
        {backgroundColor: navbarColor}
      ]}>
        <View style={[
          NavigationBarStyles.navBar,
          {paddingVertical: 5}
        ]}>
          <BackBtn
            navigator={this.props.navigator}
            style={NavigationBarStyles.navBarText}
            />
          <Image source={require('image!Logo')} style={styles.logoImage}></Image>
        </View>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.imageGrid}>
        { photos.map(image =>
          <TouchableHighlight
            style={styles.imageButton}
            underlayColor="#eee"
            onPress={() => {
              this.props.onUpdateAvatar(image);
              this.props.navigator.pop();
            }}
          >
            <Image style={styles.image} source={{ uri: image.uri }} />
          </TouchableHighlight>
        ) }
        </View>
      </ScrollView>
      </View>
    );
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

export default ImageGallery
