import React from 'react-native'

const {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS,
} = React;

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  componentWillMount(){
    this.props.onResetSession();
    if(this.props.session.login !== ''){
      this.setState({
        email: this.props.session.login,
        password: ''
      })
    }
  }

  render() {
    let fetching =  <ActivityIndicatorIOS
                        animating={true}
                        color={'#808080'}
                        size={'small'} />
    let errorMessage = <Text style={styles.errorText}>Invalid Login</Text>
    return (
      <View style={styles.container}>
        <View style={styles.nav}>
          <Text style={styles.logo}>Sous</Text>
          <Text style={styles.header}>Welcome Back</Text>
        </View>
        <View style={styles.login}>
          { this.props.session.errors ? errorMessage : <Text>{' '}</Text> }
          <TextInput
            style={styles.input}
            value={this.state.email}
            placeholder='Email'
            onChangeText={(text) => {
              this.setState({email: text, password: this.state.password})
            }}/>
          <TextInput
            secureTextEntry={true}
            style={styles.input}
            value={this.state.password}
            placeholder='Password'
            onChangeText={(text) => {
              this.setState({password: text, email: this.state.email})
            }}/>
          <View style={styles.buttonContainer}>
            <TouchableHighlight
              onPress={() => this.props.navigator.replace({
                name: 'Signup'
              })}
              style={[styles.button, styles.buttonSecondary]}>
              <Text style={styles.buttonText}>Signup</Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => this.props.onLogin(this.state)}
              style={[styles.button, styles.buttonPrimary]}>
              <Text style={styles.buttonText}>Login</Text>
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
  nav: {
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    padding: 15
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
  }
})

module.exports = Login;
