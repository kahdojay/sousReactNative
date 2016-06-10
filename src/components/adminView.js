import React from 'react-native';
import _ from 'lodash';
import moment from 'moment';
import { Icon } from 'react-native-icons';
import Colors from '../utilities/colors';

const {
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

class AdminView extends React.Component {

  render() {
    return (
      <View>
        <Text>Admin View</Text>
        <TouchableHighlight
          onPress={this.props.onTest}
        >
          <Text>Test</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBackgroundColor,
  },
})

export default AdminView
