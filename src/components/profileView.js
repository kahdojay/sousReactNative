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
} = React;

class ProfileView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: ''
    }
  }

  render() {
    return (
   		<ScrollView
        style={styles.scrollView}
        contentInset={{bottom:49}}
        keyboardShouldPersistTaps={false}
        automaticallyAdjustContentInsets={false}>

        <View style={styles.navbar}>
          <Icon name="fontawesome|angle-left" size={40} color="white" style={styles.icon}/>
          <TouchableHighlight style={styles.logo}>
            <Text style={styles.navbarText}>Account</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.navbarPush}>
            <Text style={styles.navbarText}>Switch Team</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.wrapper}>
          <View style={styles.avatar}>
            <Icon name="material|account-circle" size={100} style={styles.userIcon} />
          </View>
          <View style={styles.phoneNumber}>
            <Text style={styles.phoneText}>(555) 555-5555</Text>
          </View>
          <View style={styles.userInfoContainer}>

            <View style={styles.userProfile}>
              <View></View>
              <View></View>
              <View></View>
            </View>
            <View style={styles.userPreferences}>
              <View></View>
              <View></View>
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

// <TextInput
//   style={styles.nameInput}
//   placeholder='Name'
//   value={this.name}
//   onChangeText={(name) => {
//     this.setState({name})
//   }}
// />
let styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
    flex: 1,
  },
  userInfoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  userProfile: {
    height: 70,
    backgroundColor: 'red',
  },
  userPreferences: {
    height: 50,
    backgroundColor: 'blue',
  },
  deactivateContainer: {
    height: 40,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
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
    backgroundColor: 'blue',
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
    padding: 10,
    justifyContent: 'center',
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  phoneNumber: {
    backgroundColor: 'blue',
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
    backgroundColor: '#f7f7f7',
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
