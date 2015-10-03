import React from 'react-native';
import {
  greyText,
  taskCompletedBackgroundColor
} from '../resources/colors';

let {
  View,
  PropTypes,
  Text,
  TouchableHighlight,
  StyleSheet,
} = React;

export default class Divider extends React.Component {
  renderFilter(filter, name) {
    if (filter === this.props.filter) {
      return <Text>name</Text>;
    }

    return (
      <TouchableHighlight href='#' onClick={e => {
        e.preventDefault();
        this.props.onFilterChange(filter);
      }}>
        <Text>{name}</Text>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.roundedCorners}>
          <Text style={styles.text}>25 Completed Items</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 5,
  },
  roundedCorners: {
    backgroundColor: taskCompletedBackgroundColor,
    width: 150,
    borderRadius: 10,
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    backgroundColor: taskCompletedBackgroundColor,
    fontWeight: 'bold',
    color: greyText,
    paddingTop: 5,
    paddingBottom: 3,
    width: 140,
  },
})

Divider.propTypes = {
};
