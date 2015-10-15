import React from 'react-native';
import CheckBox from 'react-native-checkbox'

const {
  View,
  Text,
  TouchableHighlight,
  PropTypes,
  StyleSheet,
} = React;

class InviteViewRightButton extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container} >
        <CheckBox label='' />
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    paddingTop: 25,
    paddingRight: 10,
  }
})

InviteViewRightButton.propTypes = {
};

export default InviteViewRightButton
