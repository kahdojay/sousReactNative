import React from 'react-native';
import GenericModal from './genericModal';
import Colors from '../../utilities/colors';
import Sizes from '../../utilities/sizes';

const {
  Dimensions,
  PickerIOS,
  StyleSheet,
  View,
} = React;

class PickerModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: this.props.modalVisible || false,
      selectedValue: this.props.selectedValue,
      items: this.props.items,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      modalVisible: nextProps.modalVisible,
      items: nextProps.items,
      selectedValue: nextProps.selectedValue,
    })
  }

  handleSubmitValue(returnSelectedValue) {
    if(this.props.hasOwnProperty('onSubmitValue') === true){
      let returnValue = {
        selectedValue: this.state.selectedValue
      };
      if(returnSelectedValue === false){
        returnValue = false
      }
      this.props.onSubmitValue(returnValue);
    }
  }

  handleValueChange(selectedValue) {
    this.setState({
      selectedValue: selectedValue,
    }, () => {
      if(this.props.hasOwnProperty('onValueChange') === true){
        this.props.onValueChange({
          selectedValue: this.state.selectedValue,
        });
      }
    })

  }

  render() {
    const {items, selecteValue, modalVisible} = this.state;
    if(items === null){
      return null
    }

    let pickerItems = []

    items.forEach((item) => {
      pickerItems.push(
        <PickerIOS.Item
          key={item.key || item.value}
          value={item.value}
          label={item.label}
        />
      )
    })

    let leftButtonText = 'Submit'
    if(this.props.hasOwnProperty('leftButtonText') === true){
      leftButtonText = this.props.leftButtonText.replace('{{value}}', this.state.selectedValue || '')
    }

    return (
      <GenericModal
        ref='genericModal'
        modalVisible={this.props.modalVisible}
        onHideModal={this.props.onHideModal}
        modalHeaderText={this.props.headerText}
        leftButton={{
          text: leftButtonText,
          onPress: () => {
            this.handleSubmitValue()
          }
        }}
      >
        <View style={styles.pickerContainer}>
          <PickerIOS
            selectedValue={this.state.selectedValue}
            onValueChange={::this.handleValueChange}
            style={styles.picker}
          >
            {pickerItems}
          </PickerIOS>
        </View>
      </GenericModal>
    )
  }
}

const window = Dimensions.get('window');
const modalContainerWidth = (window.width - (Sizes.modalOuterMargin*2))

const styles = StyleSheet.create({
  pickerContainer: {
    overflow: 'hidden',
    alignSelf: 'center',
  },
  picker: {
    width: 320,
    margin: -20,
  },
})

export default PickerModal
