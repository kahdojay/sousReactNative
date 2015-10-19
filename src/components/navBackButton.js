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

class NavBackButton extends React.Component {
  constructor(props) {
    super(props)
  }
  handlePress(e) {
    let routes = this.props.navigator.getCurrentRoutes();
    console.log('PRESS', routes);
    this.props.navigator.replacePreviousAndPop({
    name: 'Feed',
  });
  }

  render() {
    // let { navigator, route } = this.props;

    return (
      <TouchableHighlight
        underlayColor='white'
        onPress={this.handlePress.bind(this)} >
        <Icon name={`fontawesome|${this.props.iconFont}`} size={30} color={Colors.navbarIconColor} style={styles.hamburger} />
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

export default NavBackButton;
