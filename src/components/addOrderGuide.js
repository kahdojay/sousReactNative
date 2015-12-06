import { Icon, } from 'react-native-icons';
import _ from 'lodash';
import React from 'react-native';
import Colors from '../utilities/colors';

const {
  Dimensions,
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableHighlight,
  ScrollView,
  ActivityIndicatorIOS,
} = React;

const runTimeDimensions = Dimensions.get('window')

class AddOrderGuide extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inputError: false,
      emailAddress: this.props.emailAddress
    }
  }

  render() {
    return (
      <ScrollView
        automaticallyAdjustContentInsets={false}
        ref="scrollView"
        style={styles.container}
      >
        <View style={styles.logoContainer}>
          <Image source={require('image!Logo')} style={styles.logoImage}></Image>
        </View>
        <View style={styles.orderGuideContainer}>
          <Text style={styles.headerText}>Every Order, One Tap</Text>
          <View style={styles.instructions}>
            <Text style={styles.centered}>Send orders to your suppliers from Sous</Text>
            <Text style={styles.centered}>for free.</Text>
          </View>
          <TouchableHighlight
            underlayColor='transparent'
            onPress={() => {
              this.props.onLearnMore()
            }}
            style={[styles.smallButton, styles.buttonLinkWrap]}>
            <Text style={styles.buttonLink}>Learn More</Text>
          </TouchableHighlight>

          <View style={styles.sendEmail}>
            <View style={styles.infoField}>
              <TextInput
                style={styles.input}
                value={this.state.emailAddress}
                onChange={(e) => {
                  this.setState({
                    inputError: false,
                    emailAddress: e.nativeEvent.text
                  })
                }}
                placeholder={"Email Address"}/>
            </View>
            <View style={styles.separator}></View>
            { this.state.inputError === true ?
              <View style={styles.inputErrorContainer}>
                <Text style={styles.inputErrorText}>Please enter a valid email address.</Text>
              </View>
            : <View style={styles.inputErrorContainer} /> }
          </View>

          <TouchableHighlight
            underlayColor={Colors.darkBlue}
            onPress={() => {
              if(this.state.emailAddress !== ''){
                this.props.onSendEmail(this.state.emailAddress)
              } else {
                this.setState({
                  inputError: true
                })
              }
            }}
            style={styles.buttonActive}
          >
            <Text style={styles.buttonText}>E-mail Sous</Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
    );
  }
};

let styles = StyleSheet.create({
  container: {
    flex: 1
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
  separator: {
    height: 1,
    borderColor: '#eee',
    borderWidth: 1,
  },
  logoContainer: {
    marginTop: 10,
    marginBottom: 5,
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
  orderGuideContainer: {
    flex: 1,
    paddingLeft: 5,
    paddingRight: 5,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  instructions: {
    marginTop: 10,
    marginBottom: 5,
  },
  sendEmail: {
    flex: 1,
    backgroundColor: 'white',
    margin: 10,
  },
  infoField: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#fff',
    height: 45,
    paddingLeft: 5,
    paddingTop: 15,
    flexDirection: 'row',
  },
  inputErrorContainer: {
    height: 10,
  },
  inputErrorText: {
    color: Colors.red,
    alignSelf: 'center'
  },
  input: {
    flex: 1,
    padding: 4,
    marginRight: 5,
    marginBottom: 5,
    fontSize: 14,
    borderRadius: 8,
    color: '#333',
    fontWeight: 'bold',
    fontFamily: 'OpenSans',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonActive: {
    height: 46,
    backgroundColor: Colors.button,
    alignSelf: 'center',
    width: 250,
    marginTop: 20,
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

export default AddOrderGuide
