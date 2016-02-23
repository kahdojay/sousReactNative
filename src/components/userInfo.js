import React from 'react-native';
// import { Icon } from 'react-native-icons';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import DataUtils from '../utilities/data';

let {
  AppRegistry,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Text,
  View,
} = React;

const runTimeDimensions = Dimensions.get('window')

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
  clearError() {
    this.setState({ inputError: false })
  }
  handleSubmit() {
    let {firstName, lastName, email} = this.state;
    const emailValid = DataUtils.validateEmailAddress(email)
    if (firstName != '' && lastName != '' && email && emailValid === true) {
      this.props.onUpdateInfo({
        firstName: firstName, 
        lastName: lastName, 
        email: email
      });
    } else {
      this.setState({
        inputError: true,
      })
    }
  }

  render() {
    let userInfo = (
      <View style={styles.innerContainer}>
        <ScrollView 
          ref="scrollView"
          style={styles.body}
        >
          <View style={styles.logoContainer}>
            <Image source={require('image!Logo')} style={styles.logoImage}></Image>
          </View>
          <Text style={styles.headerText}>My Profile</Text>
          <Text style={styles.guidanceText}>Enter your name and email</Text>
          <Text style={[styles.guidanceText, {fontStyle: 'italic', fontSize: 10}]}>(visible to purveyors + team members)</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                ref='firstNameInput'
                style={styles.input}
                value={this.state.firstName}
                onChange={(e) => {
                  this.setState({
                    firstName: e.nativeEvent.text,
                    inputError: false,
                  })
                }}
                placeholder={"+ First Name"}
                placeholderTextColor={'white'}
                onSubmitEditing={() => {
                  this.clearError()
                  this.refs.scrollView.scrollTo(80)
                  this.refs.lastNameInput.focus()
                }}
              />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                ref='lastNameInput'
                style={styles.input}
                value={this.state.lastName}
                onChange={(e) => {
                  this.setState({
                    lastName: e.nativeEvent.text,
                    inputError: false,
                  })
                }}
                placeholder={"+ Last Name"} 
                placeholderTextColor={'white'}
                onSubmitEditing={() => {
                  this.clearError()
                  this.refs.scrollView.scrollTo(130)
                  this.refs.emailInput.focus()
                }}
              />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                ref='emailInput'
                style={styles.input}
                value={this.state.email}
                onChange={(e) => {
                  this.setState({
                    email: e.nativeEvent.text,
                    inputError: false,
                  })
                }}
                placeholder={"+ Email"} 
                placeholderTextColor={'white'}
                onSubmitEditing={() => {
                  this.handleSubmit()
                }}
              />
            </View>
            <View style={styles.inputErrorContainer}>
            { this.state.inputError === true ? (
              <Text style={styles.inputErrorText}>Missing/invalid input fields.</Text>
            ) : <Text style={styles.inputErrorText}>{''}</Text> }
            </View>
          </View>
        </ScrollView>
        <TouchableHighlight
          onPress={() => {
            this.handleSubmit()
          }}
          underlayColor={Colors.gold}
          style={styles.submitButton}
        >
          <Text style={styles.submitText}>Get Started</Text>
        </TouchableHighlight>
      </View>
    )

    return (
      <ScrollView
        contentContainerStyle={styles.outerContainer}
        automaticallyAdjustContentInsets={false}
      >
        {userInfo}
      </ScrollView>
    )
  }
}
let styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: Colors.lightBlue,
  },
  innerContainer: {
    flex: 1,
    backgroundColor: Colors.lightBlue,
  },
  body: {
    flex: 6,
    paddingLeft: 15,
    paddingRight: 15,
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'OpenSans',
    color: 'white',
    fontWeight: 'bold',
  },
  guidanceText: {
    color: 'white',
    marginLeft: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  logoImage: {
    borderRadius: 15,
    width: 50,
    height: 50
  },
  inputContainer: {
  },
  inputWrapper: {
    borderBottomColor: Colors.inputUnderline,
    borderBottomWidth: 1,
    marginLeft: 20,
  },
  input: {
    marginTop: 10,
    height: 50,
    width: runTimeDimensions.width * .80,
    fontSize: 15,
    color: 'white',
    fontFamily: 'OpenSans',
  },
  submitButton: {
    flex: 1,
    backgroundColor: Colors.gold,
    justifyContent: 'center',
  },
  submitText:{
    alignSelf: 'center',
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'OpenSans'
  },
  inputErrorText: {
    color: '#d00',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'OpenSans'
  },
})



export default UserInfo;
