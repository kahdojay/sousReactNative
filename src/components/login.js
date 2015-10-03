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
  render() {
    let fetching =  <ActivityIndicatorIOS
                        animating={true}
                        color={'#808080'}
                        size={'small'} />
    let errorMessage = <Text>Invalid Login</Text>
    return (
      <View style={styles.container}>
        { this.props.session.errors ? errorMessage : <View /> }
        <View style={styles.nav}>
          <Text style={styles.header}>Welcome Back</Text>
        </View>
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
    );
  }
};

let styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
  },
  nav: {
    height: 50,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    margin: 2,
    height: 32,
    backgroundColor: '#cde'
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
  }
})

module.exports = Login;
