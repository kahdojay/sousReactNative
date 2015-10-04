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
          <TouchableHighlight
            onPress={() => this.props.onLogin(this.state)}
            style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableHighlight>
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
    backgroundColor: '#cde',
    paddingLeft: 4,
  },
  button: {
    margin: 2,
    alignSelf: 'center',
    width: 80,
    backgroundColor: 'gray',
    height: 32,
    padding: 8,
  },
  buttonText: {
    alignSelf: 'center',
  },
  errorText: {
    color: '#d00'
  }
})

module.exports = Login;
