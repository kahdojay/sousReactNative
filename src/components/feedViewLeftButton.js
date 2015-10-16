import React from 'react-native';
import { Icon } from 'react-native-icons';

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
    this.context.menuActions.toggle();
  }

  render() {
    let { navigator, route } = this.props;

    return (
      <TouchableHighlight onPress={this.handlePress.bind(this)} >
        <Icon name='fontawesome|bars' size={30} color='white' style={styles.hamburger} />
      </TouchableHighlight>
    );
  }
}

let styles = StyleSheet.create({
  hamburger: {
    width: 50,
    height: 50,
  }
})

FeedViewLeftButton.propTypes = {
};

FeedViewLeftButton.contextTypes = {
  menuActions: React.PropTypes.object.isRequired
}

export default FeedViewLeftButton
