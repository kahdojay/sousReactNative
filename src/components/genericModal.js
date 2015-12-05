import React from 'react-native';
import _ from 'lodash';
import { Icon } from 'react-native-icons';
import Colors from '../utilities/colors';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import AddressBook from 'react-native-addressbook';

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

class GenericModal extends React.Component {
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
    this.props.hideModal()
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
            <View style={styles.messageContainer}>{this.props.modalMessage}</View>
            <View style={styles.row}>
              <TouchableHighlight
                onPress={() => this.handleDismiss()}
                style={styles.option}
                underlayColor='transparent'
              >
                <Text style={styles.buttonText}>Ok</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
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
    alignItems: 'center'
  },
  messageContainer: {
    flex: 1,
    margin: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  option: {
    flex: 1,
    borderTopWidth: 1,
  },
  buttonText: {
    flex: 1,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center',
    color: Colors.blue,
    width: 264,
  },
});

export default GenericModal
