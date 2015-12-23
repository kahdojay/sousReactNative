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
    this.state = {
      iconFont: this.props.iconFont || 'fontawesome|chevron-left',
      navName: this.props.navName || 'Feed'
    }
  }

  // if pop={true} simply pop, overrides other conditions
  handlePress(e) {
    let routes = this.props.navigator.getCurrentRoutes();
    if (this.props.pop) {
      this.props.navigator.pop();
    } else {
      this.props.navigator.replacePreviousAndPop({
        name: this.state.navName,
      });
    }
  }

  render() {
    // let { navigator, route } = this.props;

    return (
      <TouchableHighlight
        underlayColor='white'
        onPress={this.handlePress.bind(this)} >
        <Icon name={`${this.state.iconFont}`} size={30} color={Colors.lightBlue} style={styles.hamburger} />
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
