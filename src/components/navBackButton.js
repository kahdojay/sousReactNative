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
      iconFont: this.props.iconFont || 'material|chevron-left',
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
    let { iconText } = this.props;
    let navBack = <Icon name={`${this.state.iconFont}`} size={30} color={Colors.navIcon} style={styles.navBack} />
    if(iconText){
      navBack = <Text style={styles.navText}>{iconText}</Text>
    }
    return (
      <TouchableHighlight
        underlayColor='white'
        onPress={this.handlePress.bind(this)} 
        style={styles.button}
      >
        {navBack}
      </TouchableHighlight>
    );
  }
}

let styles = StyleSheet.create({
  navBack: {
    width: 50,
    height: 50,
    marginTop: 12,
  },
  navText: {
    textAlign: 'center',
    marginTop: 12,
    marginLeft: 12,
    color: Colors.lightBlue
  },
  button: {
    justifyContent: 'center',
  },
})

export default NavBackButton;
