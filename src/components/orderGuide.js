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
  Modal,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  ActivityIndicatorIOS,
} = React;

const runTimeDimensions = Dimensions.get('window')

class OrderGuide extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inputError: false,
      emailAddress: this.props.emailAddress,
      showAddEmailAddress: false,
    }
  }

  render() {

    const modal = (
      <Modal
        animated={true}
        transparent={true}
        visible={this.state.showAddEmailAddress}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            this.setState({
              showAddEmailAddress: false,
            })
          }}
          style={{flex: 1,}}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalInnerContainer}>
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
                    placeholder={"Your Email Address"}/>
                </View>
                { this.state.inputError === true ?
                  <View style={styles.inputErrorContainer}>
                    <Text style={styles.inputErrorText}>Please enter a valid email address.</Text>
                  </View>
                : <View style={styles.inputErrorContainer} /> }
              </View>
              <View style={[styles.separator, {marginTop: 10}]} />
              <TouchableHighlight
                onPress={() => {
                  if(this.state.emailAddress !== ''){
                    this.props.onSendEmail(this.state.emailAddress)
                  } else {
                    this.setState({
                      inputError: true
                    })
                  }
                }}
                underlayColor='transparent'
              >
                <Text style={styles.modalButtonText}>Send</Text>
              </TouchableHighlight>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    )

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
            <Text style={styles.centered}>Send orders to your suppliers</Text>
            <Text style={styles.centered}>from Sous for free.</Text>
          </View>
          <TouchableHighlight
            underlayColor='transparent'
            onPress={() => {
              this.props.onLearnMore()
            }}
            style={[styles.smallButton, styles.buttonLinkWrap]}>
            <Text style={styles.buttonLink}>Learn More</Text>
          </TouchableHighlight>

          <TouchableHighlight
            underlayColor='white'
            onPress={() => {
              this.props.onNavToOrderGuideUpload()
            }}
            style={[styles.buttonActive, {backgroundColor: 'white'}]}
          >
            <Text style={[styles.buttonText, {color: Colors.button}]}>Send an Order Guide</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={Colors.darkBlue}
            onPress={() => {
              if(this.state.emailAddress !== ''){
                this.props.onSendEmail(this.state.emailAddress)
              } else {
                this.setState({
                  showAddEmailAddress: true
                })
              }
            }}
            style={styles.buttonActive}
          >
            <Text style={styles.buttonText}>Contact Sous</Text>
          </TouchableHighlight>
        </View>
        {modal}
      </ScrollView>
    );
  }
};

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBackgroundColor,
  },
  headerText: {
    fontSize: 18,
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
    paddingTop: 10,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  instructions: {
    marginTop: 15,
    marginBottom: 15,
  },
  sendEmail: {
    flex: 1,
    paddingBottom: 10,
  },
  infoField: {
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
    width: 280,
    marginTop: 10,
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
    backgroundColor: Colors.mainBackgroundColor,
    width: 120,
    marginBottom: 20,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalInnerContainer: {
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 20,
  },
  modalButtonText: {
    textAlign: 'center',
    color: Colors.lightBlue,
    paddingTop: 15,
  },
  separator: {
    height: 0,
    borderBottomColor: Colors.separatorColor,
    borderBottomWidth: 1,
  },
})

export default OrderGuide