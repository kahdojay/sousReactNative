import React from 'react-native';
import _ from 'lodash';
import CategoryIndexRow from './categoryIndexRow';
import Colors from '../utilities/colors';

const {
  ActivityIndicatorIOS,
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
    const { categories, products } = this.props

    let categoriesList = _.map(_.sortBy(categories, 'name'), (category) => {
      if (category.deleted === false) {
        const categoryProducts = {}
        category.products.forEach((productId) => {
          categoryProducts[productId] = products[productId]
        })
        return (
          <CategoryIndexRow
            products={categoryProducts}
            key={category.id}
            category={category}
            onPress={() => {
              this.props.onNavigateToCategory(category.id)
            }}
          />
        )
      }
    })

    return (
      <View style={styles.container}>
        <SegmentedControlIOS
          tintColor={Colors.lightBlue}
          style={styles.segmentedControl}
          values={this.props.segmentationList}
          selectedIndex={this.props.selectedSegmentationIndex}
          onChange={this.props.onSegmentationChange}
        />
        <ScrollView
          automaticallyAdjustContentInsets={false}
          keyboardShouldPersistTaps={false}
          style={styles.categoriesContainer}
        >
          {categoriesList}
        </ScrollView>
        <TouchableHighlight
          underlayColor='#eee'
          onPress={this.props.onCreateProduct}
          style={styles.createButton}
        >
          <Text style={styles.createButtonText}>Create New Product</Text>
        </TouchableHighlight>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  categoriesContainer: {
    borderTopColor: Colors.separatorColor,
    borderTopWidth: 1,
    paddingVertical: 5,
  },
  separator: {
    height: 0,
    borderBottomColor: Colors.separatorColor,
    borderBottomWidth: 1,
  },
  segmentedControl: {
    fontWeight: 'bold',
    height: 36
  },
  createButton: {
    borderTopColor: Colors.separatorColor,
    borderTopWidth: 1,
    backgroundColor: 'white',
  },
  createButtonText: {
    color: Colors.lightBlue,
    textAlign: 'center',
    padding: 10,
    fontFamily: 'OpenSans',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

CategoryIndex.propTypes = {
  onNavigateToCategory: React.PropTypes.func,
  categories: React.PropTypes.object.isRequired,
};

export default CategoryIndex
