import React from 'react-native';
import _ from 'lodash';
import { Icon } from 'react-native-icons';
import Colors from '../utilities/colors';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import AddressBook from 'react-native-addressbook';

const {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Dimensions,
  ScrollView,
} = React;

class InviteModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      animated: true,
      modalVisible: false,
      transparent: true,
      text: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      modalVisible: nextProps.modalVisible,
    })
  }

  handleDismiss() {
    this.props.hideInviteModal()
  }

  handleSubmit() {
    if (this.state.text === null || this.state.text === '') {
      this.setState({text: ''});
      this.props.hideInviteModal()
    } else {
      this.props.onSMSInvite([this.state.text]);
      this.setState({text: ''});
      this.props.hideInviteModal()
    }
  }

  navigateToInviteView() {
    AddressBook.getContacts( (err, contacts) => {
      if (err && err.type === 'permissionDenied') {
        // TODO: show error to user
        // console.log('error fetching contacts')
      }
      else {
        // console.log('contacts', contacts)
        contacts = _.chain(contacts)
          // filter contacts with no numbers
          .filter(function(c) { return c.phoneNumbers[0]; })
          // slip checkbox state into contact
          .map(function(c) {
            c.selected = false;
            return c;
          })
          .value();
        this.props.hideInviteModal()
        this.props.navigateToInviteView(contacts)
      }
    })
  }

  render() {
    return (
      <Modal
        animated={true}
        transparent={true}
        visible={this.state.modalVisible}
      >
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <Text style={[styles.header]}>{`Invite to ${this.props.currentTeam ? this.props.currentTeam.name : 'Team'}`}</Text>
            <Text style={styles.text}>{`Add someone to your team by sending them an SMS:`}</Text>
            <TextInput
              style={styles.input}
              keyboardType='numeric'
              textAlign='center'
              onChangeText={(text) => this.setState({text})}
              value={this.state.text}
              />
            <View style={styles.row}>
              <TouchableHighlight
                onPress={() => this.handleDismiss()}
                style={styles.option}
                underlayColor='transparent'
              >
                <Text style={styles.buttonText}>Dismiss</Text>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => this.handleSubmit()}
                style={styles.option}
                underlayColor='transparent'
              >
                <Text style={styles.buttonText}>Send</Text>
              </TouchableHighlight>
            </View>
            <TouchableHighlight
              onPress={() => this.navigateToInviteView()}
              style={styles.option}
              underlayColor='transparent'
            >
              <Text style={styles.buttonText}>Search Contacts</Text>
            </TouchableHighlight>
          </View>
          <KeyboardSpacer />
        </View>
      </Modal>
    );
  }
};

var {
  height: deviceHeight,
  width: deviceWidth,
} = Dimensions.get('window');

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center'
  },
  innerContainer: {
    borderRadius: 5,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center'
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    paddingBottom: 10,
    fontFamily: 'OpenSans',
    color: Colors.blue,
  },
  text: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'OpenSans',
    marginLeft: 5,
    marginBottom: 10
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 5,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    alignItems: 'center'
  },
  option: {
    marginLeft: 5,
    marginRight: 5,
    flex: 1,
  },
  buttonText: {
    flex: 1,
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingRight: 10,
    height: 35,
    justifyContent: 'center',
    color: Colors.blue,
  },
});

export default InviteModal
