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
      teamFound: false,
      lookingForTeam: false,
      team_name: '',
      team_id: null
    }
    this.teams = {}
  }

  componentWillMount() {
    console.log("PROPS", this.props);
    this.props.onResetSession();
    // setup the teams object to lowercase the name attribute
    this.teams = _(this.props.teams.data).chain()

      .thru((item) => {
        let key = Object.keys(item)[0]
        let newItem = Object.assign({}, item)
        if (newItem[key] != undefined) {
          newItem[key].name_tolower = newItem[key].name.toLowerCase()
        }
        return newItem;
      }).value();
  }

  onSignup() {
    if(this.state.email == '' || this.state.password == '' || this.state.team_name == ''){
      this.setState({invalid: true});
    } else {
      // first reset all the stations and tasks and ... ?
      this.props.onResetSessionInfo();
      // send the signup request
      this.props.onSignup(Object.assign({}, {
        email: this.state.email,
        password: this.state.password,
        team_name: this.state.team_name,
        team_id: this.state.team_id
      }));
      this.setState({ password: '' })
    }
  }

  render() {
    let fetching =  <ActivityIndicatorIOS
                        animating={true}
                        color={'#808080'}
                        size={'small'} />
    let errorMessage = <Text style={styles.errorText}>Invalid Signup</Text>
    let teamLookupStatus = (this.state.teamFound) ? <Text style={[styles.teamLookup, styles.teamFound]}>Team Found</Text> : <Text style={[styles.teamLookup, styles.teamNew]}>New Team</Text>
    let teamLookup = (this.state.lookingForTeam) ? <View style={styles.teamLookupContainer}>{teamLookupStatus}</View> : <View/>
    return (
      <View style={styles.container}>
        <View style={styles.login}>
          { this.props.session.errors || this.state.invalid ? errorMessage : <Text>{' '}</Text> }
          <TextInput
            style={styles.input}
            value={this.state.email}
            placeholder='Email'
            onChangeText={(text) => {
              this.setState({email: text, invalid: false})
            }}/>
          <TextInput
            secureTextEntry={true}
            style={styles.input}
            value={this.state.password}
            placeholder='Password'
            onChangeText={(text) => {
              this.setState({password: text, invalid: false})
            }}/>
          <View>
            <TextInput
              style={styles.input}
              value={this.state.team_name}
              placeholder='Team'
              onChangeText={(text) => {
                let updateState = {
                  invalid: false,
                  team_name: text,
                  team_id: null,
                  teamFound: false,
                  lookingForTeam: true,
                }
                if(text == ''){
                  updateState.lookingForTeam = false;
                }
                let foundTeams = _.filter(this.teams, { name_tolower: text.toLowerCase() })
                if( foundTeams.length > 0 ){
                  updateState.team_id = foundTeams[0].id;
                  updateState.teamFound = true;
                }
                this.setState(updateState)
              }}/>
            {teamLookup}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableHighlight
              onPress={() => {
                this.onSignup()
              }}
              style={[styles.button, styles.buttonPrimary]}>
              <Text style={styles.buttonText}>Signup</Text>
            </TouchableHighlight>
          </View>
          { this.props.session.isFetching ? fetching : <View /> }
        </View>
      </View>
    );
  }
};

let styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    paddingTop: 80,
  },
  logo: {
    color: 'white',
    fontSize: 20,
    marginBottom: 10
  },
  header: {
    color: 'white',
    fontWeight: 'bold',
  },
  login: {
    justifyContent: 'center',
    paddingLeft: 25,
    paddingRight: 25
  },
  input: {
    margin: 2,
    height: 32,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingLeft: 4,
  },
  buttonContainer: {
    flexDirection: 'row'
  },
  button: {
    flex: 1,
    margin: 2,
    backgroundColor: '#ccc',
    height: 32,
    padding: 8,
  },
  buttonPrimary: {
    backgroundColor: '#89a',
  },
  buttonSecondary: {
    backgroundColor: '#eee',
  },
  buttonText: {
    alignSelf: 'center',
  },
  errorText: {
    color: '#d00'
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
