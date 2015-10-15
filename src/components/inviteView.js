import React from 'react-native';
import _ from 'lodash';
import AddressBook from 'react-native-addressbook';
import CheckBox from 'react-native-checkbox'

const {
  ScrollView,
  View,
  Text,
  TouchableHighlight,
  PropTypes,
  StyleSheet,
} = React;

class InviteView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      contacts: [],
    }
  }

  /* fetches contacts after user approval,
   * ignore contacts with not phoneNumber
   */
  componentDidMount() {
    AddressBook.getContacts( (err, contacts) => {
      if (err && err.type === 'permissionDenied') {
        // TODO: show error to user
        console.log('error fetching contacts')
      }
      else {
        contacts = _.chain(contacts)
          // filter contacts with no numbers vvv
          .filter(function(c) { return c.phoneNumbers[0]; })
          // slip checkbox state into contact
          .map(function(c) {
            c.selected = false;
            return c;
          })
          .value();
        console.log('contacts:', contacts)
        this.setState({ contacts: contacts });
      }
    })
  }

  /* returns first phone number for selected contacts */
  sendSMS() {
    let resultSet = _.chain(this.state.contacts)
      .filter(function(c) { return c.selected; })
      .map('phoneNumbers[0].number')
      .value();
    // TODO send numbers to twilio
    console.log('smss to send', resultSet)
    this.props.onSMSInvite(resultSet);
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        {
          this.state.contacts.map(function(contact, idx) {
            return (
              <TouchableHighlight key={idx} >
                <View style={styles.contactRow} >
                  <Text>{contact.firstName} {contact.lastName}</Text>
                  <CheckBox
                    label=''
                    onChange={(checked) => {
                      this.setState({ contacts: this.state.contacts.map(function(c) {
                        if (c.recordID === contact.recordID) {
                          c.selected = !c.selected;
                        }
                        return c;
                      })})
                    }}
                    checked={contact.selected}
                  />
                </View>
              </TouchableHighlight>
            );
          }, this)
        }
        <TouchableHighlight onPress={() => this.sendSMS()}>
          <Text>sendsms</Text>
        </TouchableHighlight>
      </ScrollView>
    );
  }
}

let styles = StyleSheet.create({
  contactRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingLeft: 10,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
})

InviteView.propTypes = {
};

export default InviteView
