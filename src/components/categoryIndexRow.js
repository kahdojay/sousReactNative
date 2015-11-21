import React from 'react-native';
import { Icon } from 'react-native-icons';
import _ from 'lodash';
import { greyText, taskCompletedBackgroundColor } from '../utilities/colors';

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
    let { category } = this.props

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
                {category.products.length}
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
    flexDirection: 'column',
    padding: 10,
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
