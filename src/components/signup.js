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
    this.state = {
      invalid: false,
      phoneNumber: this.props.session.phoneNumber,
      smsToken: ''
    }
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

  searchTeams(text) {
    let updateState = {
      invalid: false,
      teamName: text,
      teamId: null,
      teamFound: false,
      lookingForTeam: true,
    }
    let foundTeams;
    if(text == ''){
      updateState.lookingForTeam = false;
    }
    foundTeams = _.filter(this.props.teams.data, function(team) {
      return team.name.toLowerCase() === text.toLowerCase()
    })

    if( foundTeams.length > 0 ){
      updateState.teamId = foundTeams[0].id;
      updateState.teamFound = true;
    }
    this.setState(updateState)
  }

  formatPhoneNumber(phoneNumber){
    return phoneNumber;
  }

  render() {
    const {session} = this.props;
    let fetching =  <ActivityIndicatorIOS
                        animating={true}
                        color={'#808080'}
                        style={styles.activity}
                        size={'small'} />
    let errorMessage = <Text style={styles.errorText}>Invalid Signup</Text>
    let teamLookupStatus = (this.state.teamFound) ? <Text style={[styles.teamLookup, styles.teamFound]}>Team Found</Text> : <Text style={[styles.teamLookup, styles.teamNew]}>New Team</Text>
    let teamLookup = (this.state.lookingForTeam) ? <View style={styles.teamLookupContainer}>{teamLookupStatus}</View> : <View/>
    let formattedPhoneNumber = this.formatPhoneNumber(session.phoneNumber);
    let signup = (
      <View style={styles.login}>
        <Text style={styles.headerText}>Use your phone number to log in to Sous.</Text>
        <Text style={styles.centered}>First, we'll send you a <Text style={styles.boldText}>text message</Text> to verify your account.</Text>
        <View style={styles.inputContainer}>
          <Icon name='material|phone' size={30} color='#aaa' style={styles.iconFace}/>
          <TextInput
            ref='phone'
            style={styles.input}
            value={this.state.phoneNumber}
            keyboardType='phone-pad'
            placeholder='Phone Number'
            onChangeText={(text) => {
              this.setState({phoneNumber: text, invalid: false})
            }}
          />
        </View>
        { session.errors || this.state.invalid ? errorMessage : <Text>{' '}</Text> }
        <TouchableHighlight
          onPress={() => {
            this.onSignup()
          }}
          style={styles.button}>
          <Text style={styles.buttonText}>Send SMS</Text>
        </TouchableHighlight>
      </View>
    );
    if(session.smsSent === true){
      signup = (
        <View style={styles.login}>
          <Text style={styles.headerText}>We just sent a text to</Text>
          <Text style={[styles.boldText, styles.centered, styles.largeText]}>{formattedPhoneNumber}</Text>
          <Text style={styles.centered}>Enter the verification code below to sign in.</Text>
          <View style={styles.inputContainer}>
            <TextInput
              ref='code'
              style={styles.input}
              value={this.state.smsToken}
              keyboardType='phone-pad'
              placeholder='Verification Code'
              onChangeText={(text) => {
                this.setState({smsToken: text, invalid: false})
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
          <TouchableHighlight
            onPress={() => {
              this.onSignup()
            }}
            style={[styles.button, styles.buttonLinkWrap]}>
            <Text style={styles.buttonLink}>Send again</Text>
          </TouchableHighlight>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require('image!Logo')} style={styles.logoImage}></Image>
        </View>
        {signup}
        <View>
          {/* * /}
          <View style={styles.underline}></View>
          <View style={styles.inputContainer}>
            <Icon name='material|lock' size={30} color='#aaa' style={styles.iconFace}/>
            <TextInput
              secureTextEntry={true}
              style={styles.input}
              value={this.state.password}
              placeholder='Password'
              onChangeText={(text) => {
                this.setState({password: text, invalid: false})
              }}/>
          </View>
          <View style={styles.underline}></View>
          <View style={styles.inputContainer}>
            <Icon name='fontawesome|user' size={30} color='#aaa' style={styles.iconFace}/>
            <TextInput
              style={styles.input}
              placeholder='Username'
              onChangeText={(text) => {
                this.setState({username: text, invalid: false})
              }}/>
          </View>
          <View style={styles.underline}></View>
          <View style={styles.inputContainer}>
            <Icon name='fontawesome|users' size={30} color='#aaa' style={styles.iconFace}/>
            <TextInput
              style={styles.input}
              value={this.state.teamName}
              placeholder='Team'
              onChangeText={this.searchTeams.bind(this)}/>
            {teamLookup}
          </View>
          <View style={styles.underline}></View>
          { session.errors || this.state.invalid ? errorMessage : <Text>{' '}</Text> }
          <TouchableHighlight
            onPress={() => {
              this.onSignup()
            }}
            style={styles.button}>
            <Text style={styles.buttonText}>Signup</Text>
          </TouchableHighlight>
          <View style={styles.activityContainer}>
            { session.isFetching ? fetching : <View /> }
          </View>
          {/* */}
        </View>
      </View>
    );
  }
};

let styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerText: {
    fontSize: 21,
    alignSelf: 'center'
  },
  centered: {
    alignSelf: 'center'
  },
  boldText: {
    fontWeight: 'bold'
  },
  largeText: {
    fontSize: 23
  },
  summaryText: {
    alignSelf: 'center'
  },
  logoContainer: {
    marginTop: 40,
    borderRadius: 100/2,
    backgroundColor: '#1825AD',
    padding: 15,
    width: 100,
    height: 100,
    alignSelf: 'center'
  },
  logoImage: {
    width: 70,
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
    borderColor: 'black'
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
    borderBottomWidth: 2,
    borderBottomColor: '#e6e6e6',
    marginLeft: 10
  },
  input: {
    flex: 1,
    height: 50,
    padding: 4,
    marginRight: 5,
    marginTop: 10,
    fontSize: 23,
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
  buttonLinkWrap: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#1825AD',
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

  teamLookupContainer: {
    position: 'absolute',
    right: 7,
    top: 7,
    padding: 2,
    width: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#eee',
  },
  teamLookup: {
    alignSelf: 'center',
    color: '#ccc'
  },
  teamFound: {
  },
  teamNew: {
  }
})

module.exports = Signup;
