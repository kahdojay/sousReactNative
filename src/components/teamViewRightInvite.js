import React from 'react-native';
import { Icon } from 'react-native-icons';
import Colors from '../utilities/colors';
import _ from 'lodash';

const {
  View,
  Text,
  TouchableHighlight,
  PropTypes,
  StyleSheet,
} = React;

class TeamViewRightInvite extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <TouchableHighlight
        onPress={() => {
          if(this.props.connected === true){
            this.props.navigateToInviteView()
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

export default TeamViewRightInvite;
