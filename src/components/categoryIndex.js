import React from 'react-native'
import _ from 'lodash'
import { Icon } from 'react-native-icons'
import AddForm from './addForm'
import { mainBackgroundColor } from '../utilities/colors'
import CategoryIndexRow from './categoryIndexRow';
import { nameSort } from '../utilities/utils';
import Colors from '../utilities/colors';

const {
  ActivityIndicatorIOS,
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableHighlight,
  PropTypes,
} = React;

class CategoryIndex extends React.Component {
  render() {
    const { categories, products } = this.props

    let categoriesList = _.map(_.sortBy(categories, 'name'), (category) => {
      if (category.deleted === false) {
        return (
          <CategoryIndexRow
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
        {/* * /}<AddForm
          placeholder="Add category..."
          onSubmit={this.props.onAddCategory}
        />{/* */}
        {/* * /}<TouchableHighlight
          underlayColor='#eee'
          onPress={this.props.onCreateProduct}
          style={styles.createButton}
        >
          <Text style={styles.createButtonText}>Create New Product...</Text>
        </TouchableHighlight>{/* */}
        <TouchableHighlight
          underlayColor='#eee'
          onPress={this.props.onNavigateToPurveyorIndex}
          style={styles.createButton}
        >
          <Text style={styles.createButtonText}>Order by Purveyor</Text>
        </TouchableHighlight>
        <View style={styles.separator} />
        <ScrollView
          automaticallyAdjustContentInsets={false}
          keyboardShouldPersistTaps={false}
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
    backgroundColor: 'white',
  },
  separator: {
    height: 5,
    borderBottomColor: '#bbb',
    borderBottomWidth: 1,
  },
  scrollView: {
    backgroundColor: '#f7f7f7',
    height: 500,
    paddingLeft: 20,
    paddingRight: 0,
    marginTop: 0,
    paddingTop: 0
  },
  createButton: {
  },
  createButtonText: {
    color: Colors.navbarIconColor,
    textAlign: 'center',
    padding: 5,
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
