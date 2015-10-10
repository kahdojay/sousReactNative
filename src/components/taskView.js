import React from 'react-native';
import { Icon } from 'react-native-icons';
import { BackBtn } from '../utilities/navigation';
import { NavigationBarStyles } from '../utilities/styles';
const {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  NativeModules,
  Image,
  TouchableOpacity,
  TouchableHighlight,
} = React;

const {
  UIManager
} = NativeModules;

class TaskView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      textInputDescription: this.props.task.description,
      textInputName: this.props.task.name,
      saved: true,
    }
  }

  scrollToBottom() {
    // if(this.refs.hasOwnProperty('scrollview')){
    //   UIManager.measure(this.refs.scrollview, (x, y, width, height, left, top) => {
    //     console.log(height);
    //     // this.refs.scrollview.scrollTo(999999)
    //   });
    // }
  }
  scrollToTop() {
    if(this.refs.hasOwnProperty('scrollview')){
      this.refs.scrollview.scrollTo(0)
    }
  }

  saveTask() {
    if(this.state.saved === false){
      let {stationId, task} = this.props;
      let newTask = this.props.task;
      newTask.description = this.state.textInputDescription;
      newTask.name = this.state.textInputName
      this.props.onUpdateStationTask(stationId, task.recipeId, newTask);
      this.setState({saved: true});
    }
  }
  deleteTask() {
    let {stationId, task} = this.props;
    let newTask = this.props.task
    newTask.deleted = true
    this.props.onUpdateStationTask(stationId, task.recipeId, newTask)
    this.props.navigator.pop()
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.task.deleted === true){
      this.props.navigator.pop()
    } else {
      this.setState({
        textInputDescription: nextProps.task.description,
        textInputName: nextProps.task.name,
        saved: true,
      });
    }
    if(nextProps.ui.keyboard.visible === true){
      this.scrollToBottom();
    } else {
      this.scrollToTop();
    }
  }

  render() {
    let navBar = <View style={styles.navbar}>
      <View style={[
        NavigationBarStyles.navBar,
        {paddingVertical: 20}
      ]}>
        <BackBtn
          style={styles.backButton}
          callback={this.saveTask.bind(this)}
          navigator={this.props.navigator}
        />
        <Image source={require('image!Logo')} style={styles.logoImage}></Image>
        <View style={NavigationBarStyles.navBarRightButton}></View>
      </View>
    </View>

    if(this.props.ui.keyboard.visible === true){
      navBar = <View/>
    }
    return (
      <View style={styles.container}>
        {navBar}
        <ScrollView
          scrollEventThrottle={200}
          ref='scrollview'
        >
          <View style={styles.headerContainer}>
            <Icon
              name='material|assignment'
              size={100}
              color='#aaa'
              style={styles.iconMain}
            />
            <View style={styles.iconContainer}>
              <View style={styles.iconSideContainer}>
                <Text style={styles.sideText}>Timer</Text>
                <Icon name='material|alarm' size={50} color='#aaa' style={styles.iconSide}/>
              </View>
              <View style={styles.iconSideContainer}>
                <Text style={styles.sideText}>Scale</Text>
                <Icon name='fontawesome|check-square' size={50} color='#aaa' style={styles.iconSide}/>
              </View>
            </View>
          </View>

          <View style={styles.mainContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder={'Title'}
              value={this.state.textInputName}
              onChangeText={(text) => this.setState({textInputName: text, saved: false})}
              onEndEditing={() => this.saveTask()}
            />
            <TextInput
              style={styles.searchInput}
              multiline={true}
              placeholder={'Description'}
              value={this.state.textInputDescription}
              onChangeText={(text) => this.setState({textInputDescription: text, saved: false})}
              onEndEditing={() => this.saveTask()}
            />
            {this.state.saved === false ? <TouchableHighlight
              style={[styles.button, {backgroundColor: '#423'}]}
              onPress={() => this.saveTask()} >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableHighlight> : <View />}
            <TouchableHighlight
              style={styles.button}
              onPress={() => this.deleteTask()} >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableHighlight>
          </View>
        </ScrollView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    height: 80,
    backgroundColor: '#1E00B1',
    alignItems: 'stretch'
  },
  button: {
    height: 56,
    backgroundColor: '#F5A623',
    alignSelf: 'center',
    width: 150,
    marginTop: 30,
    justifyContent: 'center',
    borderRadius: 3,
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'OpenSans'
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f7f7f7'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  input: {
    height: 40,
    borderColor: 'blue',
    borderWidth: 1,
    color: 'black',
    marginTop: 20
  },
  iconMain: {
    height: 100,
    width: 100,
    flex: 1
  },
  sideText: {
    fontSize: 20,
    fontFamily: 'OpenSans',
    flex: 1,
    marginTop: 10
  },
  searchInput: {
    height: 50,
    padding: 4,
    marginRight: 5,
    fontSize: 23,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 8,
    backgroundColor: 'white',
    color: 'black'
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  iconSideContainer: {
    marginBottom: 10,
    marginTop: 10,
    flexDirection: 'row',
  },
  iconSide: {
    height: 50,
    width: 50,
    flex: 1
  },
  backButton: {
    height: 40,
    borderColor: 'blue',
    borderWidth: 1,
    flex: 1
  },
  logoImage: {
    width: 70,
    height: 70,
    marginTop: -10,
  },
});


module.exports = TaskView;
