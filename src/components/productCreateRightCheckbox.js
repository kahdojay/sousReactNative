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

class ProductCreateRightCheckbox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      iconFont: this.props.iconFont || 'fontawesome|check-square',
      navName: this.props.navName || 'CategoryIndex',
      disabled: this.props.disabled || true,
    }
  }

  handlePress(e) {
    let routes = this.props.navigator.getCurrentRoutes();
    this.props.navigator.replacePreviousAndPop({
      name: this.state.navName,
    });
  }

  render() {
    // let { navigator, route } = this.props;

    return (
      <TouchableHighlight
        underlayColor='white'
        onPress={this.handlePress.bind(this)} >
        <Icon
          name={`${this.state.iconFont}`}
          size={30}
          color={Colors.disabled}
          style={styles.hamburger}
        />
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

export default ProductCreateRightCheckbox;
