import React from 'react-native'
import { navbarColor } from '../utilities/colors';

const {
  TouchableHighlight,
  PropTypes,
  Text,
  Image,
  StyleSheet,
  View,
} = React;

class NavbarTitle extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image source={require('image!Logo')} style={styles.logoImage} />
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    paddingTop: 0,
  },
  logoImage: {
    width: 100,
    height: 50,
  },
});

NavbarTitle.propTypes = {
};

export default NavbarTitle
