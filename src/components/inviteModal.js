import React from 'react-native';
import _ from 'lodash';
import { Icon } from 'react-native-icons';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import GenericModal from './modal/genericModal';
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
      <GenericModal
        ref='genericModal'
        modalVisible={this.state.modalVisible}
        onHideModal={::this.handleDismiss}
        modalHeaderText={`Invite to ${this.props.currentTeam ? this.props.currentTeam.name : 'Team'}`}
        modalSubHeaderText={`Add a friend or co-worker to your team`}
        leftButton={{
          text: 'Send SMS',
          onPress: () => {
            this.handleSubmit()
          }
        }}
        rightButton={{
          text: 'Contacts',
          onPress: () => {
            this.navigateToInviteView()
          }
        }}
      >
        <TextInput
          style={styles.input}
          keyboardType='numeric'
          placeholder={'Phone #'}
          textAlign='center'
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
        />
      </GenericModal>
    );
  }
};

var {
  height: deviceHeight,
  width: deviceWidth,
} = Dimensions.get('window');

var styles = StyleSheet.create({
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
    marginBottom: 15,
  },
});

export default InviteModal
