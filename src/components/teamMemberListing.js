import React from 'react-native';
import { Icon } from 'react-native-icons';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import Urls from '../resources/urls';
import DataUtils from '../utilities/data';
import AvatarUtils from '../utilities/avatar';

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

  handlePress(type, value) {
    this.props.onHandlePress(type, value)
  }

  getTeamMembers() {
    const {currentTeamUsers, teamsUsers, userId, settingsConfig} = this.props
    const teamMembers = [];

    let memberContactDetails = []
    let showContactButtons = false
    let showPhoneIcon = false
    let showEmailIcon = false
    let supportPhoneNumber = null
    if(settingsConfig && settingsConfig.hasOwnProperty('supportSettings') === true){
      showContactButtons = true
      if(settingsConfig.supportSettings && settingsConfig.supportSettings.phoneNumber){
        // if(memberContactDetails.length > 0){
        //   memberContactDetails.push(<Text key='supportPhoneNumberSeparator' style={styles.detailsSeparator}>{' • '}</Text>)
        // }
        supportPhoneNumber = DataUtils.formatPhoneNumber(settingsConfig.supportSettings.phoneNumber)
        memberContactDetails.push(<Text key='supportPhoneNumber' style={styles.phoneNumber}>{supportPhoneNumber}</Text>)
        showPhoneIcon = true
      }
      if(settingsConfig.supportSettings && settingsConfig.supportSettings.emailAddress){
        // if(memberContactDetails.length > 0){
        //   memberContactDetails.push(<Text key='supportEmailAddressSeparator' style={styles.detailsSeparator}>{' • '}</Text>)
        // }
        memberContactDetails.push(<Text key='supportEmailAddress' style={styles.emailAddress}>{settingsConfig.supportSettings.emailAddress}</Text>)
        showEmailIcon = true
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
          {showContactButtons === true ? (
            <View style={styles.iconContainer}>
              {showEmailIcon === true ? (
                <TouchableHighlight
                  underlayColor='white'
                  onPress={() => {
                    this.handlePress('email', settingsConfig.supportSettings.emailAddress)
                  }}
                >
                  <Icon
                    name='material|email'
                    size={30}
                    color={Colors.lightBlue}
                    style={styles.icon}
                  />
                </TouchableHighlight>
              ) : (
                <View>
                  <Icon
                    name='material|email'
                    size={30}
                    color={Colors.disabled}
                    style={styles.icon}
                  />
                </View>
              ) }
              {showPhoneIcon === true ? (
                <TouchableHighlight
                  underlayColor='white'
                  onPress={() => {
                    this.handlePress('call', supportPhoneNumber)
                  }}
                >
                  <Icon
                    name='material|phone'
                    size={30}
                    color={Colors.lightBlue}
                    style={styles.icon}
                  />
                </TouchableHighlight>
              ) : (
                <View>
                  <Icon
                    name='material|phone'
                    size={30}
                    color={Colors.disabled}
                    style={styles.icon}
                  />
                </View>
              ) }
            </View>
          ) : null}
        </View>
      </View>
    );

    currentTeamUsers.forEach((userId) => {
      if(teamsUsers.hasOwnProperty(userId)){
        const user = teamsUsers[userId]
        console.log(user)
        if(user.superUser === true && user.id !== userId)
          return
        let icon = AvatarUtils.getAvatar(user, 40)
        if (icon === null) {
          icon = <Icon name='material|account-circle' size={50} color='#aaa' style={styles.avatar}/>
        }
        let memberContactDetails = []
        let showPhoneIcon = false
        let showEmailIcon = false
        let userDisplayName = []
        if(user.firstName){
          userDisplayName.push(<Text style={[styles.text, styles.textBold]}>{user.firstName}</Text>)
        }
        if(user.lastName){
          userDisplayName.push(<Text style={styles.text}> {user.lastName}</Text>)
        }
        if(userDisplayName.length === 0){
          userDisplayName.push(<Text style={styles.pending}>Pending</Text>)
        }
        if(user.username){
          // if(memberContactDetails.length > 0){
          //   memberContactDetails.push(<Text key='phoneNumberSeparator' style={styles.detailsSeparator}>{' • '}</Text>)
          // }
          const userPhoneNumber = DataUtils.formatPhoneNumber(user.username)
          memberContactDetails.push(<Text key='phoneNumber' style={styles.phoneNumber}>{userPhoneNumber}</Text>)
          showPhoneIcon = true
        }
        if(user.email){
          // if(memberContactDetails.length > 0){
          //   memberContactDetails.push(<Text key='emailAddressSeparator' style={styles.detailsSeparator}>{' • '}</Text>)
          // }
          memberContactDetails.push(<Text key='emailAddress' style={styles.emailAddress}>{user.email}</Text>)
          showEmailIcon = true
        }
        teamMembers.push(
          <View key={userId} style={styles.row}>
            <View style={styles.member}>
              {icon}
              <View style={styles.memberInfoContainer}>
                <View style={styles.memberName}>
                  {userDisplayName}
                </View>
                <View style={styles.memberContactDetails}>
                  {memberContactDetails}
                </View>
              </View>
              <View style={styles.iconContainer}>
                {showEmailIcon === true ? (
                  <TouchableHighlight
                    underlayColor='white'
                    onPress={() => {
                      this.handlePress('email', user.email)
                    }}
                  >
                    <Icon
                      name='material|email'
                      size={30}
                      color={Colors.lightBlue}
                      style={styles.icon}
                    />
                  </TouchableHighlight>
                ) : (
                  <View>
                    <Icon
                      name='material|email'
                      size={30}
                      color={Colors.disabled}
                      style={styles.icon}
                    />
                  </View>
                ) }
                {showPhoneIcon === true ? (
                  <TouchableHighlight
                    underlayColor='white'
                    onPress={() => {
                      this.handlePress('call', user.username)
                    }}
                  >
                    <Icon
                      name='material|phone'
                      size={30}
                      color={Colors.lightBlue}
                      style={styles.icon}
                    />
                  </TouchableHighlight>
                ) : (
                  <View>
                    <Icon
                      name='material|phone'
                      size={30}
                      color={Colors.disabled}
                      style={styles.icon}
                    />
                  </View>
                ) }
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
  pending: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    color: Colors.lightGrey,
    fontStyle: 'italic',
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
    flex: 1,
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center',
  },
  memberInfoContainer: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    flex: 2,
  },
  memberName: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  memberContactDetails: {
    flexDirection: 'column',
  },
  phoneNumber: {
    fontFamily: 'OpenSans',
    fontSize: 10,
    color: Colors.lightGrey,
  },
  emailAddress: {
    fontFamily: 'OpenSans',
    fontSize: 10,
    color: Colors.lightGrey,
  },
  detailsSeparator: {
    fontFamily: 'OpenSans',
    fontSize: 10,
    color: Colors.separatorColor,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
  icon: {
    width: 50,
    height: 50,
  },
});

TeamMemberListing.propTypes = {
};

export default TeamMemberListing
