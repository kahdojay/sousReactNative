import React from 'react-native';
import _ from 'lodash';
import { Icon } from 'react-native-icons';
import { NavigationBarStyles } from '../utilities/styles';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';

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
      numberOflines: this.countLines(this.props.task.description)
    }
  }

  scrollToBottom() {
    // TODO: automatically scroll to bottom on TextInput focus (alternatively,
    // define method to calculate y-position of TextInput and scroll to there)
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
      let {task} = this.props;
      let newTask = this.props.task;
      newTask.description = this.state.textInputDescription;
      newTask.name = this.state.textInputName
      this.props.onUpdateTeamTask(task.recipeId, newTask);
      this.setState({saved: true});
    }
  }
  deleteTask() {
    let {task} = this.props;
    let newTask = this.props.task
    newTask.deleted = true
    this.props.onUpdateTeamTask(task.recipeId, newTask)
    this.props.onDeleteTaskPop()
  }
  countLines(text) {
    var descriptionSplit = _.groupBy(text.split(''))
    return descriptionSplit['\n'] ? descriptionSplit['\n'].length + 1 : 1
  }
  changeInputDescription(text) {
    this.setState({
      textInputDescription: text,
      saved: false,
      numberOflines: this.countLines(text),
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          scrollEventThrottle={200}
          ref='scrollview'
          keyboardShouldPersistTaps={false}
          style={styles.scrollView}
          automaticallyAdjustContentInsets={false}
        >
          {/*<View style={styles.headerContainer}>
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
          </View>*/}

          <View style={styles.mainContainer}>
            <TextInput
              style={styles.inputTitle}
              placeholder={'Title'}
              value={this.state.textInputName}
              onChangeText={(text) => this.setState({textInputName: text, saved: false})}
              onEndEditing={() => this.saveTask()}
            />
            <TextInput
              style={[
                styles.inputDescription,
                this.state.numberOflines > 7 && {height: this.state.numberOflines * 23}
              ]}
              multiline={true}
              placeholder={'Description'}
              value={this.state.textInputDescription}
              onChangeText={(text) => this.changeInputDescription(text)}
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
  button: {
    height: 56,
    backgroundColor: Colors.gold,
    alignSelf: 'center',
    width: 150,
    marginTop: 5,
    justifyContent: 'center',
    borderRadius: 3,
  },
  scrollView: {
    backgroundColor: 'transparent',
    flex: 1,
    paddingLeft: 10,
    paddingRight: 0,
    marginTop: 0,
    paddingTop: 0
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
    backgroundColor: Colors.mainBackgroundColor
  },
  scrollWrapper: {
    flex: 1,
    justifyContent: 'space-between'
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.mainBackgroundColor
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.mainBackgroundColor
  },
  input: {
    height: 40,
    borderColor: 'blue',
    borderWidth: 1,
    color: 'black',
  },
  iconMain: {
    height: 100,
    width: 100,
    flex: 1
  },
  inputTitle: {
    height: 40,
    padding: 5,
    fontSize: 26,
    fontWeight: '100',
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: Sizes.inputBorderRadius,
    backgroundColor: 'white',
    color: 'black',
    marginRight: 10,
    marginTop: 10,
  },
  inputDescription: {
    height: 180,
    padding: 4,
    fontSize: 20,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius:  Sizes.descriptionBorderRadius,
    backgroundColor: 'white',
    color: 'black',
    marginRight: 10,
    marginTop: 5,
  },
  sideText: {
    fontSize: 20,
    marginTop: 10,
    fontFamily: 'OpenSans',
    flex: 1,
    fontWeight: 'bold',
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  iconSideContainer: {
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
    width: 45,
    height: 45,
  },
});

module.exports = TaskView;
