import React from 'react-native'
import CheckBox from 'react-native-checkbox'
import { Icon } from 'react-native-icons'

const {
  Modal,
  StyleSheet,
  SwitchIOS,
  Text,
  TouchableHighlight,
  View,
} = React;

class ModalToggle extends React.Component {
  render() {
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        style={[styles.button, this.props.style]}
        underlayColor="#eee">
          <View>{this.props.children}</View>
      </TouchableHighlight>
    );
  }
}

class ProductToggle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      animated: true,
      modalVisible: false,
      transparent: true,
    };
  }

  _setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  _handlePurveyorSelect(purveyorId) {
    this._setModalVisible(false)
    this.props.onToggleCartProduct(purveyorId)
  }

  render() {
    let checkbox =  <CheckBox
                      label=''
                      onChange={this._handlePurveyorSelect.bind(this, this.props.currentlySelectedPurveyorId)}
                      checked={this.props.added}
                    />

    let modalShowButton = <ModalToggle
                            onPress={this._setModalVisible.bind(this, true)}>
                              <Icon
                                name='fontawesome|ellipsis-h'
                                size={30}
                                color='black'
                                style={styles.icon}
                              />
                          </ModalToggle>

    let purveyorsArray = this.props.purveyors.map(function(purveyorId, idx) {
                            return (
                              <ModalToggle
                                key={idx}
                                style={styles.modalButton}
                                onPress={this._handlePurveyorSelect.bind(this, purveyorId)}
                              >
                                <Text>{purveyorId}</Text>
                              </ModalToggle>
                            )
                          }.bind(this))
    return (
      <View>
        <Modal
          animated={true}
          transparent={true}
          visible={this.state.modalVisible}>
          <View style={styles.container}>
            <View style={styles.innerContainer}>
              <Text style={styles.modalHeader}>Select Purveyor</Text>
              {purveyorsArray}
            </View>
          </View>
        </Modal>
        {this.props.added === false && this.props.purveyors.length > 1 ? modalShowButton : checkbox}
      </View>
    );
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  innerContainer: {
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center'
  },
  modalHeader: {
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 5,
    flex: 1,
    height: 44,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  modalButton: {
    marginTop: 10,
  },
  icon: {
    width: 40,
    height: 40,
  },
});

export default ProductToggle
