import _ from 'lodash'
import { Icon } from 'react-native-icons';
import React from 'react-native';
import Dimensions from 'Dimensions';
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
    const {teams, session} = this.props
    if(teams.data.length === 0){
      return <View />;
    }
    const team = _.filter(teams.data, { id: session.teamId })[0]
    let avatar = <Icon name='material|account-circle' size={80} color='white' style={styles.avatar} />
    if (session.imageUrl) {
      avatar = <Image
                  style={styles.avatar}
                  source={{ uri: session.imageUrl }}
                />;
    }
    let inviteButton = <TouchableHighlight
                          underlayColor='#eee'
                          onPress={() => {
                            this.props.nav.push({
                              name: 'InviteView',
                            })
                          }}
                          style={styles.saveButton}
                        >
                          <Text style={styles.saveText}>
                            {team ? `Invite to ${team.name}` : ''}
                          </Text>
                        </TouchableHighlight>
    let totalTasks = team.tasks.length
    let completeTasksCount = _.filter(team.tasks, function(task) {
      return (task.deleted == false && task.completed === true)
    }).length
    let progress = Math.round((completeTasksCount / totalTasks)*100) || 0;
    return (
      <View>
        <ScrollView style={styles.menu}>
          <View style={styles.avatarContainer}>
            <TouchableHighlight
              underlayColor={'#777'}
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
          <View style={styles.inviteContainer}>
            <TouchableHighlight
              underlayColor='#aaa'
              onPress={() => {
                this.props.nav.push({
                  name: 'Feed',
                })
              }}
            >
              <Text style={styles.teamText}>{team ? team.name : ''}</Text>
            </TouchableHighlight>
            {team && team.name === 'Notepad' ? <View/> : inviteButton}
          </View>
          <View style={styles.menuItems}>
            <TouchableHighlight
              style={styles.menuItemButton}
              underlayColor='#ccc'
              onPress={() => {
                this.props.nav.push({
                  name: 'TeamView',
                })
              }}
            >
              <View style={styles.progressContainer}>
                <View style={styles.progressRow}>
                  <Text style={styles.menuItemText}>Prep List</Text>
                  <Text style={styles.menuItemText}> {progress}%</Text>
                </View>
                <ProgressViewIOS
                  style={styles.progressBar}
                  progress={progress/100}
                  trackTintColor='white'
                />
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.menuItemButton}
              underlayColor='#ccc'
              onPress={() => {
                this.props.nav.push({
                  name: 'CategoryIndex',
                })
              }}
            >
              <Text style={styles.menuItemText}>Order Guide</Text>
            </TouchableHighlight>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: '#aaa',
    flexDirection: 'column',
  },
  avatarContainer: {
    flex: 1,
    width: window.width * .7,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#777',
    paddingTop: 15,
    paddingBottom: 15
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 34,
  },
  name: {
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
  item: {
    fontSize: 14,
    fontWeight: '300',
    paddingTop: 5,
  },
  separator: {
    height: 1,
    borderColor: '#eee',
    borderWidth: 1,
  },
  inviteContainer: {
    flex: 1,
    width: window.width * .7,
    flexDirection: 'column',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: 'white',
    padding: 10,
    width: 150,
    borderRadius: 7,
  },
  saveText:{
    fontSize: 14,
    fontWeight: 'bold',
    color: 'blue',
    textAlign: 'center',
  },
  teamText: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'OpenSans',
  },
  menuItems: {
    paddingLeft: 10,
    marginTop: 10,
    marginLeft: 15,
  },
  menuItemButton: {
    marginTop: 20,
  },
  menuItemText: {
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
    color: 'white',
  },
  progressContainer: {
    width: window.width * .5
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
});
