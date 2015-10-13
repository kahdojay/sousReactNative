import { Icon, } from 'react-native-icons';
import _ from 'lodash'
import React from 'react-native'

const {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS,
} = React;

class Signup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      invalid: false,
      email: '',
      password: '',
      username: '',
      teamFound: false,
      lookingForTeam: false,
      teamName: '',
      teamId: null
    }
  }

  componentWillMount() {
    this.props.onResetSession();
  }

  onSignup() {
    if(this.state.email == '' || this.state.password == ''){
      this.setState({invalid: true});
    } else {
      // first reset all the stations and tasks and ... ?
      // this.props.onResetSessionInfo();
      // send the signup request
      this.props.onSignup(Object.assign({}, {
        email: this.state.email,
        password: this.state.password,
        username: this.state.username,
        teamName: this.state.teamName,
        teamId: this.state.teamId
      }));
      this.setState({ password: '' })
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

  render() {
    let fetching =  <ActivityIndicatorIOS
                        animating={true}
                        color={'#808080'}
                        style={styles.activity}
                        size={'small'} />
    let errorMessage = <Text style={styles.errorText}>Invalid Signup</Text>
    let teamLookupStatus = (this.state.teamFound) ? <Text style={[styles.teamLookup, styles.teamFound]}>Team Found</Text> : <Text style={[styles.teamLookup, styles.teamNew]}>New Team</Text>
    let teamLookup = (this.state.lookingForTeam) ? <View style={styles.teamLookupContainer}>{teamLookupStatus}</View> : <View/>
    return (
      <View style={styles.container}>
        <View style={styles.login}>
          <View style={styles.inputContainer}>
            <Icon name='material|email' size={30} color='#aaa' style={styles.iconFace}/>
            <TextInput
              style={styles.input}
              value={this.state.email}
              placeholder='Email'
              onChangeText={(text) => {
                this.setState({email: text, invalid: false})
              }}
            />
          </View>
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
          { this.props.session.errors || this.state.invalid ? errorMessage : <Text>{' '}</Text> }
          <TouchableHighlight
            onPress={() => {
              this.onSignup()
            }}
            style={styles.button}>
            <Text style={styles.buttonText}>Signup</Text>
          </TouchableHighlight>
          <View style={styles.activityContainer}>
            { this.props.session.isFetching ? fetching : <View /> }
          </View>
        </View>
      </View>
    );
  }
};

let styles = StyleSheet.create({
  container: {
    flex: 1,
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
    justifyContent: 'flex-start'
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
