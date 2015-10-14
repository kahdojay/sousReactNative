import React from 'react-native';
import AddressBook from 'react-native-addressbook';
import CheckBox from 'react-native-checkbox'

const {
  ScrollView,
  View,
  Text,
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

  componentDidMount() {
    AddressBook.getContacts( (err, contacts) => {
      if (err && err.type === 'permissionDenied') {
        // TODO: show error to user
        console.log('error fetching contacts')
      }
      else {
        console.log('contacts:', contacts)
        this.setState({ contacts: contacts });
      }
    })
  }

  // accepts an array of numbers (cleaned/unclean tbd)
  sendSMS(numbers) {

  }

  render() {
    return (
      <ScrollView style={styles.container}>
        {
          this.state.contacts.map(function(contact, idx) {
            return (
              <View
                style={styles.contactRow}
                key={idx}
              >
                <Text>{contact.firstName} {contact.lastName}</Text>
                <CheckBox
                  label=''
                  onChange={() => console.log('tapped')}
                  checked={false}
                />
              </View>
            );
          })
        }
      </ScrollView>
    );
  }
}

let styles = StyleSheet.create({
  contactRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  }
})

InviteView.propTypes = {
};

export default InviteView
