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

  handleChange(e) {
    var text = e.nativeEvent.text;
    this.setState({email: text})
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
          <Text style={styles.header}>Welcome Back</Text>
          <TouchableHighlight
            onPress={() => this.props.navigator.replace({
              name: 'Signup'
            })}
            style={[styles.button, styles.buttonSecondary]}>
            <Text style={styles.buttonText}>Signup</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.login}>
          { this.props.session.errors ? errorMessage : <Text style={styles.errorPlaceholder}>{' '}</Text> }
          <TextInput
            style={styles.input}
            value={this.state.email}
            placeholder='E-mail Address'
            onChangeText={(text) => {
              this.setState({email: text, password: this.state.password})
            }}/>
          <View style={styles.underline}></View>
          <TextInput
            secureTextEntry={true}
            style={styles.input}
            value={this.state.password}
            placeholder='Password'
            onChangeText={(text) => {
              this.setState({password: text, email: this.state.email})
            }}/>
          
          <View style={styles.underline}></View>
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
  errorPlaceholder: {
    height: 0
  },
  container: {
    flex: 1,
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  underline: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#e6e6e6',
    marginLeft: 10
  },
  nav: {
    backgroundColor: '#1825AD',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    margin: 0
  },
  logo: {
    color: 'white',
    fontSize: 20,
  },
  header: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 27,
    letterSpacing: .1,
    fontFamily: 'OpenSans'
  },
  login: {
    paddingLeft: 5,
    paddingRight: 5
  },
  input: {
    height: 50,
    padding: 4,
    marginRight: 5,
    fontSize: 23,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    color: '#333',
    fontWeight: 'bold'
  },
  buttonContainer: {
    flexDirection: 'row'
  },
  button: {
    height: 56,
    backgroundColor: '#F5A623',
    alignSelf: 'center',
    width: 150,
    marginTop: 30,
    justifyContent: 'center',
    borderRadius: 3
  },
  buttonPrimary: {
    backgroundColor: '#89a',
  },
  buttonSecondary: {
    backgroundColor: '#eee',
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    letterSpacing: .1
  },
  errorText: {
    color: '#d00'
  }
})

module.exports = Login;
