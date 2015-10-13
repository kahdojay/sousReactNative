import React from 'react-native';
import { Icon } from 'react-native-icons';
import { BackBtn } from '../utilities/navigation';
import { NavigationBarStyles } from '../utilities/styles';
import { mainBackgroundColor, navbarColor } from '../utilities/colors';

const {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  NativeModules,
  Image,
  TouchableOpacity,
  TouchableHighlight,
} = React;

const {
  UIManager
} = NativeModules;

class ProductView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      textInputDescription: this.props.product.description,
      textInputName: this.props.product.name,
      saved: true,
    }
  }

  scrollToBottom() {
    // TODO: automatically scroll to bottom on TextInput focus (alternatively, define method to calculate y-position of TextInput and scroll to there)
    // if(this.refs.hasOwnProperty('scrollview')){
    //   UIManager.measure(this.refs.scrollview, (x, y, width, height, left, top) => {
    //     console.log(height);
    //     // this.refs.scrollview.scrollTo(999999)
    //   });
    // }
  }
  scrollToTop() {
    if(this.refs.hasOwnProperty('scrollview')){
      this.refs.scrollview.scrollTo(0)
    }
  }

  saveProduct() {
    if(this.state.saved === false){
      let {purveyorId, product} = this.props;
      let newProduct = this.props.product;
      newProduct.description = this.state.textInputDescription;
      newProduct.name = this.state.textInputName
      this.props.onUpdatePurveyorProduct(purveyorId, product.recipeId, newProduct);
      this.setState({saved: true});
    }
  }
  deleteProduct() {
    let {purveyorId, product} = this.props;
    let newProduct = this.props.product
    newProduct.deleted = true
    this.props.onUpdatePurveyorProduct(purveyorId, product.recipeId, newProduct)
    this.props.navigator.pop()
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.product.deleted === true){
      this.props.navigator.pop()
    } else {
      this.setState({
        textInputDescription: nextProps.product.description,
        textInputName: nextProps.product.name,
        saved: true,
      });
    }
    if(nextProps.ui.keyboard.visible === true){
      this.scrollToBottom();
    } else {
      this.scrollToTop();
    }
  }

  render() {
    if(this.props.ui.keyboard.visible === true){
      // navBar = <View/>
    }
    return (
      <View style={styles.container}>
        <ScrollView
          scrollEventThrottle={200}
          keyboardShouldPersistTaps={false}
          ref='scrollview'
          automaticallyAdjustContentInsets={false}
          contentContainerStyle={styles.scrollWrapper}
        >
          <View style={styles.headerContainer}>
            <Icon
              name='material|assignment'
              size={100}
              color='#aaa'
              style={styles.iconMain}
            />
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
              onChangeText={(text) => this.setState({textInputName: text, saved: false})}
              onEndEditing={() => this.saveProduct()}
            />
            <TextInput
              style={styles.searchInput}
              multiline={true}
              placeholder={'Description'}
              value={this.state.textInputDescription}
              onChangeText={(text) => this.setState({textInputDescription: text, saved: false})}
              onEndEditing={() => this.saveProduct()}
            />
            {this.state.saved === false ? <TouchableHighlight
              style={[styles.button, {backgroundColor: '#423'}]}
              onPress={() => this.saveProduct()} >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableHighlight> : <View />}
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
  button: {
    height: 56,
    backgroundColor: '#F5A623',
    alignSelf: 'center',
    width: 150,
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
  },
  scrollWrapper: {
    flex: 1,
    justifyContent: 'space-between'
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7'
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7'
  },
  input: {
    height: 40,
    borderColor: 'blue',
    borderWidth: 1,
    color: 'black',
  },
  iconMain: {
    height: 100,
    width: 100,
    flex: 1
  },
  searchInput: {
    height: 50,
    padding: 4,
    fontSize: 23,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 8,
    backgroundColor: 'white',
    color: 'black'
  },
  sideText: {
    fontSize: 20,
    fontFamily: 'OpenSans',
    flex: 1,
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  iconSideContainer: {
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
    width: 45,
    height: 45,
  },
});

module.exports = ProductView;
