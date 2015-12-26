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

class ProductFormRightCheckbox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      iconFont: this.props.iconFont || 'material|check',
    }
  }

  render() {
    return (
      <TouchableHighlight
        underlayColor='transparent'
        style={{justifyContent: 'center',}}
        onPress={()=> {
          if (this.props.submitReady) {
            this.props.onProcessProduct();
          } else {
            // trigger error: Please fill out all the fields below
          }
        }}
      >
        <Icon
          name='material|square-o'
          size={40}
          color={this.props.submitReady ? Colors.green : '#ccc'}
          style={styles.iconOutline}
        >
          <Icon
            color={this.props.submitReady ? Colors.green : '#ccc'}
            name={this.state.iconFont}
            size={25}
            style={styles.icon}
          />
        </Icon>
      </TouchableHighlight>
    );
  }
}

let styles = StyleSheet.create({
  iconOutline: {
    flexDirection: 'column',
    width: 60,
    height: 60,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    flex: 1,
    width: 20,
    height: 20,
    marginTop: -3,
  },
})

export default ProductFormRightCheckbox;
