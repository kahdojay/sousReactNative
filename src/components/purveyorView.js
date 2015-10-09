import React from 'react-native';
import { Icon } from 'react-native-icons'
import ProductList from '../components/productList';
import { BackBtn } from '../utilities/navigation';
import { NavigationBarStyles } from '../utilities/styles';
import AddForm from './addForm';
import { mainBackgroundColor, navbarColor } from '../utilities/colors';
const {
  ActionSheetIOS,
  StyleSheet,
  View,
  PropTypes,
  TouchableHighlight,
  TouchableOpacity,
  Text,
  Image
} = React;

class PurveyorView extends React.Component {
  constructor(props) {
    super(props)
  }
  showActionSheet(){
    console.log('show actionsheet')
    let buttons = [
      'Delete Purveyor',
      'Rename Purveyor',
      'Cancel'
    ]
    let deleteAction = 0;
    let cancelAction = 2;
    ActionSheetIOS.showActionSheetWithOptions({
      options: buttons,
      cancelButtonIndex: cancelAction,
      destructiveButtonIndex: deleteAction,
    },
    (buttonIndex) => {
      if( deleteAction === buttonIndex ){
        // process the delete
        this.props.onDeletePurveyor(this.props.purveyor.key);
        // pop the view
        this.props.navigator.pop();
      }
    });
  }
  render() {
    let purveyor = this.props.purveyor
    let products = this.props.products
    return (
      <View style={styles.container}>
        <View style={[
          NavigationBarStyles.navBarContainer,
          {backgroundColor: navbarColor}
        ]}>
          <View style={[
            NavigationBarStyles.navBar,
            {paddingVertical: 20}
          ]}>
            <BackBtn
              navigator={this.props.navigator}
              style={NavigationBarStyles.navBarText}
              />
            <Image source={require('image!Logo')} style={styles.logoImage}></Image>
            <TouchableOpacity
              onPress={this.showActionSheet.bind(this)}
              style={styles.iconMore}>
              <View
                style={[
                  NavigationBarStyles.navBarRightButton,
                  {marginVertical: 0}
                ]}>
                <Icon
                  name='fontawesome|cog'
                  size={45}
                  color='white'
                  style={styles.iconMore}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <AddForm
          placeholder="Add a Product..."
          onSubmit={text => {
            this.props.onAddNewProduct(text, purveyor.key)
          }}/>
        <ProductList
          navigator={this.props.navigator}
          updateProductQuantity={this.props.updateProductQuantity}
          products={products}
          onProductClick={(productId) => this.props.onToggleProduct(productId)}/>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mainBackgroundColor,
  },
  logoImage: {
    width: 70,
    height: 70,
    marginTop: -10
  },
  iconMore: {
    width: 60,
    height: 60,
    marginTop: -4
  }
});

PurveyorView.propTypes = {
  products: React.PropTypes.Object,
  purveyorName: React.PropTypes.string.isRequired,
  updateProductQuantity: React.PropTypes.func,
};

export default PurveyorView
