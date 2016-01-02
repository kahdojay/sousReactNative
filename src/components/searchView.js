import React from 'react-native';
import { Icon } from 'react-native-icons';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import ProductList from '../components/productList';

const {
  ActivityIndicatorIOS,
  SegmentedControlIOS,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} = React;

class SearchView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searching: false,
      search: '',
      products: []
    }
  }

  searchForProducts() {
    if(this.state.search !== ''){
      this.setState({
        searching: true,
        products: [],
      }, () => {
        const products = _.filter(this.props.products, (product) => {
          return product.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1
        })
        this.setState({
          searching: false,
          products: products.slice(0,10)
        })
      })
    } else {
      this.setState({
        products: []
      })
    }
  }

  render() {
    const { products, purveyors, categories, cart } = this.props
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
        <SegmentedControlIOS
          tintColor={Colors.lightBlue}
          style={styles.segmentedControl}
          values={this.props.segmentationList}
          selectedIndex={this.props.selectedSegmentationIndex}
          onChange={this.props.onSegmentationChange}
        />
        <View>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              value={this.state.search}
              placeholder='product name'
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
                    searching: false,
                    search: '',
                    products: []
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
            ((this.state.products.length > 0) ?
              <ProductList
                cart={cart}
                showCategoryInfo={true}
                showPurveyorInfo={true}
                products={this.state.products}
                categories={categories}
                purveyors={purveyors}
                onProductEdit={this.props.onProductEdit}
                onProductDelete={this.props.onProductDelete}
                onUpdateProductInCart={this.props.onUpdateProductInCart}
              />
            : <Text style={styles.noFoundText}>No results for '{ this.state.search }'</Text>)
          : <View /> }
        </View>
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
  },
  searchInputContainer: {
    margin: 10,
    flexDirection: 'row',
    position: 'relative',
  },
  searchInput: {
    textAlign: 'center',
    flex: 1,
    height: 32,
    backgroundColor: Colors.mainBackgroundColor,
    color: '#777',
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
  }
});

SearchView.propTypes = {
};

export default SearchView
