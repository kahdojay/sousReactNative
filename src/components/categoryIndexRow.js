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
        style={styles.row}
      >
        <View style={styles.textProgressArrowContainer}>
          <View style={styles.textProgressContainer} >
            <View style={styles.categoryInfo} >
              <Text style={styles.rowText}>{category.name}</Text>
              <Text style={styles.percentage}>
                {categoryProducts.length}
              </Text>
            </View>
          </View>
          <Icon
            name='material|chevron-right'
            size={40}
            color='#aaa'
            style={styles.iconArrow}
          />
        </View>
        <View style={styles.seperator} />
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
  progress: {
    margin: 5,
    height: 8,
    borderRadius: 10,
  },
  rightArrow: {
    fontSize: 20,
    color: '#ccc',
  },
  textProgressArrowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textProgressContainer: {
    flex: 1,
  },
  seperator: {
    height: 5,
    borderBottomColor: '#bbb',
    borderBottomWidth: 1,
  },
  categoryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  percentage: {
    paddingRight: 5,
  },
  rowText: {
    fontWeight: 'bold',
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 20,
    fontFamily: 'OpenSans'
  },
  iconArrow: {
    width: 40,
    height: 40,
  },
})

CategoryIndexRow.propTypes = {
  onPress: React.PropTypes.func,
  category: React.PropTypes.object,
};

export default CategoryIndexRow
