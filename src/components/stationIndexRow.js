import React from 'react-native';
import { Icon } from 'react-native-icons';
import _ from 'lodash';
import { greyText, taskCompletedBackgroundColor } from '../utilities/colors';

const {
  View,
  PropTypes,
  ProgressViewIOS,
  Text,
  TouchableOpacity,
  StyleSheet,
} = React;

class StationIndexRow extends React.Component {
  render() {
    let { station } = this.props
    let stationTasks = _.filter(station.tasks,{deleted: false})

    const numCompletedTasks = _.filter(stationTasks, {completed: true}).length
    const totalNumTasks = stationTasks.length
    const progress = numCompletedTasks/totalNumTasks
    let progressColor = progress < 0.9 ? "#4A90E2" : "#7ED321";
    let percentage = Math.floor(( numCompletedTasks / totalNumTasks)*100) || 0

    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={styles.row}>
        <View style={styles.textProgressArrowContainer}>
          <View
            style={styles.textProgressContainer} >
            <View
              style={styles.stationInfo} >
              <Text style={styles.rowText}>{this.props.station.name}</Text>
              <Text style={styles.percentage}>
                {percentage}%
              </Text>
            </View>
            <ProgressViewIOS
              trackTintColor="#e6e6e6"
              progressTintColor={progressColor}
              style={styles.progress}
              progress={progress} />
          </View>
          <Icon name='material|chevron-right' size={40} color='#aaa' style={styles.iconArrow}/>
        </View>
        <View style={styles.separator} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'column',
    padding: 10,
    height: 69
  },
  progress: {
    paddingTop: 5,
    margin: 5,
    height: 8,
    borderRadius: 10,
  },
  rightArrow: {
    fontSize: 20,
    color: '#ccc',
  },
  textProgressArrowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textProgressContainer: {
    flex: 1,
  },
  separator: {
    height: 5,
    borderBottomColor: '#bbb',
    borderBottomWidth: 1,
  },
  stationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  rowText: {
    fontWeight: 'bold',
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 20,
    fontFamily: 'OpenSans'
  },
  iconArrow: {
    width: 70,
    height: 70,
    marginTop: -20,
    marginRight: -15
  },
})

StationIndexRow.propTypes = {
};

export default StationIndexRow
