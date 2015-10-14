import { Icon } from 'react-native-icons';
import React from 'react-native';
import { mainBackgroundColor } from '../utilities/colors';
import ImageGallery from './imageGallery';
import Camera from './camera';
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
const {
  View,
  Text,
  TextInput,
  PropTypes,
  ScrollView,
  Image,
  TouchableHighlight,
  StyleSheet,
  ActionSheetIOS,
  CameraRoll,
} = React;

class ProfileView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      editAvatar: false,
      editUsername: false,
      editEmail: false,
    }
  }
  showActionSheet(){
    var options = {
      title: 'Select Avatar',
      cancelButtonTitle: 'Cancel',
      takePhotoButtonTitle: 'Take Photo...',
      takePhotoButtonHidden: false,
      chooseFromLibraryButtonTitle: 'Choose from Library...',
      chooseFromLibraryButtonHidden: false,
      customButtons: {
         // [Button Text] : [String returned upon selection]
      },
      maxWidth: 400,
      maxHeight: 400,
      returnBase64Image: false,
      returnIsVertical: false,
      quality: 1,
      allowsEditing: false, // Built in iOS functionality to resize/reposition the image
      //storageOptions: {   // if provided, the image will get saved in the documents directory (rather than tmp directory)
      //  skipBackup: true, // will set attribute so the image is not backed up to iCloud
      //  path: "images",   // will save image at /Documents/images rather than the root
      //}
    };

// The first arg will be the options object for customization, the second is
// your callback which sends string: responseType, string: response.
// responseType will be either 'cancel', 'data', 'uri', or one of your custom button values
    UIImagePickerManager.showImagePicker(options, (responseType, response) => {
      console.log(`Response Type = ${responseType}`);

      if (responseType !== 'cancel') {
        let source;
        if (responseType === 'data') { // New photo taken OR passed returnBase64Image true -  response is the 64 bit encoded image data string
          source = {uri: 'data:image/jpeg;base64,' + response, isStatic: true};
        }
        else if (responseType === 'uri') { // Selected from library - response is the URI to the local file asset
          source = {uri: response.replace('file://', ''), isStatic: true};
        }

        this.props.onUpdateAvatar(source);
      }
    });
    // let buttons = [
    //   'Take a Photo',
    //   'Choose Existing Photo',
    //   'Cancel'
    // ]
    // let takePhoto = 0;
    // let photoUpload = 1;
    // let cancelAction = 2;
    // ActionSheetIOS.showActionSheetWithOptions({
    //   options: buttons,
    //   cancelButtonIndex: cancelAction,
    // },
    // (buttonIndex) => {
    //   if( takePhoto === buttonIndex ){
    //     this.props.navigator.push({
    //       name: 'Camera',
    //       navigationBar: this.props.navBar
    //     });
    //   } else if ( photoUpload === buttonIndex) {
    //     // console.log("TAKE A PHOTO");
    //     const fetchParams = {
    //       first: 100,
    //     };
    //     CameraRoll.getPhotos(fetchParams, this.storeImages.bind(this), this.logImageError);
    //   }
    // });
  }
  logImageError(err) {
    console.log("IMAGE ERROR", err);
  }
  storeImages(data){
    this.props.navigator.push({
      name: 'ImageGallery',
      photos: data,
    });
  }
  render() {
    console.log(this.props);
    var avatar;
    if (this.props.imageURL === "") {
      avatar = <Icon name="material|account-circle" size={100} style={styles.userIcon} />
    } else {
      avatar = <Image style={styles.userIcon} source={{uri: this.props.imageURL}}/>
    }
    return (
   		<ScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps={false}
        automaticallyAdjustContentInsets={false}
      >
        <View style={styles.wrapper}>
          <TouchableHighlight
            underlayColor="#f7f7f7"
            onPress={() => this.showActionSheet()}
            style={styles.avatar}>
            {avatar}
          </TouchableHighlight>
          <View style={styles.phoneNumber}>
            <Text style={styles.phoneText}>{this.props.phoneNumber}</Text>
          </View>
          <View style={styles.userInfoContainer}>

            <View style={styles.userProfile}>
              <View style={styles.infoField}>
                <Text style={styles.inputName}>Name</Text>
                <Text style={styles.inputInfo}>{this.props.username}</Text>
              </View>
              <View style={styles.infoField}>
                <Text style={styles.inputName}>E-mail Address</Text>
                <Text style={styles.inputInfo}>{this.props.email}</Text>
              </View>
              <View style={styles.infoField}>
                <Text style={styles.inputName}>Invite Users</Text>
                <Text style={styles.inputInfo}></Text>
              </View>
            </View>
            <View style={styles.userPreferences}>
              <View style={styles.infoField}>
                <Text style={styles.inputName}>Notifications</Text>
                <Text style={styles.inputInfo}></Text>
              </View>
              <View style={styles.infoField}>
                <Text style={styles.inputName}>Contact Us</Text>
                <Text style={styles.inputInfo}></Text>
              </View>
            </View>
            <View style={styles.deactivateContainer}>
              <TouchableHighlight style={styles.deactivateButton}>
                <Text style={styles.deactivateText}>Deactivate Account</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

let styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#f2f2f2',
    flex: 1,
  },
  userInfoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  userProfile: {
    flex: 1,
    backgroundColor: 'white',
    margin: 10,
  },
  userPreferences: {
    flex: 2,
    margin: 10,
    marginTop: 0,
    backgroundColor: 'white',
  },
  infoField: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#fff',
    height: 25,
    paddingLeft: 5,
    flexDirection: 'row',
  },
  inputName: {
    flex: 1,
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'OpenSans',
    fontSize: 14,
    letterSpacing: -.5,
  },
  inputInfo: {
    fontFamily: 'OpenSans',
    fontSize: 14,
  },
  deactivateContainer: {
    flex: 1,
    marginTop: 5,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deactivateButton: {
    backgroundColor: '#ddd',
    padding: 10,
    width: 200,
    borderRadius: 7,
  },
  deactivateText:{
    fontSize: 16,
    fontWeight: 'bold',
    color: '#777',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackgroundColor,
    alignItems: 'stretch',
  },
  navbar: {
    height: 70,
    backgroundColor: '#1E00B1',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navbarText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold'
  },
  sideNavbarText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  icon: {
    height: 30,
    width: 30,
    flex: 1,
  },
  logo: {
    flex: 2.5,
    alignItems: 'flex-end',
    marginRight: 10
  },
  navbarPush: {
    flex: 2,
    alignItems: 'center'
  },
  userIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    margin: 4,
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  phoneNumber: {
    backgroundColor: '#1E00B1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    padding: 5,
  },
  avatar: {
    backgroundColor: '#f2f2f2',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameInput: {
    backgroundColor: 'white',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
})

ProfileView.propTypes = {
};

export default ProfileView
