import React from 'react-native'
import _ from 'lodash'
import { Icon } from 'react-native-icons'
import AddForm from './addForm'
import { mainBackgroundColor } from '../utilities/colors'
import CategoryIndexRow from './categoryIndexRow';

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
    const { categories } = this.props

    let categoriesList = _.map(categories, (category) => {
      return (
        <CategoryIndexRow
          key={category.id}
          category={category}
          onPress={() => {
            this.props.navigator.push({
              name: 'CategoryView',
              categoryId: category.id
            })
          }}
        />
      )
    })

    return (
      <View style={styles.container}>
        {/* * /}<AddForm
          placeholder="Add category..."
          onSubmit={this.props.onAddCategory}
        />{/* */}
        <ScrollView keyboardShouldPersistTaps={false} >
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
  scrollView: {
    backgroundColor: '#f7f7f7',
    height: 500,
    paddingLeft: 20,
    paddingRight: 0,
    marginTop: 0,
    paddingTop: 0
  },
});

CategoryIndex.propTypes = {
  // onAddCategory: React.PropTypes.func,
  navigator: React.PropTypes.object.isRequired,
  categories: React.PropTypes.object,
};

module.exports = CategoryIndex;
