import React from 'react-native';

const {
  StyleSheet,
  Text,
  View,
} = React;

class LearnMoreMessage extends React.Component {
  render() {
    return (
      <View>
        <Text style={styles.textCentered}>
          <Text style={styles.textBold}>No Internet Connection</Text>
        </Text>
        <Text style={[styles.textCentered, styles.row]}>
          You can still add Order Guide products to your cart, but please reconnect before submitting orders or sending messages.
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    marginTop: 10,
  },
  textCentered: {
    textAlign: 'center',
  },
  textBold: {
    fontWeight: 'bold',
  },
});

export default LearnMoreMessage;
