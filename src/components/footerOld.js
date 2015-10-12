import React from 'react-native';

let {
  View,
  PropTypes,
  Text,
  TouchableHighlight
} = React;

export default class Footer extends React.Component {
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
      <View>
        <Text>Show:</Text>
        <Text>{' '}</Text>
        {this.renderFilter('SHOW_ALL', 'All')}
        <Text>{', '}</Text>
        {this.renderFilter('SHOW_COMPLETED', 'Completed')}
        <Text>{', '}</Text>
        {this.renderFilter('SHOW_ACTIVE', 'Active')}
        <Text>.</Text>
      </View>
    );
  }
}

Footer.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  filter: PropTypes.oneOf([
    'SHOW_ALL',
    'SHOW_COMPLETED',
    'SHOW_ACTIVE'
  ]).isRequired
};