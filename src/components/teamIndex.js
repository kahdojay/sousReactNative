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
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if(this.props.connected !== nextProps.connected){
  //     return true;
  //   }
  //   if(this.state.loaded !== nextState.loaded){
  //     return true;
  //   }
  //   console.log(this.props.teams.data.length, nextProps.teams.data.length)
  //   if(this.props.teams.data.length !== nextProps.teams.data.length){
  //     return true;
  //   }
  //   return false;
  // }

  componentDidMount() {
    this.setState({
      loaded: true
    })
  }

  render() {
    const {teams, messagesByTeams} = this.props
    const teamsCount = teams.data.length
    let teamData = _.sortBy(teams.data, 'updatedAt').reverse()
    return (
      <View style={styles.container}>
        <View style={styles.teamContainer}>
          <AddForm
            connected={this.props.connected}
            placeholder="Add a Team"
            onSubmit={this.props.onAddTeam.bind(this)}
          />
          <View style={styles.separator} />
          <ScrollView
            style={styles.scrollView}
            keyboardShouldPersistTaps={false}
            contentInset={{bottom:49}}
            automaticallyAdjustContentInsets={false}
          >
            { teamData.map((team, index) => {
              // console.log(team.updatedAt)
              // let lastMessage = _.filter(this.props.messages.data.sort((a, b) => {return a.createdAt > b.createdAt}), (msg) => {return msg.teamId === team.id})[0] || "";
              // console.log(lastMessage);
              let teamMessages = {}
              if(messagesByTeams.hasOwnProperty(team.id) === true){
                teamMessages = messagesByTeams[team.id];
                // console.log(teamMessages)
              }
              if (team.deleted === false) {
                return (
                  <View>
                    <TeamIndexRow
                      key={index}
                      connected={this.props.connected}
                      selected={(this.props.currentTeam !== null && this.props.currentTeam.id === team.id)}
                      team={team}
                      teamsCount={teamsCount}
                      teamsUsers={teams.teamsUsers}
                      messages={teamMessages}
                      onPress={() => {
                        this.props.onUpdateTeam(team.id);
                      }}
                      onLeaveTeam={this.props.onLeaveTeam}
                      onShowLeaveError={this.props.onShowLeaveError}
                    />
                    <View style={styles.separator} />
                  </View>
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
