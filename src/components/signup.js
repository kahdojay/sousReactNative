import _ from 'lodash';
import React from 'react-native';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import DataUtils from '../utilities/data';

const {
  ActivityIndicatorIOS,
  Dimensions,
  Image,
  // Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} = React;

const runTimeDimensions = Dimensions.get('window')

class Signup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      invalid: false,
      phoneNumber: this.props.session.phoneNumber,
      smsToken: '',
      smsSent: this.props.session.smsSent,
      submitting: false
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.connected !== false){
      return true;
    }
    return false;
  }

  componentWillReceiveProps(nextProps) {
    let phoneNumber = this.state.phoneNumber
    if(nextProps.session.phoneNumber){
      phoneNumber = nextProps.session.phoneNumber
    }

    let newState = {
      phoneNumber: phoneNumber,
      smsSent: nextProps.session.smsSent,
    }
    if(this.state.submitting !== false){
      if(this.state.submitting === 'signup' && nextProps.session.smsSent === true){
        newState.submitting = false
      }
      // console.log('SESSION STATE: ', nextProps.session)
      if(this.state.submitting === 'verify' && nextProps.session.smsVerified === true){
        newState.submitting = false
      }
      if(nextProps.errors.length > 0){
        const machineKey = nextProps.errors[0].machineKey
        if(machineKey === 'technical-error:sms' || machineKey === 'verification-error'){
          newState.submitting = false
        }
      }
    }
    this.setState(newState)
  }

  setFetching(submitting) {
    this.setState({ submitting: submitting })
  }

  onSignup() {
    if(this.refs.phone){
      this.refs.phone.blur();
    }
    if(this.state.phoneNumber === null || this.state.phoneNumber ===  ''){
      this.setState({ invalid: true });
    } else {
      this.setState({ smsToken: '' })
      this.setFetching('signup')
      this.props.onRegisterSession(Object.assign({}, {
        phoneNumber: this.state.phoneNumber
      }));
    }
  }

  onVerify() {
    if(this.refs.code){
      this.refs.code.blur();
    }
    if(this.state.smsToken === ''){
      this.setState({invalid: true});
    } else {
      this.setFetching('verify')
      this.props.onRegisterSession(Object.assign({}, {
        phoneNumber: this.state.phoneNumber,
        smsToken: this.state.smsToken,
      }));
    }
  }

  render() {
    const {session} = this.props;
    const fetching =  (
      <View style={styles.activityContainer}>
        <ActivityIndicatorIOS
          animating={true}
          color={'#808080'}
          style={styles.activity}
          size={'small'}
        />
      </View>
    );
    const errorMessage = <Text style={styles.errorText}>Invalid entry, please try again.</Text>

    let buttonStyle = styles.buttonActive
    let buttonUnderlayColor = Colors.gold

    if(this.props.connected === false){
      buttonStyle = [styles.buttonActive, {backgroundColor: Colors.disabled}]
      buttonUnderlayColor = Colors.disabled
    }
    // TODO: use RN Linking library after updating RN
    let tosLink = 
        // <TouchableHighlight
        //   onPress={() => {
        //     Linking.openURL('http://www.sousapp.com')
        //   }}
        // >
          <Text style={styles.tosLink}>View Terms of Service
          </Text>
        // </TouchableHighlight>

    let signup = (
      <View style={styles.innerContainer}>
        <View style={styles.body}>
          <View style={styles.logoContainer}>
            <Image source={require('image!Logo')} style={styles.logoImage}></Image>
          </View>
          <Text style={styles.headerText}>Welcome to Sous!</Text>
          <Text style={styles.guidanceText}>Enter your phone number to sign in.</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={this.state.phoneNumber}
                keyboardType='phone-pad'
                onSubmitEditing={() => {this.onSignup()}}
                onChange={(e) => {
                  this.setState({phoneNumber: e.nativeEvent.text, invalid: false})
                }}
                placeholder={'+ Phone Number'}
                placeholderTextColor={'white'}
              />
            </View>
          </View>
          { session.errors || this.state.invalid ? errorMessage : <View/> }
          {tosLink}
        </View>
        <TouchableHighlight
          underlayColor={buttonUnderlayColor}
          onPress={() => {
            if(this.props.connected === true){
              this.setState({ smsSent: false }, () => {
                this.onSignup()
              })
            }
          }}
          style={buttonStyle}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableHighlight>
      </View>
    );
    if(this.state.smsSent === true){
      const formattedPhoneNumber = DataUtils.formatPhoneNumber(session.phoneNumber);
      signup = (
        <View style={styles.innerContainer}>
          <View style={styles.body}>
            <View style={styles.logoContainer}>
              <Image source={require('image!Logo')} style={styles.logoImage}></Image>
            </View>
            <Text style={styles.headerText}>Enter Login Code</Text>
            <Text style={styles.guidanceText}>We just sent a text to {formattedPhoneNumber}.</Text>
            <Text style={styles.guidanceText}>Please enter the login code below.</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={this.state.smsToken}
                  keyboardType='phone-pad'
                  onSubmitEditing={() => {this.onVerify()}}
                  onChange={(e) => {
                    this.setState({smsToken: e.nativeEvent.text, invalid: false})
                  }}
                  placeholder={'+ Enter Login Code'}
                  placeholderTextColor={'white'}
                />
              </View>
            </View>
            <TouchableHighlight
              underlayColor='transparent'
              onPress={() => {
                this.setState({ smsSent: true, smsToken: null }, () => {
                  this.onSignup()
                })
              }}
              style={styles.smallButton}>
              <Text style={styles.smallButtonText}>Send code again</Text>
            </TouchableHighlight>
            { session.errors || this.state.invalid ? errorMessage : <View/> }
            {tosLink}
          </View>
          <TouchableHighlight
            underlayColor={buttonUnderlayColor}
            onPress={() => {this.onVerify()}}
            style={buttonStyle}
          >
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableHighlight>
        </View>
      );
    }

    return (
      <ScrollView 
        contentContainerStyle={styles.outerContainer}
        keyboardShouldPersistTaps={false}
        automaticallyAdjustContentInsets={false}
      >
        {this.state.submitting !== false ? fetching : signup}
      </ScrollView>
    );
  }
};

let styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: Colors.lightBlue,
  },
  innerContainer: {
    backgroundColor: Colors.lightBlue,
    flex: 1,
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
    marginLeft: 4,
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
    flexDirection: 'row',
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
  tosLink: {
    color: 'white',
    textAlign: 'center',
    marginTop: 80,
  },
  buttonActive: {
    flex: 1,
    backgroundColor: Colors.gold,
    justifyContent: 'center',
  },
  smallButton: {
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  smallButtonText: {
    alignSelf: 'center',
    color: 'white',
    fontFamily: 'OpenSans',
  },
  buttonWithErrors: {
    height: 56,
    backgroundColor: Colors.gold,
    alignSelf: 'center',
    width: 150,
    justifyContent: 'center',
    borderRadius: 3,
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'OpenSans'
  },
  errorText: {
    color: '#d00',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'OpenSans'
  },
  activity: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  activityContainer: {
    flex: 1,
    justifyContent: 'center',
  },
})

module.exports = Signup;