import React from 'react-native';

const {
  View,
  Text,
  PropTypes,
  StyleSheet,
} = React;

class InviteView extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>test</Text>
      </View>
    );
  }
}

let styles = StyleSheet.create({
})

InviteView.propTypes = {
};

export default InviteView
