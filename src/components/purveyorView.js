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

  render() {
    let purveyor = this.props.purveyor

    return (
      <View style={styles.container}>
        <AddForm
          placeholder="Add a Product..."
          onSubmit={(productName) => {
            this.props.onAddNewProduct(purveyor.id, productName)
          }}
        />
        <ProductList
          purveyor={purveyor}
          onUpdatePurveyorProduct={this.props.onUpdatePurveyorProduct}
        />
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
    width: 45,
    height: 45,
  },
  iconMore: {
    width: 40,
    height: 40,
  }
});

PurveyorView.propTypes = {
};

export default PurveyorView
