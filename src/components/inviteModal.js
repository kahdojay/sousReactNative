import React from 'react-native'
import _ from 'lodash'
import { Icon } from 'react-native-icons'
import KeyboardSpacer from 'react-native-keyboard-spacer';

const {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Dimensions,
  ScrollView,
} = React;

class InviteModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      animated: true,
      modalVisible: false,
      transparent: true,
      text: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      modalVisible: nextProps.modalVisible,
    })
  }

  handleDismiss() {
    this.props.toggleInviteModal(false)
  }
  handleSubmit() {
    if (this.state.text === null || this.state.text === '') {
      this.setState({text: ''});
      this.props.toggleInviteModal(false)
    } else {
      this.props.onSMSInvite([this.state.text]);
      this.setState({text: ''});
      this.props.toggleInviteModal(false)
    }
  }
  navigateToInviteView() {
    this.props.toggleInviteModal(false)
    this.props.navigator.push({
      name: 'InviteView',
    })
  }

  render() {
    return (
      <Modal
        animated={true}
        transparent={true}
        visible={this.state.modalVisible}
      >
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <Text style={styles.header}>Let Sous Access Contacts?</Text>
            <Text>We will help you find friends to choose from. We never contact anyone without your permission.</Text>
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              keyboardType='numeric'
              textAlign='center'
              onChangeText={(text) => this.setState({text})}
              value={this.state.text}
              />
            <View style={styles.row}>
              <TouchableHighlight
                onPress={() => this.handleDismiss()}
                style={styles.option}
                underlayColor='grey'
              >
                <Text style={styles.optionText}>No</Text>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => this.handleSubmit()}
                style={styles.option}
                underlayColor='grey'
              >
                <Text style={styles.optionText}>Submit</Text>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => this.navigateToInviteView()}
                style={styles.option}
                underlayColor='grey'
              >
                <Text style={styles.optionText}>Yes</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
        <KeyboardSpacer />
      </Modal>
    );
  }
};

var {
  height: deviceHeight,
  width: deviceWidth,
} = Dimensions.get('window');

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center'
  },
  innerContainer: {
    borderRadius: 5,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center'
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  option: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    height: 35,
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  }
});

export default InviteModal
