import React from 'react-native';
import _ from 'lodash';
import { Icon } from 'react-native-icons';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import GenericModal from './modal/genericModal';
import AddressBook from 'react-native-addressbook';

const {
  ActivityIndicatorIOS,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} = React;

class InviteModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      animated: true,
      modalVisible: false,
      transparent: true,
      text: '',
      inputError: false,
      showLoading: false,
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
      this.setState({
        text: '',
        inputError: true,
      });
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
            this.setState({
              showLoading: true,
            }, () => {
              this.navigateToInviteView()
            })
          }
        }}
      >
        {this.state.showLoading === true ?
        (
          <ActivityIndicatorIOS
            key={'loading'}
            animating={true}
            color={Colors.greyText}
            style={styles.activity}
            size={'large'}
          />
        )
        : (
          <View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                keyboardType='numeric'
                placeholder={'Phone #'}
                placeholderTextColor={Colors.inputPlaceholderColor}
                textAlign='center'
                onChangeText={(text) => {
                  this.setState({
                    text: text,
                    inputError: false,
                  })
                }}
                value={this.state.text}
              />
            </View>
            { this.state.inputError === true ?
              <View style={styles.inputErrorContainer}>
                <Text style={styles.inputErrorText}>Please enter a valid email address.</Text>
              </View>
            : <View style={styles.inputErrorContainer}><Text>{' '}</Text></View> }
          </View>
        )
        }
      </GenericModal>
    );
  }
};

var styles = StyleSheet.create({
  modalText: {
    color: Colors.darkGrey,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'OpenSans',
    marginLeft: 5,
    marginBottom: 10
  },
  inputWrapper: {
    borderBottomColor: Colors.inputUnderline,
    borderBottomWidth: 1,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    padding: 4,
    fontSize: Sizes.inputFieldFontSize,
    color: Colors.inputTextColor,
    fontFamily: 'OpenSans',
    textAlign: 'center',
    height: Sizes.inputFieldHeight,
  },
  inputErrorContainer: {
    flex: 1,
  },
  inputErrorText: {
    color: Colors.red,
    alignSelf: 'center',
  },
  activity: {
    alignSelf: 'center',
    margin: 36,
  },
});

export default InviteModal
