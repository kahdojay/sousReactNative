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

class TeamIndexRow extends React.Component {
  render() {
    let { team, messages } = this.props
    // console.log('TEAM MESSAGES', messages);
    let filteredMessages = messages.data.map((message) => {
      if (message.teamId === team.id)
        return message;
    });
    let mostRecentMessage = filteredMessages.sort((a,b) => {
      return a.createdAt < b.createdAt
    })[0].message.split('').splice(0, 30).join('') + '...';
    console.log('RECENT', mostRecentMessage);
    let teamTasks = _.filter(team.tasks,{deleted: false})

    const numCompletedTasks = _.filter(teamTasks, {completed: true}).length
    const totalNumTasks = teamTasks.length
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
              style={styles.teamInfo} >
              <Text style={styles.rowText}>{this.props.team.name}</Text>
              <Text style={styles.percentage}>
                {mostRecentMessage}
              </Text>
            </View>

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
  percentage:{
    fontFamily: 'OpenSans',
    color: '#777',
    fontSize: 13,
  },
  separator: {
    height: 5,
    borderBottomColor: '#bbb',
    borderBottomWidth: 1,
  },
  teamInfo: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
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

TeamIndexRow.propTypes = {
};

export default TeamIndexRow
