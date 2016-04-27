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

  render() {
    let { navigator, route } = this.props;

    return (
      <TouchableHighlight
        underlayColor='white'
        onPress={this.props.onShowCreateOptions}
      >
        <Icon name='material|plus' size={30} color={Colors.navIcon} style={styles.navIcon}/>
      </TouchableHighlight>
    );
  }
}

let styles = StyleSheet.create({
  navIcon: {
    width: 50,
    height: 50,
    marginTop: 12,
  },
})

FeedViewRightButton.propTypes = {
};

FeedViewRightButton.contextTypes = {
  menuActions: React.PropTypes.object.isRequired
}

export default FeedViewRightButton
