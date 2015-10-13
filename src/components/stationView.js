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
      // 'Rename Station',
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
      if (deleteAction === buttonIndex) {
        this.props.onDeleteStation(this.props.station.id);
        this.props.navigator.pop();
      }
    });
  }
  render() {
    let station = this.props.station
    let navBar = <View style={[
      NavigationBarStyles.navBarContainer,
      {backgroundColor: navbarColor}
    ]}>
      <View style={[
        NavigationBarStyles.navBar,
        {paddingVertical: 5}
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
            <Icon name='fontawesome|ellipsis-h' size={40} color='white' style={styles.iconMore}/>

          </View>
        </TouchableOpacity>
      </View>
    </View>
    if(this.props.ui.keyboard.visible === true){
      navBar = <View/>
    }

    return (
      <View style={styles.container}>
        <AddForm
          placeholder="Add a Task..."
          onSubmit={(taskName) => {
            this.props.onAddNewTask(station.id, taskName)
          }}/>
        <TaskList
          navigator={this.props.navigator}
          navBar={this.props.navBar}
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
    width: 45,
    height: 45,
    // marginTop: -10
  },
  iconMore: {
    width: 40,
    height: 40,
    // marginTop: -4
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
StationView.propTypes = {
};

export default StationView
