import React from 'react-native';
import _ from 'lodash';
import CheckBox from './checkbox';
import Colors from '../utilities/colors';
import { Icon } from 'react-native-icons';
import Sizes from '../utilities/sizes';
const {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableHighlight,
  PropTypes,
  StyleSheet,
} = React;

class InviteView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedContacts: [],
      query: '',
      searching: false,
      searchedContacts: []
    }
  }

  searchForContacts() {
    if(this.state.query !== ''){
      this.setState({
        searching: true,
        searchedContacts: [],
      }, () => {
        const searchedContacts = _.filter(this.props.contacts, (contact) => {
          let fullName = ''
          fullName += contact.firstName ? contact.firstName.toLowerCase() : ''
          fullName += ' '
          fullName += contact.lastName ? contact.lastName.toLowerCase() : ''
          return fullName.indexOf(this.state.query.toLowerCase()) !== -1
        })
        this.setState({
          searching: false,
          searchedContacts: searchedContacts.slice(0,10)
        })
      })
    } else {
      this.setState({
        searchedContacts: []
      })
    }
  }

  getSelectedIndex(contactNumber) {
    let contactNumbers = this.state.selectedContacts.map(function(contactObj) { return contactObj.number })
    return contactNumbers.indexOf(contactNumber)
  }

  toggleSelectContact(contactNumber, firstName, lastName) {
    let contact = {
      number: contactNumber,
      firstName: firstName,
      lastName: lastName
    }
    let selected = this.state.selectedContacts
    let idx = this.getSelectedIndex(contactNumber)
    
    if (idx === -1)
      selected.push(contact)
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
    let sortedContacts =  this.state.searchedContacts.length > 0 ? this.state.searchedContacts : _.sortBy(userContacts, 'firstName')
    let displayContacts = []
    let idx = 0

    sortedContacts.forEach((contact) => {
      let firstName = contact.firstName ? _.capitalize(contact.firstName) : ''
      let lastName = contact.lastName ? _.capitalize(contact.lastName) : ''
      contact.phoneNumbers.forEach((numberDetails) => {
        let contactNumber = this.formatNumber(numberDetails.number)
        displayContacts.push(
          <TouchableHighlight 
            key={idx} 
            underlayColor="#eee"
            onPress={() => {
              this.toggleSelectContact(contactNumber, firstName, lastName)
            }}
          >
            <View style={styles.contactRow} >
              <CheckBox
                checked={this.getSelectedIndex(contactNumber) !== -1}
                label=''
                onChange={() => {
                  this.toggleSelectContact(contactNumber, firstName, lastName)
                }}
              />
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

    let searchBar =
      <View>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            value={this.state.query}
            placeholder='Search'
            onChangeText={(text) => {
              this.setState({
                query: text
              }, () => {
                this.searchForContacts()
              })
            }}
            onSubmitEditing={::this.searchForContacts}
          />
          { this.state.query !== '' ?
            <TouchableHighlight
              onPress={() => {
                this.setState({
                  searching: false,
                  query: '',
                  searchedContacts: []
                })
              }}
              underlayColor='transparent'
            >
              <Icon name='material|close' size={20} color='#999' style={styles.iconClose} />
            </TouchableHighlight>
          : <View /> }
        </View>
      </View>

    let sendSMSButton =
      <View style={styles.submitContainer}>
        <TouchableHighlight
          style={styles.submitButton}
          underlayColor={Colors.lightBlue}
          onPress={() => {
            this.props.onSMSInvite(this.state.selectedContacts)
          }}>
          <Text style={styles.submitText}>Send SMS</Text>
        </TouchableHighlight>
      </View>

    if (this.props.denied) {
      return (
        {deniedModal}
      );
    } else {
      return (
        <View style={styles.container}>
          {searchBar}
          <ScrollView
            automaticallyAdjustContentInsets={false}
            style={styles.contactsContainer}
          >
            {displayContacts}
          </ScrollView>
          {sendSMSButton}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInputContainer: {
    margin: 10,
    flexDirection: 'row',
    position: 'relative',
  },
  searchInput: {
    textAlign: 'center',
    flex: 1,
    height: 26,
    backgroundColor: Colors.mainBackgroundColor,
    color: '#777',
    fontFamily: 'OpenSans',
    fontSize: 14,
    borderRadius: Sizes.inputBorderRadius,
  },
  iconClose: {
    width: 30,
    height: 30,
    borderRadius: 15,
    position: 'absolute',
    right: 5,
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
    borderBottomColor: Colors.separatorColor,
  },
  nameContainer: {
    flexDirection: 'row',
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
  submitButton: {
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
