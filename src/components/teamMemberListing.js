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
        this.props.currentTeamUsers.map((userId) => {
          const user = this.props.teamsUsers[userId]
          return (
            <Text style={styles.member}>{user.firstName} {user.lastName}</Text>
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
