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

class InvoicesRightButton extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.iconContainer}>
        <TouchableHighlight
          underlayColor='transparent'
          onPress={this.props.onNavtoUploadInvoices} >
          <Icon name='material|plus' size={30} color={Colors.navIcon} style={styles.navIcon}/>
        </TouchableHighlight>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
  },
  navIcon: {
    width: 50,
    height: 50,
    marginTop: 12,
  }
})

InvoicesRightButton.propTypes = {
};

export default InvoicesRightButton
