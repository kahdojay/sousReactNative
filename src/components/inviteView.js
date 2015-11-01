import React from 'react-native';
import _ from 'lodash';
import CheckBox from './checkbox'
import Colors from '../utilities/colors';
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
      contacts: this.props.contacts,
    }
  }

  /* returns first phone number for selected contacts */
  sendSMS() {
    const resultSet = _.chain(this.state.contacts)
      .filter(function(c) { return c.selected; })
      .map('phoneNumbers[0].number')
      .value();
    this.props.onSMSInvite(resultSet);
  }

  render() {
    let submitButton = <View />;
    let contacts = <View />;
    if(this.state.contacts.length > 0) {
      contacts = []
      this.state.contacts.forEach((contact, idx) => {
        contacts.push(
          <TouchableHighlight key={idx} underlayColor="#eee" style={{paddingTop: 10,}}>
            <View style={styles.contactRow} >
              <View style={styles.row} >
                <Text style={styles.contactFirstName}>{contact.firstName} </Text>
                <Text style={styles.contactLastName}>{contact.lastName}</Text>
              </View>
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
      });
      submitButton = (
        <TouchableHighlight
          style={styles.button}
          underlayColor={Colors.buttonPress}
          onPress={::this.sendSMS}>
          <Text style={styles.buttonText}>Send SMS</Text>
        </TouchableHighlight>
      );
    }

    return (
      <ScrollView style={styles.container}>
        {submitButton}
        {contacts}
        {submitButton}
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  row: {
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contactFirstName: {
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
  },
  contactLastName: {
    fontFamily: 'OpenSans',
  },
  button: {
    height: 56,
    backgroundColor: '#F5A623',
    alignSelf: 'center',
    width: 150,
    justifyContent: 'center',
    borderRadius: 3,
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'OpenSans'
  },
})

InviteView.propTypes = {
};

export default InviteView
