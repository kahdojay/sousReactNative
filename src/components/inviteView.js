import React from 'react-native';
import _ from 'lodash';
import CheckBox from './checkbox';
import Colors from '../utilities/colors';
import { Icon } from 'react-native-icons';
import Sizes from '../utilities/sizes';
import DataUtils from '../utilities/data';

const {
  ActivityIndicatorIOS,
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
      searchedContacts: [],
    }
    this.allContacts = this.renderContacts(this.props.contacts)
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
        searching: false,
        searchedContacts: [],
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

  renderContacts(contacts) {
    let displayContacts = []
    contacts.forEach((contact) => {
      let firstName = contact.firstName ? _.capitalize(contact.firstName) : ''
      let lastName = contact.lastName ? _.capitalize(contact.lastName) : ''
      contact.phoneNumbers.forEach((numberDetails, idx) => {
        const contactNumber = DataUtils.formatPhoneNumber(numberDetails.number)
        let selectedStyle = {}
        let contactDetailsColor = Colors.greyText
        let contactColor = 'black'
        if(this.getSelectedIndex(contactNumber) !== -1){
          contactDetailsColor = 'white'
          contactColor = 'white'
          selectedStyle = styles.selectedRow
        }
        displayContacts.push(
          <TouchableHighlight
            key={`${contact.id}-${idx}`}
            underlayColor="#eee"
            onPress={() => {
              this.toggleSelectContact(contactNumber, firstName, lastName)
            }}
          >
            <View style={[styles.row, selectedStyle]}>
              {/* * /}<CheckBox
                checked={this.getSelectedIndex(contactNumber) !== -1}
                label=''
                onChange={() => {
                  this.toggleSelectContact(contactNumber, firstName, lastName)
                }}
              />{/* */}
              <View style={styles.contactDetails}>
                <View style={styles.nameContainer} >
                  <Text style={[styles.text, styles.textBold, {color: contactColor}]}>{contact.firstName} </Text>
                  <Text style={[styles.text, {color: contactColor}]}>{contact.lastName}</Text>
                </View>
                <Text style={[styles.phoneNumber, {color: contactDetailsColor}]}>{contactNumber}</Text>
              </View>
            </View>
          </TouchableHighlight>
        )
      })
    })

    return displayContacts
  }

  render() {
    let displayContacts = this.state.searchedContacts.length > 0 ? this.renderContacts(this.state.searchedContacts) : this.allContacts

    let searchBar = (
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
          { this.state.searching === true ? 
            <ActivityIndicatorIOS
              key={'loading'}
              animating={true}
              color={Colors.greyText}
              style={styles.activity}
              size={'small'}
            />
            : null }
          { this.state.query !== '' ?
            <TouchableHighlight
              onPress={() => {
                this.setState({
                  searching: false,
                  query: '',
                  searchedContacts: this.props.contacts,
                })
              }}
              underlayColor='transparent'
            >
              <Icon name='material|close' size={20} color='#999' style={styles.iconClose} />
            </TouchableHighlight>
          : <View /> }
        </View>
      </View>
    )

    let sendSMSButton = (
      <TouchableHighlight
        style={styles.submitContainer}
        underlayColor='white'
        onPress={() => {
          this.props.onSMSInvite(this.state.selectedContacts)
        }}>
        <Text style={styles.submitText}>Send SMS</Text>
      </TouchableHighlight>
    )

    if (this.props.denied) {
      return (
        <View style={styles.modalContainer}>
          <View style={styles.modalInnerContainer}>
            <Text style={styles.centerText}>To invite your contacts, please go to:</Text>
            <Text style={styles.centerText}>Settings > Sous > Enable "Contacts"</Text>
          </View>
        </View>
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
  textBold: {
    fontWeight: 'bold',
  },
  text: {
    fontFamily: 'OpenSans',
    fontSize: 16,
  },
  searchInputContainer: {
    paddingTop: 5,
    paddingBottom: 7,
    paddingRight: 5,
    paddingLeft: 5,
    flexDirection: 'row',
    position: 'relative',
  },
  searchInput: {
    textAlign: 'center',
    flex: 1,
    height: Sizes.inputFieldHeight,
    backgroundColor: Colors.mainBackgroundColor,
    color: Colors.inputTextColor,
    fontFamily: 'OpenSans',
    borderRadius: Sizes.inputBorderRadius,
    fontWeight: 'bold',
  },
  activity: {
    backgroundColor: 'transparent',
    paddingTop: 12,
    left: 5,
    position: 'absolute',
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
    borderTopColor: Colors.separatorColor,
    borderTopWidth: 1,
    paddingVertical: 5,
    backgroundColor: Colors.mainBackgroundColor,
  },
  row: {
    flex: 1,
    marginTop: 2,
    marginBottom: 2,
    marginRight: 5,
    marginLeft: 5,
    borderRadius: Sizes.rowBorderRadius,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  selectedRow: {
    backgroundColor: Colors.lightBlue
  },
  contactDetails: {

  },
  nameContainer: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  phoneNumber: {
    fontSize: 10,
    color: Colors.lightGrey,
  },
  submitContainer: {
    borderTopColor: Colors.separatorColor,
    borderTopWidth: 1,
    backgroundColor: 'white',
  },
  submitText: {
    color: Colors.lightBlue,
    textAlign: 'center',
    padding: 10,
    fontFamily: 'OpenSans',
    fontSize: 16,
    fontWeight: 'bold',
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
