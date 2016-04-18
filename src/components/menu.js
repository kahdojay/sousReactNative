import React from 'react-native';
import { Icon } from 'react-native-icons';
import _ from 'lodash';
import pkgInfo from '../../package.json';
import Colors from '../utilities/colors';
import AvatarUtils from '../utilities/avatar';

const {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TouchableHighlight,
  ProgressViewIOS
} = React;

const window = Dimensions.get('window');

/*
 * Modal for side bar Modal for side bar
 */
module.exports = class Menu extends React.Component {
  render() {
    const {team, session} = this.props
    const version = pkgInfo.version;
    const build = pkgInfo.build;
    if (!session.teamId || !team) {
      return <View />;
    }

    let avatar = AvatarUtils.getAvatar(session, 50)
    if (avatar === null) {
      avatar = <Icon name='material|account-circle' size={60} color={Colors.lightGrey} style={styles.avatar} />
    }
    const totalTasks = _.filter(team.tasks, { deleted: false } ).length
    const completeTasksCount = _.filter(team.tasks, { deleted: false, completed: true }).length
    const progress = Math.round((completeTasksCount / totalTasks)*100) || 0;

    return (
      <View style={styles.menu}>
        <View style={styles.avatarContainer}>
          <TouchableHighlight
            underlayColor='transparent'
            onPress={() => {
              if(this.props.connected === true){
                this.props.onNavToProfile()
              }
            }}
          >
            <View style={{alignItems: 'center'}}>
              <View style={[styles.avatar, {width: 54, height: 54, borderRadius: 27, padding: 1}]}>
                {avatar}
              </View>
              <Text style={styles.name}>{session.firstName} {session.lastName}</Text>
              <Text style={styles.editProfile}>Edit Profile</Text>
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.separator} />
        <View style={styles.menuBody}>
          <ScrollView>
            <TouchableHighlight
              key='order-guide'
              onPress={this.props.onNavToPurveyor}
              style={styles.menuItemButton}
              underlayColor='#3e444f'
            >
              <View style={styles.menuTextContainer}>
                <Icon name='material|assignment' size={20} color='white' style={styles.menuIcon}/>
                <Text style={styles.menuItemText}>Order Guide</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              key='receiving-guide'
              onPress={this.props.onNavToOrders}
              style={styles.menuItemButton}
              underlayColor='#3e444f'
            >
              <View style={styles.menuTextContainer}>
                <Icon name='material|assignment-check' size={20} color='white' style={styles.menuIcon}/>
                <Text style={styles.menuItemText}>Receiving Guide</Text>
              </View>
            </TouchableHighlight>
            {/*<TouchableHighlight
              style={styles.menuItemButton}
              underlayColor='#3e444f'
              onPress={this.props.onNavToTeam}
            >
              <View>
                <View style={styles.menuTextContainer}>
                  <Icon name='material|format-list-numbered' size={20} color='white' style={styles.menuIcon}/>
                  <Text style={styles.menuItemText}>Prep List</Text>
                </View>
                <View style={styles.progressContainer}>
                  <View style={styles.progressRow}>
                    <ProgressViewIOS
                      progressTintColor={Colors.lightBlue}
                      style={styles.progressBar}
                      progress={progress/100}
                      trackTintColor='white'
                    />
                    <Text style={styles.progressText}> {progress}%</Text>
                  </View>
                </View>
              </View>
            </TouchableHighlight>*/}
            <TouchableHighlight
              key='team-members'
              onPress={this.props.onNavToTeamView}
              style={styles.menuItemButton}
              underlayColor='#3e444f'
            >
              <View style={styles.menuTextContainer}>
                <Icon name='material|settings' size={20} color='white' style={styles.menuIcon}/>
                <Text style={styles.menuItemText}>{this.props.team.name}</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={this.props.onNavToTeamIndex}
              style={styles.menuItemButton}
              underlayColor='#3e444f'
            >
              <View style={styles.menuTextContainer}>
                <Icon name='material|group-work' size={20} color='white' style={styles.menuIcon}/>
                <Text style={styles.menuItemText}>
                  All Teams
                </Text>
              </View>
            </TouchableHighlight>
          </ScrollView>
        </View>
        <View style={styles.separator} />
        <View style={styles.teamNameContainer}>
          <Text style={styles.sous}>Sous</Text>
          <Text style={styles.buildInfo}>{version}({build})</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  menu: {
    marginTop: 20,
    width: window.width * (2/3), // See react-native-side-menu source
    height: window.height,
  },
  avatarContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3e444f',
    paddingTop: 10,
    paddingBottom: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
  },
  name: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'OpenSans',
    textAlign: 'center',
    color: 'white',
  },
  editProfile: {
    fontSize: 12,
    fontFamily: 'OpenSans',
    textAlign: 'center',
    color: Colors.lightBlue,
  },
  menuItem: {
  },
  menuTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  separator: {
    height: 1,
    borderColor: '#eee',
    borderWidth: 1,
  },
  menuBody: {
    flex: 5,
    width: window.width * (2/3),
    backgroundColor: '#5f697a',
  },
  menuItemButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
  },
  menuIcon: {
    width: 20,
    height: 20,
  },
  menuItemText: {
    marginLeft: 10,
    flex: 2,
    fontFamily: 'OpenSans',
    fontSize: 18,
    color: 'white',
  },
  progressContainer: {
    width: window.width * .6,
  },
  progressRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5
  },
  progressBar: {
    flex: 4,
    marginTop: 5,
    marginBottom: 5
  },
  progressText: {
    fontFamily: 'OpenSans',
    fontSize: 15,
    color: 'white',
  },
  teamNameContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#3e444f',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  sous: {
    color: 'white',
    fontSize: 13,
    fontFamily: 'OpenSans',
  },
  buildInfo: {
    fontFamily: 'OpenSans',
    fontSize: 10,
    color: '#aaaaaa',
  }
});
