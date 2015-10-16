import React from 'react-native';
import { Icon } from 'react-native-icons';
import TaskList from '../components/taskList';
import { BackBtn } from '../utilities/navigation';
import { NavigationBarStyles } from '../utilities/styles';
import AddForm from './addForm';
import { mainBackgroundColor, navbarColor } from '../utilities/colors';

const {
  ActionSheetIOS,
  StyleSheet,
  View,
  PropTypes,
  TouchableHighlight,
  TouchableOpacity,
  Text,
  Image
} = React;

class TeamView extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let team = this.props.team
    if(this.props.ui.keyboard.visible === true){
      // navBar = <View/>
    }

    return (
      <View style={styles.container}>
        <AddForm
          placeholder="Add a Task..."
          onSubmit={this.props.onAddNewTask}
        />
        <TaskList
          navigator={this.props.navigator}
          navBar={this.props.navBar}
          team={team}
          onTaskCompletionNotification={this.props.onTaskCompletionNotification}
          onUpdateTeamTask={this.props.onUpdateTeamTask}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mainBackgroundColor,
  },
  logoImage: {
    width: 45,
    height: 45,
  },
  iconMore: {
    width: 40,
    height: 40,
  },
  scrollView: {
    backgroundColor: 'white',
    flex: 1,
    paddingLeft: 10,
    paddingRight: 0,
    marginTop: 0,
    paddingTop: 0
  },
});
TeamView.propTypes = {
};

export default TeamView
