import React from 'react-native';

const {
  StyleSheet,
  Text,
  View,
} = React;

class LeaveTeamErrorMessage extends React.Component {
  render() {
    return (
      <View>
        <Text style={[styles.textCentered, styles.row]}>
          Our apologies, but you must belong to
          <Text style={styles.textBold}> at least one team.</Text>
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

export default LeaveTeamErrorMessage;
