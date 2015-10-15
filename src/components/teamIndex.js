import { Icon } from 'react-native-icons';
import React from 'react-native';
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
              if (team.deleted === false) {
                return (
                  <TeamIndexRow
                    key={index}
                    team={team}
                    onPress={() => this.props.navigator.push({
                      name: 'TeamView',
                      teamId: team.id,
                      navigationBar: this.props.navBar,
                    })}
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
