import _ from 'lodash'
import { Icon } from 'react-native-icons';
import React from 'react-native';
import Dimensions from 'Dimensions';
import Colors from '../utilities/colors';

const {
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TouchableHighlight,
  Component,
  ProgressViewIOS
} = React;

const window = Dimensions.get('window');

/*
 * Modal for side bar Modal for side bar
 */
module.exports = class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false
    }
  }
  componentDidMount(){
    setTimeout(()=> {
      this.setState({ready: true})
    }, 100)
  }
  render() {
    const {team, session} = this.props
    if(!session.teamId || !team){
      return <View />;
    }
    const team = _.filter(teams.data, { id: session.teamId })[0]
    let avatar = <Icon name='fontawesome|user' size={40} color='white' style={styles.avatar} />
    if (session.imageUrl) {
      avatar = <Image
                  style={styles.avatar}
                  source={{ uri: session.imageUrl }}
                />;
    }
    const totalTasks = team.tasks.length
    const completeTasksCount = _.filter(team.tasks, function(task) {
      return (task.deleted == false && task.completed === true)
    }).length
    const progress = Math.round((completeTasksCount / totalTasks)*100) || 0;

    let showInviteButton = true;
    if(!team || (team && team.name === 'Notepad')){
      showInviteButton = false;
    }

    return (
      <View style={styles.menu}>
        <View style={styles.avatarContainer}>
          <TouchableHighlight
            underlayColor={'#5f697a'}
            onPress={() => {
              this.props.nav.push({
                name: 'Profile',
              })
            }}
          >
            <View>
              {avatar}
              <Text style={styles.name}>{session.firstName} {session.lastName}</Text>
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.separator} />
        <View style={[styles.teamNameContainer]}>
          <TouchableHighlight
            underlayColor='#3e444f'
            onPress={this.props.toggleInviteModal}
          >
            <Text style={styles.teamName}>{team ? team.name : ''}</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.menuBody}>
          <ScrollView>
            <TouchableHighlight
              style={styles.menuItemButton}
              underlayColor='#3e444f'
              onPress={() => {
                this.props.nav.push({
                  name: 'TeamView',
                })
              }}
            >
              <View>
                <View style={styles.menuTextContainer}>
                  <Icon name='fontawesome|table' size={20} color='white' style={styles.menuIcon}/>
                  <Text style={styles.menuItemText}>Prep List</Text>
                </View>
                <View style={styles.progressContainer}>
                  <View style={styles.progressRow}>
                    <ProgressViewIOS
                      style={styles.progressBar}
                      progress={progress/100}
                      trackTintColor='white'
                    />
                    <Text style={styles.progressText}> {progress}%</Text>
                  </View>
                </View>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              style={styles.menuItemButton}
              underlayColor='#3e444f'
              onPress={() => {
                this.props.nav.push({
                  name: 'CategoryIndex',
                })
              }}
            >
              <View style={styles.menuTextContainer}>
                <Icon name='fontawesome|clipboard' size={20} color='white' style={styles.menuIcon}/>
                <Text style={styles.menuItemText}>Order Guide</Text>
              </View>
            </TouchableHighlight>
            {(showInviteButton === false) ? <View/> : (
              <TouchableHighlight
                underlayColor='#3e444f'
                onPress={() => this.props.toggleInviteModal(true)}
                style={styles.menuItemButton}
              >
                <Text style={styles.menuItemText}>
                  {team ? `Invite to ${team.name}` : ''}
                </Text>
              </TouchableHighlight>
            )}
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  menu: {
    marginTop: 20,
    flex: 1,
    width: window.width,
    height: window.height,
  },
  avatarContainer: {
    width: window.width * .7,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3e444f',
    paddingTop: 10,
    paddingBottom: 10,
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 34,
  },
  name: {
    flex: 1,
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  editProfile: {
    fontFamily: 'OpenSans',
    textAlign: 'center',
    color: 'white',
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
  teamNameContainer: {
    width: window.width * .7,
    alignItems: 'center',
    backgroundColor: '#5f697a',
  },
  teamName: {
    fontSize: 25,
    color: 'white',
    fontFamily: 'OpenSans',
  },
  menuBody: {
    flex: 4,
    width: window.width * .7,
    backgroundColor: '#5f697a',
    paddingRight: 10,
    paddingLeft: 10,
  },
  menuItemButton: {
    flex: 1,
    marginBottom: 15,
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
});
