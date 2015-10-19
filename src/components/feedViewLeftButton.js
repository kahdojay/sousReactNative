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

class FeedViewLeftButton extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount(){
    console.log('PROPS', this.props);
  }
  handlePress(e) {
    console.log('MENU', this.context.menuActions);
    this.context.menuActions.toggle();
  }

  render() {
    let { navigator, route } = this.props;

    return (
      <TouchableHighlight
        underlayColor='white'
        onPress={this.handlePress.bind(this)} >
        <Icon name='fontawesome|bars' size={30} color={Colors.navbarIconColor} style={styles.hamburger} />
      </TouchableHighlight>
    );
  }
}

let styles = StyleSheet.create({
  hamburger: {
    width: 50,
    height: 50,
    marginTop: 6,
  }
})

FeedViewLeftButton.propTypes = {
};

FeedViewLeftButton.contextTypes = {
  menuActions: React.PropTypes.object.isRequired
}

export default FeedViewLeftButton
