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
          }
        }}
      >
        <Icon
          name={this.state.iconFont}
          size={40}
          color={this.props.submitReady ? 'green' : '#ccc'}
          style={{height: 40, width: 40, }}
        />
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

export default ProductCreateRightCheckbox;
