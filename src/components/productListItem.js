var { Icon, } = require('react-native-icons');
import React from 'react-native'
import CheckBox from 'react-native-checkbox'
import {
  greyText,
  productCompletedBackgroundColor
} from '../utilities/colors';

let {
  TouchableHighlight,
  PropTypes,
  Text,
  StyleSheet,
  View,
} = React;

export default class ProductListItem extends React.Component {
  increment() {
    this.props.onUpdateProduct({quantity: (this.props.product.quantity + 1)})
  }
  decrement() {
    if (this.props.product.quantity > 1 ) {
      this.props.onUpdateProduct({quantity: (this.props.product.quantity - 1)})
    }
  }
  handleOrderProduct() {
    this.props.onUpdateProduct({ordered: !this.props.product.ordered});
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={[
          styles.row,
          this.props.product.ordered && styles.rowCompleted
        ]}>
          <View style={styles.checkboxContainer}>
            <CheckBox
              label=''
              onChange={this.handleOrderProduct.bind(this)}
              checked={this.props.product.ordered}
            />
          </View>
          <TouchableHighlight
            onPress={() => this.props.navigator.push({
              name: 'ProductView',
              productId: this.props.product.productId,
              purveyorId: this.props.purveyorId
            })}
            style={styles.main}
          >
            <View>
              <Text style={[
                styles.text,
                this.props.ordered && styles.textCompleted
              ]}>
                {this.props.product.name}
              </Text>
              <Text
                style={{fontSize: 9, position: 'absolute', left: 0, bottom: -10, color: '#999'}}
              >
                {this.props.product.price + ' • ' + this.props.product.unit}
              </Text>
            </View>
          </TouchableHighlight>
          <Text style={styles.quantity}>
            {this.props.product.quantity > 1 ? ('X' + this.props.product.quantity) : ''}
          </Text>
          <TouchableHighlight
            underlayColor="#bbb"
            onPress={this.decrement.bind(this)}>
            <Icon name='fontawesome|minus-circle' size={30} color='#aaa' style={styles.icon}/>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={this.increment.bind(this)}>
            <Icon name='fontawesome|plus-circle' size={30} color='#aaa' style={styles.icon}/>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 5,
    paddingLeft: 5,
  },
  icon: {
    width: 40,
    height: 40,
  },
  quantity: {
    fontSize: 16
  },
  row: {
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 5,
    alignItems: 'center',
  },
  rowCompleted: {
    backgroundColor: productCompletedBackgroundColor,
  },
  checkboxContainer: {
    flex: 1,
    alignItems: 'center',
  },
  main: {
    flex: 4,
  },
  text: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 20
  },
  textCompleted: {
    color: '#777',
  },
});

ProductListItem.propTypes = {
  // onUpdateProduct: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired
};
