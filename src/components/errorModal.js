import React from 'react-native'
import _ from 'lodash'
import { Icon } from 'react-native-icons'

const {
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Dimensions,
  ScrollView,
} = React;

class ErrorModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      animated: true,
      modalVisible: false,
      transparent: true,
      errors: []
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log('cwrp args: ', arguments)
    if (nextProps.errors.length > 0) {
      this.setState({
        errors: nextProps.errors,
        modalVisible: true
      })
    }
  }

  handleDismiss(errorId) {
    const errorIdList = _.pluck(this.state.errors, 'id')
    this.props.onDeleteError(errorIdList)
    this.setState({ 
      errors: [],
      modalVisible: false
    })
  }

  render() {
    console.log('error modal')
    let errorsArray = <View />
    if (this.state.errors.length > 0) {
      console.log('errors: ', this.state.errors)
      errorsArray = this.state.errors
        .map((error, idx) => {
          return (
            <Text
              key={idx}
              style={styles.errorText}
            >
              {error.message}
            </Text>
          )
        })
    }
    return (
      <View>
        <Modal
          animated={true}
          transparent={true}
          visible={this.state.modalVisible}
        >
          <View style={styles.container}>
            <View style={styles.innerContainer}>
              <ScrollView style={styles.errorsContainer}>
                {errorsArray}
              </ScrollView>
              <TouchableHighlight 
                style={styles.button}
                onPress={::this.handleDismiss}
                underlayColor={'#fff'}
              >
                <Text style={styles.buttonText}>Dismiss</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center'
  },
  innerContainer: {
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 20,
  },
  errorsContainer: {
    height: 300,
    paddingBottom: 40,
  },
  modalHeader: {
    fontWeight: 'bold',
  },
  button: {
    marginTop: 10,
    paddingTop: 10,
    flex: 1,
    height: 44,
    alignSelf: 'center',
    // overflow: 'hidden',
  },
  buttonText: {
    // alignSelf: 'center',
    // alignSelf: 'center',
  },
  errorText: {
    marginTop: 10,
  },
  icon: {
    width: 40,
    height: 40,
  },
});

var { height: deviceHeight } = Dimensions.get('window');

export default ErrorModal
