import React from 'react-native';
import { Icon } from 'react-native-icons';
import _ from 'lodash';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';

const {
  View,
  PropTypes,
  ProgressViewIOS,
  Text,
  TouchableOpacity,
  StyleSheet,
} = React;

class PurveyorIndexRow extends React.Component {
  render() {
    let { purveyor, products } = this.props
    let purveyorProducts = _.filter(products, {purveyorId: purveyor.id, deleted: false})

    // const numCompletedProducts = _.filter(purveyorProducts, {completed: true}).length
    // const totalNumProducts = purveyorProducts.length
    // const progress = numCompletedProducts/totalNumProducts
    const purveyorName = purveyor.name.substr(0,24) + (purveyor.name.length > 24 ? '...' : '')

    return (
      <TouchableOpacity
        onPress={this.props.onPress}
      >
        <View style={styles.row}>
          <View style={styles.textProgressContainer} >
            <View style={styles.purveyorInfo} >
              <Text style={styles.rowText}>{purveyorName}</Text>
            </View>
          </View>
          <View style={styles.iconContainer}>
            <Icon name='material|chevron-right' size={30} color={Colors.lightBlue} style={styles.iconArrow}/>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    borderRadius: Sizes.rowBorderRadius,
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 5,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    marginTop: 3,
    marginBottom: 3,
    marginRight: 5,
    marginLeft: 5,
  },
  textProgressContainer: {
    flex: 6,
  },
  seperator: {
    height: 5,
    borderBottomColor: Colors.lightGrey,
    borderBottomWidth: 1,
  },
  purveyorInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowText: {
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 18,
    fontFamily: 'OpenSans'
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  iconArrow: {
    width: 50,
    height: 50,
  },
})

PurveyorIndexRow.propTypes = {
  onPress: React.PropTypes.func,
  purveyor: React.PropTypes.object,
};

export default PurveyorIndexRow
