import React from 'react-native';
import _ from 'lodash';
import {
  greyText,
  taskCompletedBackgroundColor
} from '../utilities/colors';

let {
  View,
  PropTypes,
  ProgressViewIOS,
  Text,
  TouchableOpacity,
  StyleSheet,
} = React;

export default class StationIndexRow extends React.Component {
  render() {
    let { station, tasks } = this.props
    let stationTasks = _.filter(tasks, {stationId: station.id})
    const numCompletedTasks = stationTasks.length
    const totalNumTasks = stationTasks.length
    const progress = numCompletedTasks/totalNumTasks

    let progressColor = null;
    if (progress < 0.4) {
      progressColor = "red"
    } else if (progress < 0.9) {
      progressColor = "lightblue"
    } else {
      progressColor = "blue"
    }

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
                {numCompletedTasks}/{totalNumTasks}
              </Text>
            </View>
            <ProgressViewIOS
              progressTintColor={progressColor}
              style={styles.progress}
              progress={progress} />
          </View>
          <Text style={styles.rightArrow}>></Text>
        </View>
        <View style={styles.seperator} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'column',
    padding: 10,
    height: 60
  },
  progress: {
    paddingTop: 5,
    margin: 5,
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
  seperator: {
    height: 1,
    backgroundColor: '#E4E4E4',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  stationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  rowText: {
    fontWeight: 'bold',
    paddingLeft: 5,
    paddingRight: 5
  },
})

StationIndexRow.propTypes = {
};
