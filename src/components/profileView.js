import React from 'react-native';
import { Icon } from 'react-native-icons';
import Colors from '../utilities/colors';
import { mainBackgroundColor } from '../utilities/colors';
let UIImagePickerManager = require('NativeModules').UIImagePickerManager;

const {
  View,
  Text,
  TextInput,
  PropTypes,
  ScrollView,
  SwitchIOS,
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
      editPhoneNumber: false,
      phoneNumber: this.props.session.phoneNumber,
      firstName: this.props.session.firstName,
      lastName: this.props.session.lastName,
      email: this.props.session.email,
      saveChanges: false,
      notifications: this.props.session.notifications || false,
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
      maxWidth: 100,
      maxHeight: 100,
      returnBase64Image: false,
      returnIsVertical: false,
      quality: 1,
      allowsEditing: true, // Built in iOS functionality to resize/reposition the image
      noData: false,
      //storageOptions: {   // if provided, the image will get saved in the documents directory (rather than tmp directory)
      //  skipBackup: true, // will set attribute so the image is not backed up to iCloud
      //  path: "images",   // will save image at /Documents/images rather than the root
      //}
    };

    // The first arg will be the options object for customization, the second is
    // your callback which sends bool: didCancel, object: response.
    //
    // response.data is the base64 encoded image data
    // response.uri is the uri to the local file asset on the device
    // response.isVertical will be true if the image is vertically oriented
    // response.width & response.height give you the image dimensions
    UIImagePickerManager.showImagePicker(options, (didCancel, response) => {
      console.log('Response = ', response);

      if (didCancel) {
        console.log('User cancelled image picker');
      } else {
        // const source = {uri: response.uri.replace('file://', ''), isStatic: true};
        const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
        this.props.onUpdateAvatar(source);
      }
    });
  }
  logImageError(err) {
    // console.log("IMAGE ERROR", err);
  }
  storeImages(data){
    this.props.onStoreImages(data)
  }
  needsSave() {
    let propValues = [ this.props.session.firstName, this.props.session.lastName, this.props.session.email, this.props.session.notifications, this.props.session.phoneNumber ];
    let stateValues = [ this.state.firstName, this.state.lastName, this.state.email, this.state.notifications, this.state.phoneNumber ];
    // console.log("PROPS", propValues == stateValues);
    return JSON.stringify(propValues) == JSON.stringify(stateValues);
  }
  render() {
    // console.log("PROFILE", this.props);
    let avatar = (
      <Image
        style={styles.userIcon}
        source={{uri: this.props.session.imageUrl}}
      />
    )
    if (!this.props.session.imageUrl) {
      avatar = <Icon name="material|account-circle" size={100} style={styles.userIcon} />
    }
    let phoneNumber = (
      <TouchableHighlight
        underlayColor={Colors.darkBlue}
        style={styles.phoneNumber}>
        <Text style={styles.phoneText}>{this.props.session.phoneNumber}</Text>
      </TouchableHighlight>
    )
    if (this.state.editPhoneNumber) {
      phoneNumber = (
        <View style={styles.infoField}>
          <TextInput
            onChange={(e) => this.setState({phoneNumber: e.nativeEvent.text})}
            style={styles.inputField}
            value={this.state.phoneNumber}></TextInput>
        </View>
      )
    }
    let saveChanges = (
      <View style={styles.saveContainer}>
        <TouchableHighlight
          underlayColor='#bbb'
          onPress={() => {
            let {firstName, lastName, email, notifications, phoneNumber} = this.state;
            let data = {
              firstName: firstName,
              lastName: lastName,
              email: email,
              notifications: notifications,
              username: phoneNumber,
              phoneNumber: phoneNumber,
            };
            this.props.onUpdateInfo(data);
          }}
          style={styles.saveButton}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableHighlight>
      </View>
    )
    return (
   		<ScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps={false}
        automaticallyAdjustContentInsets={false}
      >
        <View style={styles.wrapper}>
          <View>
            <TouchableHighlight
              underlayColor="#f7f7f7"
              onPress={() => this.showActionSheet()}
              style={styles.avatar}>
              <View>
                {avatar}
                <Text style={styles.changeAvatarText}>Change Avatar</Text>
              </View>
            </TouchableHighlight>
          </View>
          {phoneNumber}
          <View style={styles.userInfoContainer}>
            <View style={styles.userProfile}>
              <View style={styles.infoField}>
                <Text style={styles.inputName}>First Name</Text>
                <TextInput
                  style={styles.inputField}
                  onChange={(e) => {
                    this.setState({firstName: e.nativeEvent.text})
                  }}
                  value={this.state.firstName}></TextInput>
              </View>
              <View style={styles.infoField}>
                <Text style={styles.inputName}>Last Name</Text>
                <TextInput
                  onChange={(e) => {
                    this.setState({lastName: e.nativeEvent.text})
                  }}
                  style={styles.inputField}
                  value={this.state.lastName}></TextInput>
              </View>
              <View style={styles.infoField}>
                <Text style={styles.inputName}>E-mail Address</Text>
                <TextInput
                  style={styles.inputField}
                  onChange={(e) => {
                    this.setState({email: e.nativeEvent.text})
                  }}
                  value={this.state.email}></TextInput>
              </View>
            </View>
            {! this.needsSave() ? saveChanges : <View></View>}
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
  largeInfoField: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#fff',
    height: 40,
    paddingLeft: 5,
    paddingTop: 5,
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
  inviteText: {
    flex: 8,
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
  inputField: {
    flex: 1,
    backgroundColor: 'white',
    color: 'black',
    fontFamily: 'OpenSans',
    borderRadius: 5,
    fontWeight: 'bold',
    paddingLeft: 10,
    borderWidth: 1,
    paddingRight: 3,
    fontSize: 14,
    borderColor: '#ddd'
  },
  changeAvatarText: {
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
  saveContainer: {
    flex: 1,
    margin: 5,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#ddd',
    padding: 10,
    width: 150,
    borderRadius: 7,
  },
  saveText:{
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
  inviteIcon: {
    height: 20,
    width: 20,
    marginRight: 8,
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
