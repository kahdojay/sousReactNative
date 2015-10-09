const React = require('react-native');
var { Icon, } = require('react-native-icons');
import { BackBtn } from '../utilities/navigation';
import { NavigationBarStyles } from '../utilities/styles';
const {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  TouchableHighlight,
} = React;

class ProductView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      textInputDescription: this.props.product.description,
      textInputName: this.props.product.name,
    }
  }
  saveProduct() {
    let newProduct = this.props.product
    newProduct.description = this.state.textInputDescription
    newProduct.name = this.state.textInputName
    this.props.saveProductDescription(newProduct)
  }
  deleteProduct() {
    let newProduct = this.props.product
    newProduct.deleted = true
    this.props.onDeleteProduct(newProduct)
    this.props.navigator.pop()
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.navbar}>
          <View style={[
            NavigationBarStyles.navBar,
            {paddingVertical: 20}
          ]}>
            <BackBtn
              style={styles.backButton}
              callback={this.saveProduct.bind(this)}
              navigator={this.props.navigator}
            />
            <Image source={require('image!Logo')} style={styles.logoImage}></Image>
          </View>
        </View>

        <ScrollView
          scrollEventThrottle={200}
        >
          <View style={styles.headerContainer}>
            <Icon name='material|assignment' size={100} color='#aaa' style={styles.iconMain}/>
            <View style={styles.iconContainer}>
              <View style={styles.iconSideContainer}>
                <Text style={styles.sideText}>Timer</Text>
                <Icon name='material|alarm' size={50} color='#aaa' style={styles.iconSide}/>
              </View>
              <View style={styles.iconSideContainer}>
                <Text style={styles.sideText}>Scale</Text>
                <Icon name='fontawesome|check-square' size={50} color='#aaa' style={styles.iconSide}/>
              </View>
            </View>
          </View>

          <View style={styles.mainContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder={'Title'}
              value={this.state.textInputName}
              onChangeText={(text) => this.setState({textInputName: text})}
              onEndEditing={() => this.saveProduct()}
            />
            <TextInput
              style={styles.searchInput}
              multiline={true}
              placeholder={'Description'}
              value={this.state.textInputDescription}
              onChangeText={(text) => this.setState({textInputDescription: text})}
              onEndEditing={() => this.saveProduct()}
            />
            <TouchableHighlight
              style={styles.button}
              onPress={() => this.deleteProduct()} >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableHighlight>
          </View>
        </ScrollView>
      </View>
    );
  }
};


const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    height: 80,
    backgroundColor: '#1E00B1',
    alignItems: 'stretch'
  },
  button: {
    height: 56,
    backgroundColor: '#F5A623',
    alignSelf: 'center',
    width: 150,
    marginTop: 30,
    justifyContent: 'center',
    borderRadius: 3,
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'OpenSans'
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f7f7f7'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  input: {
    height: 40,
    borderColor: 'blue',
    borderWidth: 1,
    color: 'black',
    marginTop: 20
  },
  iconMain: {
    height: 100,
    width: 100,
    flex: 1
  },
  sideText: {
    fontSize: 20,
    fontFamily: 'OpenSans',
    flex: 1,
    marginTop: 10
  },
  searchInput: {
    height: 50,
    padding: 4,
    marginRight: 5,
    fontSize: 23,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 8,
    backgroundColor: 'white',
    color: 'black'
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  iconSideContainer: {
    marginBottom: 10,
    marginTop: 10,
    flexDirection: 'row',
  },
  iconSide: {
    height: 50,
    width: 50,
    flex: 1
  },
  backButton: {
    height: 40,
    borderColor: 'blue',
    borderWidth: 1,
    flex: 1
  },
  logoImage: {
    width: 70,
    height: 70,
    marginTop: -10,
    flex: 1,
  },
});


module.exports = ProductView;
