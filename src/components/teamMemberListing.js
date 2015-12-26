import React from 'react-native';
import { Icon } from 'react-native-icons';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';

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
    const teamMembers = [];
    this.props.currentTeamUsers.forEach((userId) => {
      if(this.props.teamsUsers.hasOwnProperty(userId)){
        const user = this.props.teamsUsers[userId]
        let icon = <Icon name='material|user' size={40} color='#aaa' style={styles.avatar}/>
        if (user.hasOwnProperty('imageUrl') && user.imageUrl !== '') {
          icon = <Image source={{uri: user.imageUrl}} style={styles.avatarImage} />
        }
        teamMembers.push(
          <View key={userId} style={styles.row}>
            <View style={styles.member}>
              {icon}
              <Text style={styles.memberName}>
                {/* * /}{user.superUser === true ? <Text style={{textAlign: 'center', color: Colors.darkBlue, backgroundColor: 'transparent'}}>*</Text> : ''}{/* */}
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
    backgroundColor: Colors.mainBackgroundColor,
  },
  row: {
    marginTop: 2,
    marginBottom: 2,
    marginRight: 5,
    marginLeft: 5,
    borderRadius: Sizes.rowBorderRadius,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center'
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
    marginTop: 5,
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
