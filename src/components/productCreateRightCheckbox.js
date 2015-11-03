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

class ProductCreateRightCheckbox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      iconFont: this.props.iconFont || 'fontawesome|check',
    }
  }

  render() {
    return (
      <TouchableHighlight
        underlayColor='transparent'
        onPress={()=> {
          if (this.props.submitReady) {
            this.props.onAddProduct();
          } else {
            // trigger error: Please fill out all the fields below
          }
        }}
      >
        <Icon
          name={this.state.iconFont}
          size={30}
          color={this.props.submitReady ? 'green' : '#ccc'}
          style={styles.icon}
        />
      </TouchableHighlight>
    );
  }
}

let styles = StyleSheet.create({
  icon: {
    height: 50,
    width: 50,
    marginTop: 6
  }
})

export default ProductCreateRightCheckbox;
