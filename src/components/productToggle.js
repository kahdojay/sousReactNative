import React from 'react-native';
import _ from 'lodash';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import PickerModal from './modal/pickerModal';

const {
  StyleSheet,
  SwitchIOS,
  Text,
  TouchableHighlight,
  View,
} = React;

class TouchableWrapper extends React.Component {
  render() {
    const underlayColor = this.props.hasOwnProperty('underlayColor') === true ? this.props.underlayColor : 'transparent'
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        underlayColor={underlayColor}
      >
        <View
          style={[styles.button, this.props.style]}
        >
          {this.props.children}
        </View>
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

    let wrappedChildren = (
      <TouchableWrapper
        onPress={this._handlePurveyorSelect.bind(this, this.props.currentlySelectedPurveyorId)}
        underlayColor='transparent'
      >
        {this.props.children}
      </TouchableWrapper>
    )
    let modal = (
      <View />
    )

    if(this.props.added === false && this.props.availablePurveyors.length > 1){
      wrappedChildren = (
        <TouchableWrapper
          onPress={this._setModalVisible.bind(this, true)}
          underlayColor='transparent'
        >
          {this.props.children}
        </TouchableWrapper>
      )

      const purveyorsArray = this.props.availablePurveyors.map((purveyorId, idx) => {
        const purveyor = _.find(this.props.allPurveyors, { id: purveyorId });
        return purveyor
      })
      const purveyors = _.sortBy(purveyorsArray, 'name')
      const purveyorItems = _.map(purveyors, (purveyor, idx) => {
        return {
          key: purveyor.id,
          value: purveyor.id,
          label: purveyor.name,
        }
      })
      purveyorItems.unshift({
        key: '--null--',
        value: null,
        label: '',
      })

      modal = (
        <PickerModal
          modalVisible={this.state.modalVisible}
          headerText='Select Purveyor'
          leftButtonText='Update'
          items={purveyorItems}
          selectedValue={null}
          onHideModal={() => {
            this._setModalVisible(false)
          }}
          onSubmitValue={(value) => {
            if(value !== null && value.hasOwnProperty('selectedValue') === true){
              const selectedValue = value.selectedValue
              this._handlePurveyorSelect(selectedValue)
            } else {
              this._setModalVisible(false)
            }
          }}
        />
      )
    }

    return (
      <View>
        {modal}
        {wrappedChildren}
      </View>
    );
  }
};

var styles = StyleSheet.create({
  button: {
    flex: 1,
    borderRadius: Sizes.rowBorderRadius,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalInnerContainer: {
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center'
  },
  modalHeader: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButton: {
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 10,
    paddingRight: 10,
    borderTopColor: 'black',
    borderTopWidth: 1,
    width: 240,
  },
});

export default ProductToggle
