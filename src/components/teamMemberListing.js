import React from 'react-native';
import { mainBackgroundColor, navbarColor } from '../utilities/colors';

const {
  StyleSheet,
  ScrollView,
  PropTypes,
  Text,
} = React;

class TeamMemberListing extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <ScrollView style={styles.container}>
      {
        this.props.team.currentTeamUsers.map((userId) => {
          const u = this.props.teamsUsers[userId]
          return (
            <Text style={styles.member}>{u.firstName} {u.lastName}</Text>
          );
        })
      }
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
  },
});
TeamMemberListing.propTypes = {
};

export default TeamMemberListing
