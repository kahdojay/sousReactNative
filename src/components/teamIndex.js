import React from 'react-native';
import { Icon } from 'react-native-icons';
import ErrorModal from './errorModal';
import AddForm from './addForm';
import Colors from '../utilities/colors';
import TeamIndexRow from './teamIndexRow';

const {
  ActivityIndicatorIOS,
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableHighlight,
  PropTypes,
} = React;

class TeamIndex extends React.Component {

  render() {
    const {teams, messagesByTeams} = this.props

    return (
      <View style={styles.container}>
        <View style={styles.teamContainer}>
          <AddForm
            connected={this.props.connected}
            placeholder="Add a Team..."
            onSubmit={this.props.onAddTeam.bind(this)}
          />
          <View style={styles.separator} />
          <ScrollView
            style={styles.scrollView}
            keyboardShouldPersistTaps={false}
            contentInset={{bottom:49}}
            automaticallyAdjustContentInsets={false}
          >
            { teams.data.map((team, index) => {
              // let lastMessage = _.filter(this.props.messages.data.sort((a, b) => {return a.createdAt > b.createdAt}), (msg) => {return msg.teamId === team.id})[0] || "";
              // console.log(lastMessage);
              let teamMessages = {}
              if(messagesByTeams.hasOwnProperty(team.id) === true){
                teamMessages = messagesByTeams[team.id];
                // console.log(teamMessages)
              }
              if (team.deleted === false) {
                return (
                  <TeamIndexRow
                    key={index}
                    connected={this.props.connected}
                    selected={(this.props.currentTeam.id === team.id)}
                    team={team}
                    teamsUsers={teams.teamsUsers}
                    messages={teamMessages}
                    onPress={() => {
                      this.props.onUpdateTeam(team.id);
                    }}
                  />
                );
              }
              })
            }
          </ScrollView>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  teamContainer: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: Colors.mainBackgroundColor,
    marginTop: 0,
    paddingTop: 5
  },
  separator: {
    height: 0,
    borderBottomColor: Colors.separatorColor,
    borderBottomWidth: 1,
  },
});

TeamIndex.propTypes = {
  onAddTeam: PropTypes.func.isRequired,
};

module.exports = TeamIndex;
