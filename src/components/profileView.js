import { Icon } from 'react-native-icons';
import React from 'react-native';
import { mainBackgroundColor } from '../utilities/colors';

const {
  View,
  Text,
  TextInput,
  PropTypes,
  ScrollView,
  TouchableHighlight,
  StyleSheet,
  ActionSheetIOS,
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
    let buttons = [
      'Take a Photo',
      'Choose Existing Photo',
      'Cancel'
    ]
    let deleteAction = 0;
    let cancelAction = 2;
    ActionSheetIOS.showActionSheetWithOptions({
      options: buttons,
      cancelButtonIndex: cancelAction,
    },
    (buttonIndex) => {
      if( deleteAction === buttonIndex ){
        // process the delete
        console.log("CHANGE YOUR IMAGE WITH UPLOAD");
      } else if ( cancelAction === buttonIndex) {
        // process upload photo
        console.log("TAKE A PHOTO");
      }
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
        <View style={styles.navbar}>
          <Icon name="fontawesome|angle-left" size={40} color="white" style={styles.icon}/>
          <TouchableHighlight style={styles.logo}>
            <Text style={styles.navbarText}>Account</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.navbarPush}>
            <Text style={styles.sideNavbarText}>Switch Team</Text>
          </TouchableHighlight>
        </View>
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
    width: 100,
    height: 100,
    flex: 1,
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
