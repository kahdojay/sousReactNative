import React from 'react-native';
import _ from 'lodash';
import { Icon } from 'react-native-icons';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import AddressBook from 'react-native-addressbook';

const {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
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
        this.props.hideInviteModal()
        this.props.navigateToInviteView([], true)
      } else {
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
        this.props.navigateToInviteView(contacts, false)
      }
    })
  }

  render() {
    return (
      <TouchableOpacity
        onPress={() => this.handleDismiss()}
        underlayColor='transparent'
      >
        <Modal
          animated={true}
          transparent={true}
          visible={this.state.modalVisible}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalInnerContainer}>
              <Text style={[styles.header]}>{`Invite to ${this.props.currentTeam.name}`}</Text>
              <Text style={styles.modalText}>{`Add a friend or co-worker to your team:`}</Text>
              <TextInput
                style={styles.input}
                keyboardType='numeric'
                placeholder={'Phone #'}
                textAlign='center'
                onChangeText={(text) => this.setState({text})}
                value={this.state.text}
                />
              <View style={styles.row}>
                <View style={styles.buttonContainer}>
                  <TouchableHighlight
                    onPress={() => this.handleSubmit()}
                    style={styles.option}
                    underlayColor='transparent'
                  >
                    <View style={styles.buttonTextContainer}>
                      <Text style={styles.buttonText}>Send SMS</Text>
                    </View>
                  </TouchableHighlight>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableHighlight
                    onPress={() => this.navigateToInviteView()}
                    style={styles.option}
                    underlayColor='transparent'
                  >
                    <View style={styles.buttonTextContainer}>
                      <Text style={styles.buttonText}>Search Contacts</Text>
                    </View>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
            <KeyboardSpacer />
          </View>
        </Modal>
      </TouchableOpacity>
    );
  }
};

var {
  height: deviceHeight,
  width: deviceWidth,
} = Dimensions.get('window');

var styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalInnerContainer: {
    borderRadius: Sizes.modalInnerBorderRadius,
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    justifyContent: 'space-around',
  },
  header: {
    alignSelf: 'center',
    fontSize: 22,
    fontFamily: 'OpenSans',
    color: Colors.lightBlue,
  },
  modalText: {
    color: Colors.darkGrey,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'OpenSans',
    marginLeft: 5,
    marginBottom: 10
  },
  input: {
    height: 40,
    borderRadius: Sizes.inputBorderRadius,
    borderColor: Colors.lightGrey,
    borderWidth: 1,
    marginBottom: 15,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonContainer: {
    borderRadius: Sizes.inputBorderRadius,
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.lightGrey,
  },
  option: {
    flex: 1,
  },
  buttonTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 14,
  },
  buttonText: {
    flex: 1,
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
    fontSize: 12,
    height: 35,
    color: Colors.lightBlue,
  },
});

export default InviteModal
