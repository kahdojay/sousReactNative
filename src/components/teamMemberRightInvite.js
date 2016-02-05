import React from 'react-native';
import { Icon } from 'react-native-icons';
import Colors from '../utilities/colors';
import AddressBook from 'react-native-addressbook';
import _ from 'lodash';

const {
  View,
  Text,
  TouchableHighlight,
  PropTypes,
  StyleSheet,
} = React;

class TeamMemberRightInvite extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  navigateToInviteView() {
    AddressBook.getContacts( (err, contacts) => {
      if (err && err.type === 'permissionDenied') {
        this.props.navigateToInviteView([], true)
      } else {
        this.props.navigateToInviteView(contacts, false)
      }
    })
  }

  render() {
    return (
      <TouchableHighlight
        onPress={() => {
          if(this.props.connected === true){
            this.navigateToInviteView()
          }
        }}
        style={{justifyContent: 'center',}}
        underlayColor='transparent'
      >
        <Icon
          name='material|accounts-add'
          size={30}
          color={(this.props.connected === true ? Colors.lightBlue : Colors.disabled)}
          style={styles.icon}
        />
      </TouchableHighlight>
    );
  }
}

let styles = StyleSheet.create({
  icon: {
    width: 50,
    height: 50,
    marginTop: 12,
  },
})

export default TeamMemberRightInvite;
