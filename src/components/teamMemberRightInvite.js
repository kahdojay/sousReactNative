import React from 'react-native';
import { Icon } from 'react-native-icons';
import Colors from '../utilities/colors';

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

  render() {
    return (
      <TouchableHighlight
        onPress={() => {
          this.props.toggleInviteModal(true)
        }}
        style={{justifyContent: 'center',}}
        underlayColor='transparent'
      >
        <Icon
          name='fontawesome|user-plus'
          size={30}
          color={Colors.lightBlue}
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
