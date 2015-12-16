import { Icon } from 'react-native-icons';
import React from 'react-native';
import { mainBackgroundColor, navbarColor, darkBlue } from '../utilities/colors';

const {
  StyleSheet,
  ScrollView,
  PropTypes,
  Text,
  TouchableHighlight,
  View,
} = React;

class TeamMemberListing extends React.Component {
  constructor(props) {
    super(props)
  }

  getTeamMembers() {
    const teamMembers = [];
    this.props.currentTeamUsers.forEach((userId) => {
      if(this.props.teamsUsers.hasOwnProperty(userId)){
        const user = this.props.teamsUsers[userId]
        let icon = <Icon name='fontawesome|user' size={40} color='#aaa' style={styles.avatar}/>
        if (user.hasOwnProperty('imageUrl') && user.imageUrl !== '') {
          icon = <Image source={{uri: user.imageUrl}} style={styles.avatarImage} />
        }
        teamMembers.push(
          <View>
            <View style={styles.member}>
              {icon}
              <Text key={userId} style={styles.memberName}>
                {/* * /}{user.superUser === true ? <Text style={{textAlign: 'center', color: darkBlue, backgroundColor: 'transparent'}}>*</Text> : ''}{/* */}
                {user.firstName} {user.lastName}
              </Text>
            </View>
            <View style={styles.separator} />
          </View>
        );
      }
    })
    return teamMembers;
  }

  render() {

    const teamMembers = this.getTeamMembers();
    return (
      <ScrollView style={styles.container}>
        {teamMembers}
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mainBackgroundColor,
  },
  member: {
    flexDirection: 'row',
    padding: 5,
    backgroundColor: '#fff',
  },
  memberName: {
    padding: 15
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignSelf: 'center',
    backgroundColor: '#eee'
  },
  avatarImage: {
    width: 40,
    marginTop: 10,
    height: 40,
    borderRadius: 20,
  },
  separator: {
    height: 1,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
});
TeamMemberListing.propTypes = {
};

export default TeamMemberListing
