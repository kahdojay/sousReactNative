import React from 'react-native';
import GenericModal from './genericModal';
import _ from 'lodash';
import Colors from '../../utilities/colors';
import Sizes from '../../utilities/sizes';

const {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  PropTypes,
} = React;

class ConfirmationModal extends React.Component {
  render() {
    return (
      <GenericModal
        modalVisible={this.props.modalVisible}
        onHideModal={this.props.onHideModal}
        leftButton={{
          text: 'No',
          onPress: this.props.onConfirmNo
        }}
        rightButton={{
          text: 'Yes',
          onPress: this.props.onConfirmYes
        }}
      >
        <View>
          <Text style={[styles.centeredText, styles.boldText, styles.confirm]}>{this.props.confirmationHeader ? this.props.confirmationHeader : 'Confirm'}</Text>
          <Text style={[styles.centeredText, styles.text]}>{this.props.confirmationMessage}</Text>
        </View>
      </GenericModal>
    )
  }
}

ConfirmationModal.propTypes = {
  confirmationHeader: PropTypes.string,
  confirmationMessage: PropTypes.string.isRequired,
  modalVisible: PropTypes.bool.isRequired,
  onHideModal: PropTypes.func.isRequired,
  onConfirmNo: PropTypes.func.isRequired,
  onConfirmYes: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  centeredText: {
    textAlign: 'center',
  },
  boldText: {
    fontWeight: 'bold',
  },
  confirm: {
    fontFamily: 'OpenSans'
  },
  text: {
    margin: 15,
    fontSize: 12,
    fontFamily: 'OpenSans'
  }
})

export default ConfirmationModal
