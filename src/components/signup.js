import { Icon, } from 'react-native-icons';
import _ from 'lodash'
import React from 'react-native'

const {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableHighlight,
  ScrollView,
  ActivityIndicatorIOS,
} = React;

class Signup extends React.Component {
  constructor(props) {
    super(props)
    console.log(this.props.session)
    this.state = {
      invalid: false,
      phoneNumber: this.props.session.phoneNumber,
      smsToken: '',
      smsSent: this.props.session.smsSent
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      phoneNumber: nextProps.session.phoneNumber,
      smsSent: nextProps.session.smsSent,
    })
  }

  onSignup() {
    if(this.refs.phone){
      this.refs.phone.blur();
    }
    if(this.refs.code){
      this.refs.code.blur();
    }
    if(this.state.phoneNumber == ''){
      this.setState({invalid: true});
    } else {
      this.props.onRegisterSession(Object.assign({}, {
        phoneNumber: this.state.phoneNumber
      }));
    }
  }

  onVerify() {
    if(this.refs.phone){
      this.refs.phone.blur();
    }
    if(this.refs.code){
      this.refs.code.blur();
    }
    if(this.state.smsToken == ''){
      this.setState({invalid: true});
    } else {
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
    const fetching =  <ActivityIndicatorIOS
                        animating={true}
                        color={'#808080'}
                        style={styles.activity}
                        size={'small'} />
    const errorMessage = <Text style={styles.errorText}>Invalid Signup</Text>
    let signup = (
      <View style={styles.login}>

        <Text style={styles.headerText}>Use your phone number to log in to Sous.</Text>
        <Text style={styles.centered}>First, we will send you a <Text style={styles.boldText}>text message</Text> to verify your account.</Text>
        <View style={styles.inputContainer}>
          <Icon name='material|phone' size={30} color='#aaa' style={styles.iconFace}/>
          <TextInput
            ref='phone'
            style={styles.input}
            value={this.state.phoneNumber}
            keyboardType='phone-pad'
            placeholder='Phone Number'
            onChange={(e) => {

              this.setState({phoneNumber: e.nativeEvent.text, invalid: false})
            }}
          />
        </View>
        { session.errors || this.state.invalid ? errorMessage : <Text>{' '}</Text> }
        <TouchableHighlight
          underlayColor='#C6861D'
          onPress={() => {
            this.onSignup()
          }}
          style={styles.button}>
          <Text style={styles.buttonText}>Send SMS</Text>
        </TouchableHighlight>
      </View>
    );
    if(this.state.smsSent === true){
      const formattedPhoneNumber = this.formatPhoneNumber(session.phoneNumber);
      signup = (
        <View style={styles.login}>
          <Text style={styles.headerText}>We just sent a text to</Text>
          <Text style={[styles.boldText, styles.centered, styles.largeText]}>{formattedPhoneNumber}</Text>
          <TouchableHighlight
            onPress={() => {
              this.onSignup()
            }}
            style={[styles.smallButton, styles.buttonLinkWrap]}>
            <Text style={styles.buttonLink}>Send again</Text>
          </TouchableHighlight>
          <Text style={styles.centered}>Enter the verification code below to sign in.</Text>
          <View style={styles.inputContainer}>
            <TextInput
              ref='code'
              style={styles.input}
              value={this.state.smsToken}
              keyboardType='phone-pad'
              textAlign='center'
              onChange={(e) => {
                this.setState({smsToken: e.nativeEvent.text, invalid: false})
              }}
            />
          </View>
          { session.errors || this.state.invalid ? errorMessage : <Text>{' '}</Text> }
          <TouchableHighlight
            onPress={() => {
              this.onVerify()
            }}
            style={styles.button}>
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableHighlight>
        </View>
      );
    }

    return (
      <ScrollView
        automaticallyAdjustContentInsets={false}
        ref="scrollView"
        style={[
          styles.container,
          this.props.ui.keyboard.visible && {height: this.props.ui.keyboard.screenY}
        ]}
      >
        <View style={styles.navbar}>
          <Text style={styles.signup}>Signup/Login</Text>
        </View>
        <View style={styles.logoContainer}>
          <Image source={require('image!Logo')} style={styles.logoImage}></Image>
        </View>
        {signup}
      </ScrollView>
    );
  }
};

let styles = StyleSheet.create({
  container: {
  },
  navbar: {
    height: 40,
    backgroundColor: '#1825AD',
    flex: 1,
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
    marginTop: 10,
    marginBottom: 15,
    borderRadius: 100/2,
    backgroundColor: '#1825AD',
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
    paddingLeft: 5,
    paddingRight: 5,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderColor: '#777',
    marginLeft: 10,
  },
  errorPlaceholder: {
    height: 0
  },
  iconFace: {
    width: 70,
    height: 70,
  },
  iconLock: {
    width: 70,
    height: 70,
  },
  underline: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
    marginLeft: 10
  },
  input: {
    flex: 1,
    height: 50,
    padding: 4,
    marginRight: 5,
    marginTop: 10,
    fontSize: 20,
    borderRadius: 8,
    color: '#333',
    fontWeight: 'bold',
    fontFamily: 'OpenSans'
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  button: {
    height: 56,
    backgroundColor: '#F5A623',
    alignSelf: 'center',
    width: 150,
    marginTop: 20,
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
    backgroundColor: '#F5A623',
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
    color: '#1825AD',
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
    justifyContent: 'center'
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
