import React from 'react-native';
import { mainBackgroundColor, navbarColor, darkBlue } from '../utilities/colors';

const {
  StyleSheet,
  ScrollView,
  PropTypes,
  Text,
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
        teamMembers.push(
          <Text key={userId} style={styles.member}>
            {user.superUser === true ? <Text style={{textAlign: 'center', color: darkBlue, backgroundColor: 'transparent'}}>*</Text> : ''}
            {user.firstName} {user.lastName}
          </Text>
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
    padding: 5,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
});
TeamMemberListing.propTypes = {
};

export default TeamMemberListing
