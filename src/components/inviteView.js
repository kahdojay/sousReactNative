import React from 'react-native';
import _ from 'lodash';
import CheckBox from './checkbox';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
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
      selectedContacts: [],
    }
  }

  toggleSelectContact(contactNumber) {
    let selected = this.state.selectedContacts
    let idx = selected.indexOf(contactNumber)

    if (idx === -1)
      selected.push(contactNumber)
    else
      selected.splice(idx, 1)

    this.setState({
      selectedContacts: selected
    })
  }

  formatNumber(contactNumber) {
    let pat = /(\(|\)|\s|\-)/g
    let newNumber = contactNumber.replace(pat, '')
    if (newNumber.toString().length === 10)
      newNumber = newNumber.slice(0,3) + '.' + newNumber.slice(3,6) + '.' + newNumber.slice(6,10)
    return newNumber
  }

  render() {
    let userContacts = this.props.contacts.map(function (contact, idx) {
      contact.firstName = contact.firstName ? _.capitalize(contact.firstName) : ''
      return contact
    })
    let sortedContacts = _.sortBy(userContacts, 'firstName')
    let displayContacts = []
    let idx = 0

    sortedContacts.forEach((contact) => {
      contact.phoneNumbers.forEach((numberDetails) => {
        let contactNumber = this.formatNumber(numberDetails.number)
        displayContacts.push(
          <TouchableHighlight 
            key={idx} 
            underlayColor="#eee"
            onPress={() => {
              this.toggleSelectContact(contactNumber)
            }}
          >
            <View style={styles.contactRow} >
              <View style={styles.selectIndicator} >
                <CheckBox
                  checked={this.state.selectedContacts.indexOf(contactNumber) !== -1}
                  label=''
                  onChange={() => {
                    this.toggleSelectContact(contactNumber)
                  }}
                />
              </View>
              <View style={styles.contactDetails}>
                <View style={styles.nameContainer} >
                  <Text style={{fontWeight: 'bold'}}>{contact.firstName} </Text>
                  <Text>{contact.lastName}</Text>
                </View>
                <Text style={styles.phoneNumber}>{contactNumber}</Text>
              </View>
            </View>
          </TouchableHighlight>
        )
        idx += 1
      })
    })

    let deniedModal = 
    <View style={styles.modalContainer}>
      <View style={styles.modalInnerContainer}>
        <Text style={styles.centerText}>To invite your contacts, please go to:</Text>
        <Text style={styles.centerText}>Settings > Sous > Enable "Contacts"</Text>
      </View>
    </View>

    if (this.props.denied) {
      return (
        {deniedModal}
      );
    } else {
      return (
        <View style={styles.container}>
          <ScrollView
            automaticallyAdjustContentInsets={false}
            style={styles.contactsContainer}
          >
            {displayContacts}
          </ScrollView>
          <View style={styles.submitContainer}>
            <TouchableHighlight
              style={styles.submit}
              underlayColor={Colors.buttonPress}
              onPress={() => {
                this.props.onSMSInvite(this.state.selectedContacts)
              }}>
              <Text style={styles.submitText}>Send SMS</Text>
            </TouchableHighlight>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contactsContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  contactRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingRight: 10,
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  selectIndicator: {
    paddingTop: 5,
  },
  contactDetails: {
  },
  nameContainer: {
    flexDirection: 'row',
    fontFamily: 'OpenSans',
  },
  phoneNumber: {
    fontSize: 10,
    color: Colors.lightGrey,
  },
  submitContainer: {
    flexDirection: 'row',
    borderTopColor: Colors.separatorColor,
    borderTopWidth: 1,
  },
  submit: {
    flex: 1,
    height: 32,
    backgroundColor: Colors.blue,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
  submitText: {
    alignSelf: 'center',
    fontSize: 16,
    color: 'white',
    fontFamily: 'OpenSans'
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalInnerContainer: {
    marginTop: -40,
    width: 280,
    borderRadius: Sizes.modalInnerBorderRadius,
    backgroundColor: Colors.mainBackgroundColor,
  },
  centerText: {
    padding: 5,
    textAlign: 'center',
  },
})

InviteView.propTypes = {
};

export default InviteView
