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

class StationView extends React.Component {
  constructor(props) {
    super(props)
  }
  showActionSheet(){
    let buttons = [
      'Delete Station',
      'Rename Station',
      'Cancel'
    ]
    let deleteAction = 0;
    let cancelAction = 2;
    ActionSheetIOS.showActionSheetWithOptions({
      options: buttons,
      cancelButtonIndex: cancelAction,
      destructiveButtonIndex: deleteAction,
    },
    (buttonIndex) => {
      if( deleteAction === buttonIndex ){
        // process the delete
        this.props.onDeleteStation(this.props.station.id);
        // pop the view
        this.props.navigator.pop();
      }
    });
  }
  render() {
    let station = this.props.station
    // console.log("STATION ID", station);

    let navBar = <View style={[
      NavigationBarStyles.navBarContainer,
      {backgroundColor: navbarColor}
    ]}>
      <View style={[
        NavigationBarStyles.navBar,
        {paddingVertical: 20}
      ]}>
        <BackBtn
          navigator={this.props.navigator}
          style={NavigationBarStyles.navBarText}
          />
        <Image source={require('image!Logo')} style={styles.logoImage}></Image>
        <TouchableOpacity
          onPress={this.showActionSheet.bind(this)}
          style={styles.iconMore}>
          <View
            style={[
              NavigationBarStyles.navBarRightButton,
              {marginVertical: 0}
            ]}>
            <Icon name='fontawesome|cog' size={45} color='white' style={styles.iconMore}/>

          </View>
        </TouchableOpacity>
      </View>
    </View>
    if(this.props.ui.keyboard.visible === true){
      navBar = <View/>
    }

    return (
      <View style={styles.container}>
        {navBar}
        <AddForm
          placeholder="Add a Task..."
          onSubmit={(taskName) => {

            this.props.onAddNewTask(station.id, taskName)
          }}/>
        <TaskList
          navigator={this.props.navigator}
          station={station}
          onTaskCompletionNotification={this.props.onTaskCompletionNotification}
          onUpdateStationTask={this.props.onUpdateStationTask}/>
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
    width: 70,
    height: 70,
    marginTop: -10
  },
  iconMore: {
    width: 60,
    height: 60,
    marginTop: -4
  }
});
StationView.propTypes = {
};

export default StationView
