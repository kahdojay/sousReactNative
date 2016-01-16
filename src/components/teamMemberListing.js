import React from 'react-native';
import { Icon } from 'react-native-icons';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import Urls from '../resources/urls';

const {
  Image,
  PropTypes,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

class TeamMemberListing extends React.Component {
  constructor(props) {
    super(props)
  }

  getTeamMembers() {
    const {currentTeamUsers, teamsUsers, userId} = this.props
    const teamMembers = [];


    teamMembers.push(
      <View style={styles.row}>
        <View style={styles.member}>
          <Image source={{uri: Urls.msgLogo}} style={styles.avatarImage} />
          <Text style={styles.memberName}>
            Sous Support
          </Text>
        </View>
      </View>
    );

    currentTeamUsers.forEach((userId) => {
      if(teamsUsers.hasOwnProperty(userId)){
        const user = teamsUsers[userId]
        if(user.superUser === true && user.id !== userId)
          return
        let icon = <Icon name='material|account-circle' size={50} color='#aaa' style={styles.avatar}/>
        if (user.hasOwnProperty('imageUrl') && user.imageUrl !== '') {
          icon = <Image source={{uri: user.imageUrl}} style={styles.avatarImage} />
        }
        teamMembers.push(
          <View key={userId} style={styles.row}>
            <View style={styles.member}>
              {icon}
              <Text style={styles.memberName}>
                {user.firstName} {user.lastName}
              </Text>
            </View>
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
    backgroundColor: Colors.mainBackgroundColor,
  },
  row: {
    flex: 1,
    marginTop: 2,
    marginBottom: 2,
    marginRight: 5,
    marginLeft: 5,
    borderRadius: Sizes.rowBorderRadius,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingLeft: 5,
  },
  member: {
    flexDirection: 'row',
    padding: 5,
  },
  memberName: {
    padding: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignSelf: 'center',
    backgroundColor: '#eee',
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignSelf: 'center',
  },
});

TeamMemberListing.propTypes = {
};

export default TeamMemberListing
