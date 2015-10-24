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
    const totalTasks = team.tasks.length
    const completeTasksCount = _.filter(team.tasks, function(task) {
      return (task.deleted == false && task.completed === true)
    }).length
    const progress = Math.round((completeTasksCount / totalTasks)*100) || 0;

    let showInviteButton = true;
    if(!team || (team && team.name === 'Notepad')){
      showInviteButton = false;
    }
    let inviteContainerStyle = {};
    if(showInviteButton === true){
      inviteContainerStyle = {
        flex: 2,
      }
    }

    return (
      <View style={styles.menu}>
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
        <View style={[styles.inviteContainer, inviteContainerStyle]}>
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
          {(showInviteButton === false) ? <View/> : (
            <TouchableHighlight
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
          )}
        </View>
        <ScrollView style={styles.menuItems}>
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
        </ScrollView>
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
    backgroundColor: '#aaa',
    flexDirection: 'column',
  },
  avatarContainer: {
    flex: 2,
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
    padding: 5,
    marginTop: 5,
    marginBottom: 5
  },
  menuItems: {
    flex: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  menuItemButton: {
    marginBottom: 20
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
