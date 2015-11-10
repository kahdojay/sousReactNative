import { Icon } from 'react-native-icons';
import React from 'react-native';
import ErrorModal from './errorModal';
import AddForm from './addForm';
import { mainBackgroundColor } from '../utilities/colors';
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
    // let fetching =  <ActivityIndicatorIOS
    //                     animating={true}
    //                     color={'#808080'}
    //                     size={'small'} />
    return (
      <View style={styles.container}>
        <View style={styles.teamContainer}>
          <AddForm
            placeholder="Add a Team..."
            onSubmit={this.props.onAddTeam.bind(this)}
          />
          <ScrollView
            style={styles.scrollView}
            keyboardShouldPersistTaps={false}
            contentInset={{bottom:49}}
            automaticallyAdjustContentInsets={false}
          >
            { this.props.teams.data.map((team, index) => {
              // let lastMessage = _.filter(this.props.messages.data.sort((a, b) => {return a.createdAt > b.createdAt}), (msg) => {return msg.teamId === team.id})[0] || "";
              // console.log(lastMessage);
              if (team.deleted === false) {
                return (
                  <TeamIndexRow
                    key={index}
                    team={team}
                    teamsUsers={this.props.teams.teamsUsers}
                    messages={this.props.messages}
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
    backgroundColor: '#f7f7f7',
    height: 500,
    paddingLeft: 20,
    paddingRight: 0,
    marginTop: 0,
    paddingTop: 0
  },
});

TeamIndex.propTypes = {
  onAddTeam: PropTypes.func.isRequired,
};

module.exports = TeamIndex;
