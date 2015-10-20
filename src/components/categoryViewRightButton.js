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

class CategoryViewRightButton extends React.Component {
  constructor(props) {
    super(props)
  }
  handlePress(e) {
    this.props.navigator.push({ name: 'CartView', });
  }

  render() {
    let { navigator, route } = this.props;

    return (
      <TouchableHighlight
        underlayColor='white'
        onPress={this.handlePress.bind(this)} >
        <Icon name='fontawesome|shopping-cart' size={30} color={Colors.navbarIconColor} style={styles.cart} />
      </TouchableHighlight>
    );
  }
}

let styles = StyleSheet.create({
  cart: {
    width: 50,
    height: 50,
    marginTop: 6,
  }
})

CategoryViewRightButton.propTypes = {
};

CategoryViewRightButton.contextTypes = {
  menuActions: React.PropTypes.object.isRequired
}

export default CategoryViewRightButton
