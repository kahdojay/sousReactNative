import React from 'react-native';
import _ from 'lodash';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import moment from 'moment';

const {
  PropTypes,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  SegmentedControlIOS,
  View,
} = React;

class OrderIndex extends React.Component {
  render() {
    const { orders, purveyors, teamsUsers } = this.props

    let fullOrders = _.map(orders, (order) => {
      return Object.assign({}, order, {
        purveyor: purveyors[order.purveyorId],
        user: teamsUsers[order.userId]
      })
    })

    let ordersList = _.map(_.sortBy(fullOrders, 'purveyor.name'), (order) => {
      if (order.hasOwnProperty('confirmed') === false || order.confirmed === false) {
        const itemCount = Object.keys(order.orderDetails.products).length
        const orderedAtDate = moment(order.orderedAt)
        return (
          <View style={styles.row}>
            <View style={{flex:2}}>
              <Text style={[styles.purveyorName, styles.bold]}>
                {order.purveyor.name}
                <Text style={styles.metaInfo}> {`${itemCount} Item${itemCount > 1 ? 's' : ''}`}</Text>
              </Text>
              <Text style={styles.metaInfo}>{`${order.user.firstName} ${order.user.lastName[0]}.`}</Text>
            </View>
            <View style={{flex:1}}>
              <Text style={[styles.metaInfo, styles.bold, styles.rightAlign]}>{orderedAtDate.format('M/D/YY')}</Text>
              <Text style={[styles.metaInfo, styles.rightAlign]}>{orderedAtDate.format('h:mm a')}</Text>
            </View>
          </View>
        )
      }
    })

    return (
      <View style={styles.container}>
        <ScrollView
          automaticallyAdjustContentInsets={false}
          keyboardShouldPersistTaps={false}
          style={styles.scrollView}
        >
          {ordersList}
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
    flex: 1,
    backgroundColor: Colors.mainBackgroundColor,
  },
  separator: {
    height: 0,
    borderBottomColor: '#bbb',
    borderBottomWidth: 1,
  },
  row: {
    marginTop: 5,
    marginBottom: 5,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: Sizes.rowBorderRadius,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  purveyorName: {
    color: 'black',
    fontSize: 14
  },
  metaInfo: {
    color: '#999',
    fontWeight: 'normal',
    fontSize: 12,
  },
  bold: {
    fontWeight: 'bold'
  },
  rightAlign: {
    textAlign: 'right'
  }
});

OrderIndex.propTypes = {
};

export default OrderIndex
