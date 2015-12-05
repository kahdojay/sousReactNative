import { Icon } from 'react-native-icons';
import React from 'react-native';
import { BackBtn } from '../utilities/navigation';
import { NavigationBarStyles } from '../utilities/styles';
import Colors from '../utilities/colors';
import { mainBackgroundColor, navbarColor } from '../utilities/colors';
let {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity
} = React;


class UserTeam extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      teamName: '',
    }
  }

  componentWillMount(nextProps) {
    this.setState({
      teamName: `${this.props.session.firstName}'s Team`
    })
  }

  render(){
    const {session} = this.props;
    return (
      <ScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps={false}
        automaticallyAdjustContentInsets={false}
      >
        <View style={styles.headerContainer}>
          <View style={styles.infoField}>
            <Text style={styles.title}>
              Awesome! Looks like you don't have a team yet.
            </Text>
          </View>
        </View>

        <View style={styles.teamProfile}>
          <View style={styles.headerContainer}>
            <Text style={styles.question}>What is your first <Text style={[styles.question, styles.bold]}>team's name?</Text></Text>
          </View>
        </View>

        <View style={styles.teamProfile}>
          <View style={styles.infoField}>
            <TextInput
              style={styles.input}
              value={this.state.teamName}
              onChange={(e) => this.setState({teamName: e.nativeEvent.text})}
              placeholder={"Team Name"}/>
          </View>
          <View style={styles.separator}></View>
        </View>

        <View style={styles.deactivateContainer}>
          <TouchableOpacity
            onPress={() => {
              let {teamName} = this.state;
              if (teamName != '') {
                this.props.onCreateTeam(teamName);
              } else {
                // TODO: Show error
              }
            }}
            style={styles.deactivateButton}>
            <Text style={styles.deactivateText}>Create</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchForTeamContainer}>
          <TouchableOpacity
            onPress={() => {
              this.props.onSearchForTeam();
            }}
            style={styles.searchForTeamButton}
          >
            <View style={styles.searchForTeamTextContainer}>
              <Text style={styles.searchForTeamText}>Searching for an existing team?</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }
}
let styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
    flex: 1,
  },
  teamInfoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  separator: {
    height: 1,
    borderColor: '#eee',
    borderWidth: 1,
  },
  headerContainer: {

  },
  teamProfile: {
    flex: 1,
    backgroundColor: 'white',
    margin: 10,
  },
  teamPreferences: {
    flex: 2,
    margin: 10,
    marginTop: 0,
    backgroundColor: 'white',
  },
  infoField: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#fff',
    height: 45,
    paddingLeft: 5,
    paddingTop: 15,
    flexDirection: 'row',
  },
  title: {
    flex: 1,
    marginLeft: 5,
    color: 'black',
    fontWeight: 'normal',
    fontFamily: 'OpenSans',
    fontSize: 13,
    letterSpacing: -.5,
  },
  question: {
    flex: 1,
    color: 'black',
    fontFamily: 'OpenSans',
    fontSize: 18,
    letterSpacing: -.5,
  },
  bold: {
    fontWeight: 'bold',
  },
  inputName: {
    flex: 1,
    color: '#bbb',
    fontWeight: 'bold',
    fontFamily: 'OpenSans',
    fontSize: 14,
    letterSpacing: -.5,
  },
  inputInfo: {
    flex: 1,
    fontFamily: 'OpenSans',
    fontSize: 14,
    paddingBottom: 5,
    marginBottom: 5,
  },
  deactivateContainer: {
    marginTop: 5,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  deactivateButton: {
    backgroundColor: '#ddd',
    padding: 10,
    width: 100,
    borderRadius: 7,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    padding: 4,
    marginRight: 5,
    marginBottom: 5,
    fontSize: 14,
    borderRadius: 8,
    color: '#333',
    fontWeight: 'bold',
    fontFamily: 'OpenSans'
  },
  deactivateText:{
    fontSize: 16,
    fontWeight: 'bold',
    color: '#777',
    textAlign: 'center',
  },
  searchForTeamContainer: {
    marginTop: 10,
    alignItems: 'center'
  },
  searchForTeamButton: {
    padding: 10,
  },
  searchForTeamTextContainer: {
    borderBottomWidth: 1,
    borderColor: Colors.blue,
  },
  searchForTeamText: {
    fontSize: 16,
    color: Colors.blue,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackgroundColor,
    alignItems: 'stretch',
  },
  navbar: {
    height: 70,
    backgroundColor: '#1E00B1',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navbarText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold'
  },
  sideNavbarText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  icon: {
    height: 30,
    width: 30,
    flex: 1,
  },
  logo: {
    flex: 2.5,
    alignItems: 'flex-end',
    marginRight: 10
  },
  navbarPush: {
    flex: 2,
    alignItems: 'center'
  },
  teamIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    margin: 4,
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  phoneNumber: {
    backgroundColor: '#1E00B1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    padding: 5,
  },
  avatar: {
    backgroundColor: '#f2f2f2',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameInput: {
    backgroundColor: 'white',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
})



export default UserTeam;
