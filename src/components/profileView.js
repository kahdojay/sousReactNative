import React from 'react-native';
import { Icon } from 'react-native-icons';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import DataUtils from '../utilities/data';
import AvatarUtils from '../utilities/avatar';

const {
  ActionSheetIOS,
  Image,
  NativeModules,
  PropTypes,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} = React;

const { UIImagePickerManager } = NativeModules;

class ProfileView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editPhoneNumber: false,
      phoneNumber: this.props.session.phoneNumber,
      firstName: this.props.session.firstName,
      lastName: this.props.session.lastName,
      email: this.props.session.email,
      imageUrl: this.props.session.imageUrl,
      updatedAt: this.props.session.updatedAt,
      saveChanges: false,
      inputError: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      phoneNumber: nextProps.session.phoneNumber,
      firstName: nextProps.session.firstName,
      lastName: nextProps.session.lastName,
      email: nextProps.session.email,
      imageUrl: nextProps.session.imageUrl,
      updatedAt: nextProps.session.updatedAt,
    })
  }

  showActionSheet(){
    var options = {
      title: 'Select Profile Image',
      maxWidth: 100,
      maxHeight: 100,
      quality: .5,
      allowsEditing: true,
    };

    UIImagePickerManager.showImagePicker(options, (didCancel, response) => {
      // console.log('Response = ', response);

      if (didCancel) {
        // console.log('User cancelled image picker');
      } else {
        // const source = {uri: response.uri.replace('file://', ''), isStatic: true};
        const source = {
          data: response.data,
          isStatic: true,
          uri: 'data:image/jpeg;base64,' + response.data,
        };
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
    let propValues = [ this.props.session.firstName, this.props.session.lastName, this.props.session.email ];
    let stateValues = [ this.state.firstName, this.state.lastName, this.state.email ];
    // console.log("PROPS", propValues !== stateValues);
    this.setState({
      saveChanges: (JSON.stringify(propValues) !== JSON.stringify(stateValues))
    })
  }

  render() {
    const {firstName, lastName, imageUrl, email, phoneNumber, updatedAt} = this.state

    let avatar = AvatarUtils.getAvatar(this.state, 90)
    if (avatar === null) {
      avatar = <Icon name="material|account-circle" size={100} style={styles.userIcon} />
    }
    let phoneNumberComponent = (
      <View style={styles.phoneNumber}>
        <Text style={styles.phoneText}>{phoneNumber}</Text>
      </View>
    )
    if (this.state.editPhoneNumber) {
      phoneNumberComponent = (
        <View style={styles.infoField}>
          <TextInput
            onChange={(e) => {
              this.setState({
                phoneNumber: e.nativeEvent.text,
              })
            }}
            style={styles.inputField}
            value={phoneNumber}
          />
        </View>
      )
    }
    let saveChanges = null

    if(this.state.saveChanges === true){
      console.log('about to update based on state change/check')
      saveChanges = (
        <View style={styles.saveContainer}>
          <TouchableHighlight
            onPress={() => {
              let data = {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: this.state.email,
                updatedAt: (new Date()).toISOString(),
              };
              let allowSave = true
              if(this.state.email !== ''){
                allowSave = DataUtils.validateEmailAddress(this.state.email)
              }
              if(allowSave === true){
                this.setState({
                  inputError: false,
                  saveChanges: false,
                }, () => {
                  this.props.onUpdateInfo(data);
                })
              } else {
                this.setState({
                  inputError: true
                })
              }
            }}
            underlayColor={Colors.gold}
            style={styles.saveButton}
          >
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableHighlight>
        </View>
      )
    }

    return (
   		<ScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps={false}
        automaticallyAdjustContentInsets={false}
      >
        <View style={styles.wrapper}>
          <View>
            <TouchableHighlight
              underlayColor={Colors.mainBackgroundColor}
              onPress={() => this.showActionSheet()}
            >
              <View style={styles.avatar}>
                {avatar}
                <Text style={styles.changeAvatarText}>Change Avatar</Text>
              </View>
            </TouchableHighlight>
          </View>
          {phoneNumberComponent}
          <View style={styles.userInfoContainer}>
            <View style={styles.userProfile}>
              <View style={styles.infoField}>
                <Text style={styles.inputName}>First Name</Text>
                <TextInput
                  style={styles.inputField}
                  onChange={(e) => {
                    this.setState({
                      firstName: e.nativeEvent.text
                    }, () => {
                      this.needsSave()
                    })
                  }}
                  value={firstName}
                />
              </View>
              <View style={styles.infoField}>
                <Text style={styles.inputName}>Last Name</Text>
                <TextInput
                  onChange={(e) => {
                    this.setState({
                      lastName: e.nativeEvent.text
                    }, () => {
                      this.needsSave()
                    })
                  }}
                  style={styles.inputField}
                  value={lastName}
                />
              </View>
              <View style={styles.infoField}>
                <Text style={styles.inputName}>E-mail Address</Text>
                <TextInput
                  style={styles.inputField}
                  onChange={(e) => {
                    this.setState({
                      email: e.nativeEvent.text,
                      inputError: false,
                    }, () => {
                      this.needsSave()
                    })
                  }}
                  value={email}
                />
              </View>
            </View>
            { this.state.inputError === true ?
              <View style={styles.inputErrorContainer}>
                <Text style={styles.inputErrorText}>Please enter a valid email address.</Text>
              </View>
            : <View style={styles.inputErrorContainer} /> }
            {saveChanges}
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
    borderRadius: Sizes.inputBorderRadius,
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
    color: Colors.lightBlue,
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
    marginTop: 10,
    backgroundColor: Colors.gold,
    padding: 10,
    width: 150,
    borderRadius: 7,
  },
  saveText:{
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.mainBackgroundColor,
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
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  phoneNumber: {
    backgroundColor: Colors.blue,
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
    padding: 10,
    backgroundColor: '#f2f2f2',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameInput: {
    backgroundColor: 'white',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: Sizes.inputBorderRadius,
    padding: 10,
  },
  inputErrorContainer: {
    height: 10,
  },
  inputErrorText: {
    color: Colors.red,
    alignSelf: 'center'
  },
})

ProfileView.propTypes = {
};

export default ProfileView
