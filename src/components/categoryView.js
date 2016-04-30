import React from 'react-native';
import _ from 'lodash';
import { Icon } from 'react-native-icons';
import ProductList from '../components/productList';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';

const {
  ActivityIndicatorIOS,
  PropTypes,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} = React;

class CategoryView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hideHeader: false,
      searching: false,
      search: '',
      searchedProducts: [],
    }
  }

  searchForProducts() {
    if(this.state.search !== ''){
      this.setState({
        hideHeader: true,
        searching: true,
        searchedProducts: [],
      }, () => {
        const products = _.sortBy(_.filter(this.props.products, (product) => {
          return product.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1
        }), 'name')
        this.setState({
          searching: false,
          searchedProducts: products.slice(0,10)
        })
      })
    } else {
      this.setState({
        hideHeader: false,
        searching: false,
        searchedProducts: []
      })
    }
  }

  render() {
    const {cartItems, category, products, purveyors, connected} = this.props;

    // if(connected === false){
    //   return (
    //     <View style={styles.container}>
    //       <Text style={styles.inaccessible}>Order Guide inaccessible in offline mode</Text>
    //     </View>
    //   )
    // }

    const fetching = (
      <ActivityIndicatorIOS
        animating={true}
        color={'#808080'}
        style={styles.activity}
        size={'large'}
      />
    )
    return (
      <View style={styles.container}>
        <View>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              value={this.state.search}
              placeholder='Search'
              onChangeText={(text) => {
                this.setState({
                  search: text
                }, () => {
                  this.searchForProducts()
                })
              }}
              onSubmitEditing={::this.searchForProducts}
            />
            { this.state.search !== '' ?
              <TouchableHighlight
                onPress={() => {
                  this.setState({
                    hideHeader: false,
                    searching: false,
                    search: '',
                    searchedProducts: []
                  })
                }}
                underlayColor='transparent'
              >
                <Icon name='material|close' size={25} color='#999' style={styles.iconClose} />
              </TouchableHighlight>
            : <View /> }
          </View>
        </View>
        <View style={styles.searchResultsContainer}>
          { this.state.searching === true ? fetching : <View /> }
          { this.state.search !== '' ?
            ((this.state.searchedProducts.length > 0) ?
              <ProductList
                cartItems={cartItems}
                showCategoryInfo={false}
                showPurveyorInfo={true}
                products={this.state.searchedProducts}
                purveyors={purveyors}
                onProductEdit={this.props.onProductEdit}
                onProductDelete={this.props.onProductDelete}
                onUpdateProductInCart={this.props.onUpdateProductInCart}
              />
            : <Text style={styles.noFoundText}>No results for '{ this.state.search }'</Text>)
          :  <ProductList
                cartItems={cartItems}
                showCategoryInfo={false}
                showPurveyorInfo={true}
                products={products}
                purveyors={purveyors}
                onProductEdit={this.props.onProductEdit}
                onProductDelete={this.props.onProductDelete}
                onUpdateProductInCart={this.props.onUpdateProductInCart}
              />
        }
        </View>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBackgroundColor,
  },
  searchInputContainer: {
    backgroundColor: 'white',
    paddingTop: 5,
    paddingBottom: 7,
    paddingRight: 5,
    paddingLeft: 5,
    flexDirection: 'row',
    position: 'relative',
  },
  searchInput: {
    textAlign: 'center',
    flex: 1,
    height: Sizes.inputFieldHeight,
    backgroundColor: Colors.lightGrey,
    color: Colors.inputTextColor,
    fontFamily: 'OpenSans',
    borderRadius: Sizes.inputBorderRadius,
    fontWeight: 'bold',
  },
  iconClose: {
    width: 30,
    height: 30,
    borderRadius: 15,
    position: 'absolute',
    right: 5,
    top: 1,
  },
  searchResultsContainer: {
    flex: 1,
    borderTopColor: Colors.separatorColor,
    borderTopWidth: 1,
    paddingVertical: 5,
    backgroundColor: Colors.mainBackgroundColor,
  },
  activity: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 15,
  },
  noFoundText: {
    fontStyle: 'italic',
    textAlign: 'center',
    paddingTop: 15,
    paddingBottom: 15,
  },
  inaccessible: {
    color: Colors.disabled,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'OpenSans',
    paddingTop: 25,
  },
});

CategoryView.propTypes = {
};

export default CategoryView
