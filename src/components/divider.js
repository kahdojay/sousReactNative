import React from 'react-native';
import {greyText} from '../resources/colors';

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
          <Text style={styles.text}>25 Completed Items</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 5,
  },
  text: {
    textAlign: 'center',
    backgroundColor: '#ddd',
    fontWeight: 'bold',
    color: greyText,
    borderRadius: 5,
    paddingTop: 5,
    paddingBottom: 3,
    width: 150,
  },
})

Divider.propTypes = {
};
