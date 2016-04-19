import React from 'react-native';
import NavigationBarStyles from 'react-native-navbar/styles';
import Colors from '../../utilities/colors';

const {
  StyleSheet,
  Text,
  View,
} = React;

class NavBarTitle extends React.Component {
  render() {
    return (
      <View style={styles.navBarTitleContainer}>
        <Text style={[styles.text,styles.textCentered]}>
          {this.props.content}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  navBarTitleContainer: {
    marginBottom: 12,
  },
  text: {
    fontFamily: 'OpenSans',
    fontSize: 16,
    color: Colors.navBarTitle,
  },
  textCentered: {
    textAlign: 'center',
  },
  textBold: {
    fontWeight: 'bold',
  },
});

export default NavBarTitle;
