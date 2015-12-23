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
    iconColor: PropTypes.string,
    labelStyle: PropTypes.object,
    checked: PropTypes.bool,
    onChange: PropTypes.func
  },

  getDefaultProps() {
    return {
      label: 'Label',
      checked: false,
      iconColor: 'black'
    }
  },

  render() {
    let iconName = 'fontawesome|square-o'
    let iconContainerStyle = {}
    if(this.props.checked){
      iconName = 'fontawesome|check-square-o'
      // iconContainerStyle = {marginLeft: 10}
    }

    let TouchableWrapper = TouchableHighlight
    if(this.props.hasOwnProperty('disabled') === true && this.props.disabled === true){
      TouchableWrapper = View
    }

    return (
      <TouchableWrapper
        onPress={this.props.onChange}
        underlayColor='transparent'
      >
        <View style={[styles.container, iconContainerStyle]}>
          <Icon name={iconName} size={30} color={this.props.iconColor} style={[styles.icon]}/>
          {this.props.label !== '' ?
            <Text style={[this.props.labelStyle, styles.label]}>{this.props.label}</Text>
          : <View />}
        </View>
      </TouchableWrapper>
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
  label: {
    fontSize: 15,
    lineHeight: 15,
    color: 'grey',
    marginLeft: 10
  }
});

module.exports = CheckBox;
