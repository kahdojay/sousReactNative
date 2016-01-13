import React from 'react-native';
import { Icon } from 'react-native-icons';
import _ from 'lodash';
import Sizes from '../utilities/sizes';
import Colors from '../utilities/colors';
import messageUtils from '../utilities/message';
import moment from 'moment';
import Swipeout from 'react-native-swipeout';

const {
  View,
  PropTypes,
  ProgressViewIOS,
  Text,
  TouchableOpacity,
  StyleSheet,
} = React;

class TeamIndexRow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      enabled: (this.props.connected === true && this.props.selected === false)
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      enabled: (nextProps.connected === true && nextProps.selected === false)
    })
  }

  render() {
    const { team, messages } = this.props
    const memberCount = _.compact(_.filter(team.users, (userId) => {
      return this.props.teamsUsers.hasOwnProperty(userId)
    })).length;
    const recentMessages = Object.keys(messages).sort((a,b) => {
      return moment(messages[a].createdAt).isBefore(messages[b].createdAt) ? 1 : -1;
    });
    let messageLength = 30;
    let mostRecentMessage = '';
    if (recentMessages.length > 0){
      const lastMessage = messages[recentMessages[0]]
      mostRecentMessage = messageUtils.formatMessage(lastMessage, messageLength);
    }
    let teamTasks = _.filter(team.tasks,{deleted: false})

    const numCompletedTasks = _.filter(teamTasks, {completed: true}).length
    const totalNumTasks = teamTasks.length
    const progress = numCompletedTasks/totalNumTasks
    let progressColor = progress < 0.9 ? "#4A90E2" : "#7ED321";
    // let percentage = Math.floor(( numCompletedTasks / totalNumTasks)*100) || 0

    let selectedColor = Colors.green
    let changeColor = Colors.lightBlue
    if(this.props.connected === false){
      selectedColor = Colors.disabled
      changeColor = Colors.disabled
    }

    const buttons = [{
      backgroundColor: 'transparent',
      component: (
        <Icon name='material|account' size={30} color={Colors.lightBlue} style={styles.iconRemove}>
          <Icon name='material|close' size={16} color={Colors.lightBlue} style={{width: 15, height: 15, marginTop: 15, marginLeft: 7,}} />
        </Icon>
      ),
      onPress: () => {
        if(this.props.teamsCount > 1){
          this.props.onLeaveTeam(team.id)
        } else {
          this.props.onShowLeaveError()
        }
        return
      }
    }]

    return (
      <Swipeout
        right={buttons}
        close={true}
        backgroundColor={Colors.mainBackgroundColor}
      >
        <TouchableOpacity
          onPress={() => {
            if(this.state.enabled){
              this.props.onPress()
            }
          }}
          style={styles.row}
          activeOpacity={(this.state.enabled) ? .5 : 1}
        >
          <View style={styles.textProgressArrowContainer}>
            <View style={styles.textProgressContainer}>
              <View
                style={styles.teamInfo} >
                <View style={styles.teamTextContainer}>
                  <Text style={styles.rowText}>{this.props.team.name}</Text>
                  <Text style={styles.memberCount}>{memberCount} members</Text>
                </View>
                <Text style={styles.messagePreview}>
                  {mostRecentMessage}
                </Text>
              </View>
            </View>
            <View style={styles.iconContainer}>
              { this.props.selected === false ?
                <Icon name='material|chevron-right' size={30} color={changeColor} style={styles.iconArrow}/>
              :
                <Icon name='material|check' size={30} color={selectedColor} style={styles.iconArrow}/>
              }
            </View>
          </View>
        </TouchableOpacity>
      </Swipeout>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    marginTop: 2,
    marginBottom: 2,
    marginRight: 5,
    marginLeft: 5,
    borderRadius: Sizes.rowBorderRadius,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 5,
  },
  progress: {
    paddingTop: 5,
    margin: 5,
    height: 8,
    borderRadius: 10,
  },
  textProgressArrowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textProgressContainer: {
    flex: 5,
  },
  teamTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberCount: {
    fontFamily: 'OpenSans',
    fontSize: 11,
    color: Colors.greyText,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  messagePreview:{
    fontFamily: 'OpenSans',
    color: '#777',
    fontSize: 13,
    marginLeft: 5,
  },
  teamInfo: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  rowText: {
    fontWeight: 'bold',
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 20,
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
  iconRemove: {
    flex: 1,
    alignSelf: 'center',
    width: 54,
    height: 30,
    marginLeft: 2,
    marginTop: 7,
    marginBottom: 7,
  },
})

TeamIndexRow.propTypes = {
};

export default TeamIndexRow
