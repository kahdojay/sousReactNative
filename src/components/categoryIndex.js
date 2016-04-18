import React from 'react-native';
import _ from 'lodash';
import CategoryIndexRow from './categoryIndexRow';
import Colors from '../utilities/colors';

const {
  Image,
  PropTypes,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  SegmentedControlIOS,
  View,
} = React;

class CategoryIndex extends React.Component {
  render() {
    const { categories, products, connected } = this.props

    if(connected === false){
      return (
        <View style={styles.container}>
          <Text style={styles.inaccessible}>Order Guide inaccessible in offline mode</Text>
        </View>
      )
    }

    let categoriesList = _.map(_.sortBy(categories, 'name'), (category) => {
      if (category.deleted === false) {
        const categoryProducts = {}
        category.products.forEach((productId) => {
          categoryProducts[productId] = products[productId]
        })
        return (
          <View>
            <CategoryIndexRow
              products={categoryProducts}
              key={category.id}
              category={category}
              onPress={() => {
                this.props.onNavigateToCategory(category.id)
              }}
            />
            <View style={styles.separator}></View>
          </View>
        )
      }
    })

    return (
      <View style={styles.container}>
        <View style={styles.segmentedControlContainer}>
          <SegmentedControlIOS
            tintColor={Colors.lightBlue}
            style={styles.segmentedControl}
            values={this.props.segmentationList}
            selectedIndex={this.props.selectedSegmentationIndex}
            onChange={this.props.onSegmentationChange}
          />
        </View>
        <ScrollView
          automaticallyAdjustContentInsets={false}
          keyboardShouldPersistTaps={false}
          style={styles.categoriesContainer}
        >
          {categoriesList}
        </ScrollView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBackgroundColor,
  },
  categoriesContainer: {
    paddingVertical: 5,
  },
  segmentedControlContainer: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 5,
    paddingLeft: 5,
    borderBottomColor: Colors.separatorColor,
    borderBottomWidth: 1,
  },
  segmentedControl: {
    fontWeight: 'bold',
    height: 36,
    fontFamily: 'OpenSans',
  },
  inaccessible: {
    color: Colors.disabled,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'OpenSans',
    paddingTop: 25,
  },
  separator: {
    flex: 1,
    borderBottomWidth: .5,
    borderColor: Colors.separatorColor,
  },
});

CategoryIndex.propTypes = {
  onNavigateToCategory: React.PropTypes.func,
  categories: React.PropTypes.object.isRequired,
};

export default CategoryIndex
