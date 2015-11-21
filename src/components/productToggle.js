import React from 'react-native'
import _ from 'lodash'
import CheckBox from './checkbox'
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
        underlayColor="#eee"
      >
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
    const checkbox = (
      <CheckBox
        label=''
        onChange={this._handlePurveyorSelect.bind(this, this.props.currentlySelectedPurveyorId)}
        checked={this.props.added}
      />
    );

    const modalShowButton = (
      <ModalToggle onPress={this._setModalVisible.bind(this, true)} >
        <Icon
          name='fontawesome|ellipsis-h'
          size={30}
          color='black'
          style={styles.icon}
        />
      </ModalToggle>
    );

    const purveyorsArray = this.props.availablePurveyors.map((purveyorId, idx) => {
      const purveyor = _.find(this.props.allPurveyors, { id: purveyorId });
      const purveyorName = purveyor ? purveyor.name : '';
      return (
        <ModalToggle
          key={idx}
          style={styles.modalButton}
          onPress={this._handlePurveyorSelect.bind(this, purveyorId)}
        >
          <Text>{purveyorName}</Text>
        </ModalToggle>
      )
    })

    return (
      <View>
        <Modal
          animated={true}
          transparent={true}
          visible={this.state.modalVisible}
        >
          <TouchableHighlight
            onPress={() => this._setModalVisible(false)}
            style={styles.container}
            underlayColor="rgba(0, 0, 0, 0.5)"
          >
            <View style={styles.innerContainer}>
              <Text style={styles.modalHeader}>Select Purveyor</Text>
              {purveyorsArray}
            </View>
          </TouchableHighlight>
        </Modal>
        {
          this.props.added === false &&
          this.props.availablePurveyors.length > 1 ? modalShowButton : checkbox
        }
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
    flex: 1,
    height: 44,
    width: 190,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  modalButton: {
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 10,
    borderTopColor: 'black',
    borderTopWidth: 1,
  },
  icon: {
    width: 40,
    height: 40,
  },
});

export default ProductToggle
