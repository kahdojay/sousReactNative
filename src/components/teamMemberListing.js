import React from 'react-native';
import { Icon } from 'react-native-icons';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import Urls from '../resources/urls';
import DataUtils from '../utilities/data';

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
    const {currentTeamUsers, teamsUsers, userId, settingsConfig} = this.props
    const teamMembers = [];

    let memberContactDetails = []
    if(settingsConfig && settingsConfig.hasOwnProperty('supportSettings') === true){  
      if(settingsConfig.supportSettings && settingsConfig.supportSettings.phoneNumber){
        if(memberContactDetails.length > 0){
          memberContactDetails.push(<Text key='supportPhoneNumberSeparator' style={styles.detailsSeparator}>{' • '}</Text>)
        }
        const supportPhoneNumber = DataUtils.formatPhoneNumber(settingsConfig.supportSettings.phoneNumber)
        memberContactDetails.push(<Text key='supportPhoneNumber' style={styles.phoneNumber}>{supportPhoneNumber}</Text>)
      }
      if(settingsConfig.supportSettings && settingsConfig.supportSettings.emailAddress){
        if(memberContactDetails.length > 0){
          memberContactDetails.push(<Text key='supportEmailAddressSeparator' style={styles.detailsSeparator}>{' • '}</Text>)
        }
        memberContactDetails.push(<Text key='supportEmailAddress' style={styles.emailAddress}>{settingsConfig.supportSettings.emailAddress}</Text>)
      }
    }
    teamMembers.push(
      <View style={styles.row}>
        <View style={styles.member}>
          <Image source={{uri: Urls.msgLogo}} style={styles.avatarImage} />
          <View style={styles.memberInfoContainer}>
            <View style={styles.memberName}>
              <Text style={[styles.text, styles.textBold]}>Sous Support</Text>
            </View>
            <View style={styles.memberContactDetails}>
              {memberContactDetails}
            </View>
          </View>
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
        let memberContactDetails = []
        if(user.username){
          if(memberContactDetails.length > 0){
            memberContactDetails.push(<Text key='phoneNumberSeparator' style={styles.detailsSeparator}>{' • '}</Text>)
          }
          const userPhoneNumber = DataUtils.formatPhoneNumber(user.username)
          memberContactDetails.push(<Text key='phoneNumber' style={styles.phoneNumber}>{userPhoneNumber}</Text>)
        }
        if(user.email){
          if(memberContactDetails.length > 0){
            memberContactDetails.push(<Text key='emailAddressSeparator' style={styles.detailsSeparator}>{' • '}</Text>)
          }
          memberContactDetails.push(<Text key='emailAddress' style={styles.emailAddress}>{user.email}</Text>)
        }
        teamMembers.push(
          <View key={userId} style={styles.row}>
            <View style={styles.member}>
              {icon}
              <View style={styles.memberInfoContainer}>
                <View style={styles.memberName}>
                  <Text style={[styles.text, styles.textBold]}>{user.firstName}</Text>
                  <Text style={styles.text}> {user.lastName}</Text>
                </View>
                <View style={styles.memberContactDetails}>
                  {memberContactDetails}
                </View>
              </View>
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
  textBold: {
    fontWeight: 'bold',
  },
  text: {
    fontFamily: 'OpenSans',
    fontSize: 16,
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
    paddingRight: 5,
  },
  member: {
    flexDirection: 'row',
    padding: 5,
  },
  memberInfoContainer: {
    padding: 15,
  },
  memberName: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  memberContactDetails: {
    flexDirection: 'row',
  },
  phoneNumber: {
    fontSize: 10,
    color: Colors.lightGrey,
  },
  emailAddress: {
    fontSize: 10,
    color: Colors.lightGrey,
  },
  detailsSeparator: {
    fontSize: 10,
    color: Colors.separatorColor,
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
