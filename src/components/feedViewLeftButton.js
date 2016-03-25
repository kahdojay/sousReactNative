import React from 'react-native';
import { Icon } from 'react-native-icons';
import Colors from '../utilities/colors';
import dismissKeyboard from 'dismissKeyboard'

const {
  View,
  Text,
  TouchableHighlight,
  PropTypes,
  StyleSheet,
} = React;

class FeedViewLeftButton extends React.Component {
  constructor(props) {
    super(props)
  }

  handlePress(e) {
    if(this.props.disabled === false){
      this.context.menuActions.toggle();
      dismissKeyboard()
    }
  }

  render() {
    let { navigator, route } = this.props;

    let iconColor = Colors.lightBlue
    if(this.props.disabled === true){
      iconColor = Colors.disabled
    }

    return (
      <TouchableHighlight
        underlayColor='white'
        onPress={::this.handlePress}
      >
        <Icon name='material|menu' size={30} color={iconColor} style={styles.hamburger} />
      </TouchableHighlight>
    );
  }
}

let styles = StyleSheet.create({
  hamburger: {
    width: 50,
    height: 50,
    marginTop: 12,
  }
})

FeedViewLeftButton.propTypes = {
};

FeedViewLeftButton.contextTypes = {
  menuActions: React.PropTypes.object.isRequired
}

export default FeedViewLeftButton
