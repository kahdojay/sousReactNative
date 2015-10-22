import { Icon } from 'react-native-icons';
var React = require('react-native');
var PropTypes = React.PropTypes;

var {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableHighlight
} = React;

var CheckBox = React.createClass({
  propTypes: {
    label: PropTypes.string,
    labelStyle: PropTypes.object,
    checked: PropTypes.bool,
    onChange: PropTypes.func
  },

  getDefaultProps() {
    return {
      label: 'Label',
      checked: false
    }
  },

  render() {
    var iconName = 'fontawesome|square-o'
    if(this.props.checked){
      iconName = 'fontawesome|check-square-o'
    }

    return (
      <TouchableHighlight onPress={this.props.onChange} underlayColor='white'>
        <View style={styles.container}>
          <Icon name={iconName} size={30} color='black' style={styles.icon}/>
          <Text style={[this.props.labelStyle, styles.label]}>{this.props.label}</Text>
        </View>
      </TouchableHighlight>
    )
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  icon: {
    width: 40,
    height: 40,
  },
  checkbox: {
    width: 26,
    height: 26
  },
  label: {
    fontSize: 15,
    lineHeight: 15,
    color: 'grey',
    marginLeft: 10
  }
});

module.exports = CheckBox;