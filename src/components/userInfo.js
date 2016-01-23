import React from 'react-native';
import { Icon } from 'react-native-icons';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import DataUtils from '../utilities/data';

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
      firstName: this.props.session.firstName || '',
      lastName: this.props.session.lastName || '',
      email: this.props.session.email || '',
      inputError: false,
    }
  }
  render(){
    return (
      <ScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps={false}
        automaticallyAdjustContentInsets={false}
      >
        <View style={styles.headerContainer}>
          <View style={styles.infoField}>
            <Text style={styles.title}>
              Great! We'll need some info to get started.
            </Text>
          </View>
        </View>
        <View style={styles.userProfile}>
          <View style={styles.headerContainer}>
            <Text style={styles.question}>What is your <Text style={[styles.question, styles.bold]}>name</Text> and <Text style={[styles.question, styles.bold]}>email?</Text></Text>
          </View>
        </View>

        <View style={styles.userProfile}>
          <View style={styles.infoField}>
            <TextInput
              style={styles.input}
              value={this.state.firstName}
              onChange={(e) => {
                this.setState({
                  firstName: e.nativeEvent.text,
                  inputError: false,
                })
              }}
              placeholder={"First Name"}/>
          </View>
          <View style={styles.separator}></View>
          <View style={styles.infoField}>
            <TextInput
              style={styles.input}
              value={this.state.lastName}
              onChange={(e) => {
                this.setState({
                  lastName: e.nativeEvent.text,
                  inputError: false,
                })
              }}
              placeholder={"Last Name"} />
          </View>
          <View style={styles.separator}></View>
          <View style={styles.infoField}>
            <TextInput
              style={styles.input}
              value={this.state.email}
              onChange={(e) => {
                this.setState({
                  email: e.nativeEvent.text,
                  inputError: false,
                })
              }}
              placeholder={"Email"} />
          </View>
          <View style={styles.separator}></View>
        </View>
        <View style={styles.inputErrorContainer}>
        { this.state.inputError === true ? (
          <Text style={styles.inputErrorText}>Missing/invalid input fields.</Text>
        ) : <Text style={styles.inputErrorText}>{' '}</Text> }
        </View>

        <View style={styles.submitContainer}>
          <TouchableHighlight
            onPress={() => {
              let {firstName, lastName, email} = this.state;
              const emailValid = DataUtils.validateEmailAddress(email)
              if (firstName != '' && lastName != '' && email && emailValid === true) {
                this.props.onUpdateInfo({firstName: firstName, lastName: lastName, email: email});
              } else {
                this.setState({
                  inputError: true,
                })
              }
            }}
            underlayColor={Colors.gold}
            style={styles.submitButton}
          >
            <Text style={styles.submitText}>Login</Text>
          </TouchableHighlight>
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
    height: 0,
    borderBottomColor: Colors.separatorColor,
    borderBottomWidth: 1,
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
    color: Colors.lightGrey,
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
  submitContainer: {
    marginTop: 5,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: Colors.gold,
    padding: 10,
    width: 100,
    borderRadius: 7,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 4,
    marginRight: 5,
    marginBottom: 5,
    fontSize: 14,
    borderRadius: 8,
    color: Colors.inputTextColor,
    fontWeight: 'bold',
    fontFamily: 'OpenSans',
  },
  submitText:{
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    fontFamily: 'OpenSans',
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
    borderRadius: Sizes.inputBorderRadius,
    padding: 10,
  },
  inputErrorContainer: {

  },
  inputErrorText: {
    color: Colors.red,
    alignSelf: 'center'
  },
})



export default UserInfo;
