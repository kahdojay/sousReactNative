import React from 'react-native';
import { Icon } from 'react-native-icons';
import _ from 'lodash';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';

const {
  View,
  PropTypes,
  ProgressViewIOS,
  Text,
  TouchableOpacity,
  StyleSheet,
} = React;

class CategoryIndexRow extends React.Component {
  render() {
    let { category, products } = this.props

    const categoryProducts = _.filter(products, (product) => {
      return product && product.hasOwnProperty('deleted') === true && product.deleted === false
    })

    return (
      <TouchableOpacity
        onPress={this.props.onPress}
      >
        <View style={styles.row}>
          <View style={styles.textProgressContainer} >
            <View style={styles.categoryInfo} >
              <Text style={styles.rowText}>{category.name}</Text>
              <Text style={styles.percentage}>{categoryProducts.length}</Text>
            </View>
          </View>
          <View style={styles.iconContainer}>
            <Icon name='material|chevron-right' size={30} color={Colors.lightBlue} style={styles.iconArrow} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    borderRadius: Sizes.rowBorderRadius,
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 5,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    marginTop: 3,
    marginBottom: 3,
    marginRight: 5,
    marginLeft: 5,
  },
  textProgressContainer: {
    flex: 6,
  },
  categoryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  percentage: {
    paddingRight: 5,
    fontFamily: 'OpenSans',
  },
  rowText: {
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 18,
    fontFamily: 'OpenSans',
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  iconArrow: {
    width: 50,
    height: 50,
  },
})

CategoryIndexRow.propTypes = {
  onPress: React.PropTypes.func,
  category: React.PropTypes.object,
};

export default CategoryIndexRow
