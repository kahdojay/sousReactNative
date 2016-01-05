import React from 'react-native';
import { Icon } from 'react-native-icons';
import _ from 'lodash';
import Colors from '../utilities/colors';

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
    const purveyorName = purveyor.name.substr(0,18) + (purveyor.name.length > 18 ? '...' : '')

    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={styles.row}
      >
        <View style={styles.textProgressArrowContainer}>
          <View style={styles.textProgressContainer} >
            <View style={styles.purveyorInfo} >
              <Text style={styles.rowText}>{purveyorName}</Text>
            </View>
          </View>
          <Icon name='material|chevron-right' size={40} color='#aaa' style={styles.iconArrow}/>
        </View>
        <View style={styles.seperator} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'column',
    padding: 10,
  },
  progress: {
    margin: 5,
    height: 8,
    borderRadius: 10,
  },
  textProgressArrowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textProgressContainer: {
    flex: 1,
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
    fontWeight: 'bold',
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 20,
    fontFamily: 'OpenSans'
  },
  iconArrow: {
    width: 40,
    height: 40,
  },
})

PurveyorIndexRow.propTypes = {
  onPress: React.PropTypes.func,
  purveyor: React.PropTypes.object,
};

export default PurveyorIndexRow
