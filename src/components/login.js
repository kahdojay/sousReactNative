import { Icon, } from 'react-native-icons';
import React from 'react-native';
import Colors from '../utilities/colors';

const {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
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
    if(this.props.session.login !== ''){
      this.setState({
        email: this.props.session.login,
        password: ''
      })
    }
  }

  render() {
    let fetching =  (
      <ActivityIndicatorIOS
        animating={true}
        color={'#808080'}
        style={styles.activity}
        size={'large'}
      />
    )
    let errorMessage = <Text style={styles.errorText}>Invalid Login</Text>
    return (
      <View style={styles.container}>
        <View style={styles.login}>
          <View style={styles.inputContainer}>
            <Icon name='material|email' size={30} color='#aaa' style={styles.iconFace}/>
            <TextInput style={styles.input} value={this.state.email} placeholder='E-mail Address'
              onChangeText={(text) => {
                this.setState({email: text, password: this.state.password})
              }}/>
          </View>
          <View style={styles.underline}></View>

          <View style={styles.inputContainer}>
            <Icon name='material|lock' size={30} color='#aaa' style={styles.iconLock} />
            <TextInput secureTextEntry={true} style={styles.input} value={this.state.password} placeholder='Password'
              onChangeText={(text) => {
                this.setState({password: text, email: this.state.email})
              }}/>
          </View>

          <View style={styles.underline}></View>
          { this.props.session.errors ? errorMessage : <Text style={styles.errorPlaceholder}>{' '}</Text> }
          <TouchableHighlight
            onPress={() => this.props.onLogin(this.state)}
            style={this.props.session.errors ? styles.buttonWithErrors : styles.button}>
            <Text style={styles.buttonText}>Login</Text>
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
    flexDirection: 'row'
  },
  button: {
    height: 56,
    backgroundColor: Colors.gold,
    alignSelf: 'center',
    width: 150,
    marginTop: 30,
    justifyContent: 'center',
    borderRadius: 3,
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
  }
})

module.exports = Login;
