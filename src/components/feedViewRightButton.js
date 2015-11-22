import React from 'react-native';
import { Icon } from 'react-native-icons';
import Colors from '../utilities/colors';

const {
  View,
  Text,
  TouchableHighlight,
  PropTypes,
  StyleSheet,
} = React;

class FeedViewRightButton extends React.Component {
  constructor(props) {
    super(props)
  }
  handlePress(e) {
    this.props.navigator.push({ name: 'TeamIndex', });
  }

  render() {
    let { navigator, route } = this.props;

    return (
      <TouchableHighlight
        underlayColor='white'
        onPress={this.handlePress.bind(this)}
      >
        <Icon
          name='fontawesome|comment-o'
          size={30}
          color={Colors.navbarIconColor}
          style={styles.bubble}
        />
      </TouchableHighlight>
    );
  }
}

let styles = StyleSheet.create({
  bubble: {
    width: 50,
    height: 50,
    marginTop: 12,
  }
})

FeedViewRightButton.propTypes = {
};

FeedViewRightButton.contextTypes = {
  menuActions: React.PropTypes.object.isRequired
}

export default FeedViewRightButton
