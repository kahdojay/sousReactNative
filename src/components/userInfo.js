import { Icon } from 'react-native-icons';
import React from 'react-native';
import { BackBtn } from '../utilities/navigation';
import { NavigationBarStyles } from '../utilities/styles';
import { mainBackgroundColor, navbarColor } from '../utilities/colors';
let {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableHighlight
} = React;


class UserInfo extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
    }
  }
  render(){
    return (
      <ScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps={false}
        automaticallyAdjustContentInsets={false}
      >
        <View style={styles.wrapper}>
          <View style={styles.userInfoContainer}>
            <View style={styles.headerContainer}>
              <View style={styles.infoField}>
                <Text style={styles.title}>
                  Great! Looks like this is your first time here.
                </Text>
              </View>
            </View>
            <View style={styles.userProfile}>
              <View style={styles.headerContainer}>
                <Text style={styles.question}>What's your <Text style={[styles.question, styles.bold]}>name?</Text></Text>
              </View>
            </View>
          </View>

          <View style={styles.userInfoContainer}>

            <View style={styles.userProfile}>
              <View style={styles.infoField}>
                <TextInput
                  style={styles.input}
                  value={this.state.firstName}
                  onChange={(e) => this.setState({firstName: e.nativeEvent.text})}
                  placeholder={"First Name"}/>
              </View>
              <View style={styles.separator}></View>
              <View style={styles.infoField}>
                <TextInput
                  style={styles.input}
                  value={this.state.lastName}
                  onChange={(e) => this.setState({lastName: e.nativeEvent.text})}
                  placeholder={"Last Name"} />
              </View>
              <View style={styles.separator}></View>
            </View>

            <View style={styles.deactivateContainer}>
              <TouchableHighlight
                onPress={() => {
                  let {firstName, lastName} = this.state;
                  if (firstName != '' && lastName != '') {
                    // console.log("REGISTER USER WITH FIRST/LAST NAME");
                    this.props.onUpdateInfo({firstName: firstName, lastName: lastName});
                  }
                }}
                style={styles.deactivateButton}>
                <Text style={styles.deactivateText}>Login</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }
}
let styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
    flex: 1,
  },
  userInfoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  separator: {
    height: 1,
    borderColor: '#eee',
    borderWidth: 1,
  },
  headerContainer: {

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
    height: 45,
    paddingLeft: 5,
    paddingTop: 15,
    flexDirection: 'row',
  },
  title: {
    flex: 1,
    marginLeft: 5,
    color: 'black',
    fontWeight: 'normal',
    fontFamily: 'OpenSans',
    fontSize: 13,
    letterSpacing: -.5,
  },
  question: {
    flex: 1,
    color: 'black',
    fontFamily: 'OpenSans',
    fontSize: 18,
    letterSpacing: -.5,
  },
  bold: {
    fontWeight: 'bold',
  },
  inputName: {
    flex: 1,
    color: '#bbb',
    fontWeight: 'bold',
    fontFamily: 'OpenSans',
    fontSize: 14,
    letterSpacing: -.5,
  },
  inputInfo: {
    flex: 1,
    fontFamily: 'OpenSans',
    fontSize: 14,
    paddingBottom: 5,
    marginBottom: 5,
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
    width: 100,
    borderRadius: 7,
  },
  input: {
    flex: 1,
    padding: 4,
    marginRight: 5,
    marginBottom: 5,
    fontSize: 14,
    borderRadius: 8,
    color: '#333',
    fontWeight: 'bold',
    fontFamily: 'OpenSans'
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



export default UserInfo;
