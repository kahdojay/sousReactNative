import React from 'react-native';
import { Icon } from 'react-native-icons';
import _ from 'lodash';
import Styles from '../utilities/styles';
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
  formatMinimumMsg(amount) {
    if(!!amount.trim()){
      let formattedAmount = '$'.concat(amount.replace(/^\$/, ''))
      return `(min. ${formattedAmount})`
    } else {
      return ''
    }
  }
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
          <View style={styles.purveyorContainer} >
            <View style={styles.purveyorInfo} >
              <Text style={styles.purveyorName}>{purveyorName}</Text>
              {!!purveyor.orderCutoffTime.trim() ? <Text style={styles.purveyorDetails}>Order by {purveyor.orderCutoffTime}</Text> : <View/>}
              {!!purveyor.orderMinimum.trim() ? <Text style={styles.purveyorDetails}>{this.formatMinimumMsg(purveyor.orderMinimum)}</Text> : <View/>}
              {!!purveyor.notes.trim() ? <Text style={styles.purveyorDetails}>{purveyor.notes}</Text> : <View/>}
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
    flexDirection: 'row',
    padding: 5,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    marginTop: 3,
    marginBottom: 3,
    backgroundColor: Colors.rowColor,
  },
  purveyorContainer: {
    flex: 5,
  },
  purveyorInfo: {
    width: 175,
  },
  seperator: {
    height: 5,
    borderBottomColor: Colors.lightGrey,
    borderBottomWidth: 1,
  },
  purveyorName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  purveyorDetails: {
    color: Colors.darkGrey,
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
