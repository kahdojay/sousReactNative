import React from 'react-native';
import _ from 'lodash';
import Sizes from '../utilities/sizes';
import GenericModal from './modal/genericModal';

const {
  StyleSheet,
  Text,
  View,
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
    } else if (props.errors.length === 0 && this.state.modalVisible === true) {
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
    return (
      <GenericModal
        ref='errorModal'
        modalVisible={this.state.modalVisible}
        onHideModal={::this.handleDismiss}
        leftButton={{
          text: 'Dismiss',
          onPress: this.handleDismiss.bind(this)
        }}
      >
        <ScrollView style={styles.errorsContainer}>
          {errorsArray}
        </ScrollView>
      </GenericModal>
    );
  }
};

var styles = StyleSheet.create({
  errorsContainer: {
    paddingBottom: 40,
  },
  errorText: {
    marginTop: 10,
  },
});

export default ErrorModal
