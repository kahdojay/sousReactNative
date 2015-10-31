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

  componentDidMount() {
    this.handleVisibility(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.handleVisibility(nextProps)
  }

  handleVisibility(props) {
    if (props.errors.length > 0) {
      this.setState({
        errors: props.errors,
        modalVisible: true
      })
    } else if (props.errors.length === 0) {
      this.setState({
        errors: [],
        modalVisible: false
      })
    }
  }

  handleDismiss() {
    const errorIdList = _.pluck(this.state.errors, 'id')
    this.props.onDeleteError(errorIdList)
    this.setState({
      errors: [],
      modalVisible: false
    })
  }

  render() {
    let errorsArray = <View />
    if (this.state.errors.length > 0) {
      // console.log('errors: ', this.state.errors)
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
    let dismissButton =  (
      <TouchableHighlight
        style={styles.button}
        onPress={::this.handleDismiss}
        underlayColor={'#fff'}
      >
        <Text style={styles.buttonText}>Dismiss</Text>
      </TouchableHighlight>
    )

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
              {dismissButton}
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
  offlineHeader: {
    fontSize: 18,
    fontWeight: '800',
    alignSelf: 'center',
  },
  offlineText: {
    fontSize: 14,
    fontWeight: '500',
    alignSelf: 'center',
  }
});

var { height: deviceHeight } = Dimensions.get('window');

export default ErrorModal
