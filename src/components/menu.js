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
} = React;

const window = Dimensions.get('window');
const uri = 'http://pickaface.net/includes/themes/clean/img/slide2.png';

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    marginTop: 20,
    width: window.width,
    height: window.height,
    backgroundColor: '#aaa',
    flexDirection: 'column',
  },
  avatarContainer: {
    marginTop: -20,
    width: 214,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#777',

  },
  avatar: {
    width: 75,
    height: 75,
    marginTop: 10,
    borderRadius: 34,
    marginBottom: 5,
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
    marginBottom: 4,
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
    width: 214,
    flexDirection: 'column',
    alignItems: 'center',
  },
  saveButton: {
    marginTop: 5,
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
  teamItems: {
    borderLeftWidth: 1,
    borderLeftColor: '#bbb',
    marginLeft: 15,
    marginTop: 20,
  },
  viewSelect: {
    paddingTop: 8,
  },
  teamItemText: {
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
    marginBottom: 10,
  }
});

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
    // console.log("MENU PROPS", this.props);
    const {teams, session} = this.props
    if(teams.data.length === 0){
      return <View />;
    }
    const team = _.filter(teams.data, { id: session.teamId })[0]
    let avatar = <Icon name="material|account-circle" size={100} style={styles.avatar} />
    if (session.imageUrl) {
      avatar = <Image
        style={styles.avatar}
        source={{ uri: session.imageUrl }}/>;
    }
    return (
      <View>
        <ScrollView style={styles.menu}>
          <View style={styles.avatarContainer}>
            {avatar}
            <Text style={styles.name}>{session.firstName} {session.lastName}</Text>
            <TouchableHighlight
              underlayColor={'#777'}
              onPress={() => {
                this.props.nav.push({
                  name: 'Profile',
                })
              }}
              >
              <Text style={styles.editProfile}>Edit Profile</Text>
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
            <TouchableHighlight
              underlayColor='#eee'
              onPress={() => {
                this.props.nav.push({
                  name: 'InviteView',
                })
              }}
              style={styles.saveButton}
            >
              <Text style={styles.saveText}>Invite to {team ? team.name : ''}</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.teamItems}>
            <TouchableHighlight
              style={styles.viewSelect}
              underlayColor='#ccc'
              onPress={() => {
                this.props.nav.push({
                  name: 'TeamView',
                })
              }}
            >
              <Text style={styles.teamItemText}>Prep List</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.viewSelect}
              underlayColor='#ccc'
              onPress={() => {
                this.props.nav.push({
                  name: 'CategoryIndex',
                })
              }}
            >
              <Text style={styles.teamItemText}>Order Guide</Text>
            </TouchableHighlight>
          </View>
        </ScrollView>
      </View>
    );
  }
}
