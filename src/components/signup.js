import { Icon, } from 'react-native-icons';
import _ from 'lodash';
import React from 'react-native';
import Colors from '../utilities/colors';

const {
  ActivityIndicatorIOS,
  Dimensions,
  Image,
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
    let newState = {
      phoneNumber: nextProps.session.phoneNumber,
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
    setTimeout(() => {
      this.setState(newState)
    }, 2000)
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

  formatPhoneNumber(phoneNumber){
    if (phoneNumber) {
      return phoneNumber.split('').map((num, index) => {
        switch(index){
          case 0:
            return `(${num}`;
          break;
          case 2:
            return `${num}) `
          break;
          case 5:
            return `${num}-`
          break;
          default:
          return num;
        }
      }).join('');
    } else {
      return phoneNumber;
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

    let signup = (
      <View style={styles.login}>
        <TouchableOpacity
          style={{paddingBottom: 20}}
          activeOpacity={1}
          onPress={() => {
            this.refs.phone.blur()
            this.refs.scrollView.scrollTo(0)
          }}
        >
          <Text style={styles.headerText}>Use your phone number to log in to Sous.</Text>
          <Text style={styles.centered}>First, we will send you a <Text style={styles.boldText}>text message</Text> to verify your account.</Text>
          <View style={styles.inputContainer}>
            <View style={{borderBottomWidth: 1, borderBottomColor: 'black'}}>
              <Icon name='material|phone' size={30} color='#aaa' style={styles.iconPhone}/>
              <TextInput
                ref='phone'
                style={[styles.input]}
                value={this.state.phoneNumber}
                keyboardType='phone-pad'
                onSubmitEditing={() => {this.onSignup()}}
                onFocus={() => {
                  this.refs.scrollView.scrollTo(140)
                }}
                onChange={(e) => {
                  this.setState({phoneNumber: e.nativeEvent.text, invalid: false})
                }}
              />
            </View>

          </View>
          { session.errors || this.state.invalid ? errorMessage : <Text>{' '}</Text> }
        </TouchableOpacity>
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
          <Text style={styles.buttonText}>Send SMS</Text>
        </TouchableHighlight>
      </View>
    );
    if(this.state.smsSent === true){
      const formattedPhoneNumber = this.formatPhoneNumber(session.phoneNumber);
      signup = (
        <View style={styles.login}>
          <TouchableOpacity
            style={{paddingBottom: 20}}
            activeOpacity={1}
            onPress={() => {
              this.refs.code.blur()
              this.refs.scrollView.scrollTo(0)
            }}
          >
            <Text style={styles.headerText}>We just sent a text to</Text>
            <Text style={[styles.boldText, styles.centered, styles.largeText]}>{formattedPhoneNumber}</Text>
            <TouchableHighlight
              underlayColor='transparent'
              onPress={() => {
                this.setState({ smsSent: true, smsToken: null }, () => {
                  this.onSignup()
                })
              }}
              style={[styles.smallButton, styles.buttonLinkWrap]}>
              <Text style={styles.buttonLink}>Send again</Text>
            </TouchableHighlight>
            <Text style={styles.centered}>Enter the verification code below to sign in.</Text>
            <View style={styles.inputContainer}>
              <View style={{borderBottomWidth: 1, borderBottomColor: 'black'}}>
                <TextInput
                  ref='code'
                  style={styles.input}
                  value={this.state.smsToken}
                  keyboardType='phone-pad'
                  textAlign='center'
                  onSubmitEditing={() => {this.onVerify()}}
                  onFocus={() => {
                    this.refs.scrollView.scrollTo(140)
                  }}
                  onChange={(e) => {
                    this.setState({smsToken: e.nativeEvent.text, invalid: false})
                  }}
                />
              </View>
            </View>
            { session.errors || this.state.invalid ? errorMessage : <Text>{' '}</Text> }
          </TouchableOpacity>
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
      <View style={{flex: 1}}>
        <View style={styles.navbar}>
          <Text style={styles.signup}>Signup/Login</Text>
        </View>
        <ScrollView
          automaticallyAdjustContentInsets={false}
          ref="scrollView"
          style={styles.container}
        >
          <View style={styles.logoContainer}>
            <Image source={require('image!Logo')} style={styles.logoImage}></Image>
          </View>
          {this.state.submitting !== false ? fetching : signup}
        </ScrollView>
      </View>
    );
  }
};

let styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navbar: {
    height: 40,
    backgroundColor: Colors.button,
    justifyContent: 'center',
  },
  signup: {
    textAlign: 'center',
    color: 'white',
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
    fontSize: 15,
  },
  headerText: {
    fontSize: 22,
    alignSelf: 'center',
    textAlign: 'center',
    paddingLeft: 8,
    paddingRight: 8,
    fontWeight: 'bold',
  },
  centered: {
    alignSelf: 'center',
    textAlign: 'center',
    lineHeight: 20,
  },
  boldText: {
    fontWeight: 'bold'
  },
  largeText: {
    fontSize: 20,
    marginBottom: 10,
    marginTop: 5,
  },
  summaryText: {
    alignSelf: 'center'
  },
  logoContainer: {
    marginTop: 25,
    marginBottom: 25,
    borderRadius: 100/2,
    backgroundColor: Colors.button,
    paddingLeft: 10,
    paddingTop: 15,
    width: 100,
    height: 100,
    alignSelf: 'center'
  },
  logoImage: {
    borderRadius: 15,
    width: 80,
    height: 70
  },
  login: {
    flex: 1,
    paddingLeft: 5,
    paddingRight: 5,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  errorPlaceholder: {
    height: 0
  },
  iconFace: {
    width: 70,
    height: 50,
  },
  iconPhone: {
    position: 'absolute',
    top: 10,
    left: -40,
    width: 70,
    height: 50,
  },
  iconLock: {
    width: 70,
    height: 70,
  },
  input: {
    height: 60,
    width: runTimeDimensions.width * .5,
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
    fontFamily: 'OpenSans',
    alignItems: 'center',
    alignSelf: 'center',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonActive: {
    height: 56,
    backgroundColor: Colors.gold,
    alignSelf: 'center',
    width: 150,
    marginBottom: 50,
    justifyContent: 'center',
    borderRadius: 3,
  },
  smallButton: {
    height: 20,
    alignSelf: 'center',
    width: 150,
    justifyContent: 'center',
    borderRadius: 3,
  },
  buttonLinkWrap: {
    backgroundColor: 'white',
    width: 120
  },
  buttonWithErrors: {
    height: 56,
    backgroundColor: Colors.gold,
    alignSelf: 'center',
    width: 150,
    marginTop: 10,
    justifyContent: 'center',
    borderRadius: 3,
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'OpenSans'
  },
  buttonLink: {
    alignSelf: 'center',
    fontSize: 16,
    color: Colors.button,
    fontWeight: 'bold',
    fontFamily: 'OpenSans',
  },
  errorText: {
    color: '#d00',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'OpenSans'
  },
  activity: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  activityContainer: {
    paddingTop: 50,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
})

module.exports = Signup;
