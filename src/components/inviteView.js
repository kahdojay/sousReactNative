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
      isFetching: this.props.isFetching,
      contacts: [],
      timeout: null,
    }
  }

  componentWillMount() {
    if(this.props.contacts.length === 0){
      this.props.getContacts()
    } else {
      this.setState({
        contacts: this.props.contacts.slice(0,10)
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isFetching: nextProps.isFetching,
      contacts: nextProps.contacts.slice(0,10),
    })
  }

  getSelectedIndex(contactNumber) {
    let contactNumbers = _.pluck(this.state.selectedContacts, 'number')
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

  searchContacts() {
    if(this.state.query !== ''){
      const searchedContacts = _.filter(this.props.contacts, (contact) => {
        let fullName = ''
        fullName += contact.firstName ? contact.firstName.toLowerCase() : ''
        fullName += ' '
        fullName += contact.lastName ? contact.lastName.toLowerCase() : ''
        return fullName.indexOf(this.state.query.toLowerCase()) !== -1
      })
      this.setState({
        contacts: searchedContacts.slice(0,10),
        searching: false,
        timeout: null,
      })
    } else {
      this.setState({
        contacts: this.props.contacts.slice(0,10),
        searching: false,
        timeout: null,
      })
    }
  }

  renderContacts(contacts) {
    if(this.state.isFetching === true){
      return (
        <ActivityIndicatorIOS
          key={'loading'}
          animating={true}
          color={Colors.greyText}
          style={styles.activity}
          size={'large'}
        />
      )
    }
    let displayContacts = []
    contacts.forEach((contact, idx) => {
      let selectedStyle = {}
      let contactDetailsColor = Colors.greyText
      let contactColor = 'black'
      if(this.getSelectedIndex(contact.contactNumber) !== -1){
        contactDetailsColor = 'white'
        contactColor = 'white'
        selectedStyle = styles.selectedRow
      }

      displayContacts.push(
        <TouchableHighlight
          key={`${contact.lastName}-${idx}`}
          underlayColor="#eee"
          onPress={() => {
            this.toggleSelectContact(contact.contactNumber, contact.firstName, contact.lastName)
          }}
        >
          <View style={[styles.row, selectedStyle]}>
            <View style={styles.contactDetails}>
              <View style={styles.nameContainer} >
                <Text style={[styles.text, styles.textBold, {color: contactColor}]}>{contact.firstName} </Text>
                <Text style={[styles.text, {color: contactColor}]}>{contact.lastName}</Text>
              </View>
              <Text style={[styles.phoneNumber, {color: contactDetailsColor}]}>{contact.contactNumber}</Text>
            </View>
          </View>
        </TouchableHighlight>
      )
    })

    return (
      displayContacts.length > 0 ?
      displayContacts :
      <Text style={styles.noFoundText}>No results for '{ this.state.query }'</Text>
    )
  }

  render() {
    let allContacts = []
    if(this.state.contacts !== null){
      this.state.contacts.map(function(contact){
        let contactNumbers = contact.phoneNumbers.map(function(o) { return o.number })
        _.uniq(contactNumbers).forEach(function(number) {
          let formattedContact = {
            contactNumber: DataUtils.formatPhoneNumber(number),
            firstName: contact.firstName ? _.capitalize(contact.firstName) : '',
            lastName: contact.lastName ? _.capitalize(contact.lastName) : '',
            selected: false
          }
          allContacts.push(formattedContact)
        })
      })
    }

    let searchBar = (
      <View>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            value={this.state.query}
            placeholder='Search Name'
            onChangeText={(text) => {
              if(this.state.timeout !== null){
                clearTimeout(this.state.timeout)
              }
              this.setState({
                query: text,
                searching: true,
                timeout: setTimeout(::this.searchContacts, 500)
              })
            }}
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
                if(this.state.timeout !== null){
                  clearTimeout(this.state.timeout)
                }
                this.setState({
                  query: '',
                  searching: true,
                  timeout: setTimeout(::this.searchContacts, 500)
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

    let submitButtonBackgroundColor = Colors.disabled
    let submitButtonTextColor = 'white'
    if(this.state.selectedContacts.length > 0){
      submitButtonBackgroundColor = 'white'
      submitButtonTextColor = Colors.lightBlue
    }
    let sendSMSButton = (
      <TouchableHighlight
        style={[styles.submitContainer, {backgroundColor: submitButtonBackgroundColor}]}
        underlayColor='transparent'
        onPress={() => {
          if(this.state.selectedContacts.length > 0){
            this.props.onSMSInvite(this.state.selectedContacts)
          }
        }}>
        <Text style={[styles.submitText, {color: submitButtonTextColor}]}>Send SMS</Text>
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
            {this.renderContacts(allContacts)}
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
    left: 10,
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
    height: 60,
    borderTopColor: Colors.separatorColor,
    borderTopWidth: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  submitText: {
    color: Colors.lightBlue,
    textAlign: 'center',
    paddingBottom: 1,
    fontFamily: 'OpenSans',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noFoundText: {
    fontStyle: 'italic',
    textAlign: 'center',
    paddingTop: 15,
    paddingBottom: 15,
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
