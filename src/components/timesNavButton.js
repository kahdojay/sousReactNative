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

class TimesNavButton extends React.Component {
  constructor(props) {
    super(props)
  }
  handlePress(e) {
    console.log('PRESS');
    this.props.navigator.pop();
  }

  render() {
    // let { navigator, route } = this.props;

    return (
      <TouchableHighlight
        underlayColor='white'
        onPress={this.handlePress.bind(this)} >
        <Icon name='fontawesome|times' size={30} color={Colors.navbarIconColor} style={styles.hamburger} />
      </TouchableHighlight>
    );
  }
}

let styles = StyleSheet.create({
  hamburger: {
    width: 50,
    height: 50,
    marginTop: 6,
  }
})

export default TimesNavButton;
