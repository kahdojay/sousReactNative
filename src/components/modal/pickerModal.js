import React from 'react-native';
import GenericModal from './genericModal';
import _ from 'lodash';
import Colors from '../../utilities/colors';
import Sizes from '../../utilities/sizes';

const {
  Dimensions,
  ListView,
  PickerIOS,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

class PickerModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: this.props.modalVisible || false,
      selectedValue: this.props.selectedValue,
      items: this.props.items,
      pickerType: this.props.pickerType || 'PickerIOS',
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      modalVisible: nextProps.modalVisible,
      items: nextProps.items,
      selectedValue: nextProps.selectedValue,
      pickerType: nextProps.pickerType,
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

  getPickerListView() {
    const {items, selectedValue} = this.state;
    let updateValue = []
    if(_.isArray(selectedValue) === false){
      if(selectedValue !== null){
        updateValue = [selectedValue]
      } else {
        updateValue = []
      }
    } else {
      updateValue = [
        ...selectedValue
      ]
    }

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.key !== r2.key});
    let listViewHeightStyle = {
      height: 200,
    }
    if(items.length < 5){
      listViewHeightStyle = {
        height: ((200/3.75)*items.length),
      }
    }
    return (
      <ListView
        pageSize={5}
        dataSource={ds.cloneWithRows(items)}
        renderRow={(rowData) => {
          const selectIdx = updateValue.indexOf(rowData.value)
          const selected = (selectIdx !== -1)
          let selectedRowStyle = {}
          let selectedRowTextStyle = {}
          if(selected === true){
            selectedRowStyle = styles.listViewRowSelected
            selectedRowTextStyle = styles.listViewRowTextSelected
          }
          return (
            <TouchableHighlight
              onPress={() => {
                if(selected === false){
                  updateValue.push(rowData.value)
                } else {
                  updateValue = [
                    ...updateValue.slice(0, selectIdx),
                    ...updateValue.slice(selectIdx+1),
                  ]
                }
                this.handleValueChange(updateValue)
              }}
              underlayColor='transparent'
              style={styles.listViewRowContainer}
            >
              <View style={[styles.listViewRow, selectedRowStyle]}>
                <Text style={[styles.listViewRowText, selectedRowTextStyle]}>{rowData.label}</Text>
              </View>
            </TouchableHighlight>
          )
        }}
        style={[styles.listView, listViewHeightStyle]}
      />
    )
  }

  getPickerIOS() {
    const {items, selectedValue} = this.state;
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

    return (
      <PickerIOS
        selectedValue={selectedValue}
        onValueChange={::this.handleValueChange}
        style={styles.picker}
      >
        {pickerItems}
      </PickerIOS>
    )
  }

  render() {
    const {items, modalVisible} = this.state;
    if(items === null){
      return null
    }

    let picker = null
    switch(this.state.pickerType){
      case 'ListView':
        picker = this.getPickerListView();
        break;

      case 'PickerIOS':
      default:
        picker = this.getPickerIOS()
        break;
    }

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
          {picker}
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
  listView: {
    width: modalContainerWidth,
    height: 200,
    marginTop: -20,
  },
  listViewRowContainer: {
    marginBottom: 4,
  },
  listViewRow: {
    padding: 10,
    flexDirection: 'row',
  },
  listViewRowSelected: {
    backgroundColor: Colors.lightBlue,
  },
  listViewRowText: {
    color: Colors.darkGrey,
    fontFamily: 'OpenSans',
    fontSize: 14,
  },
  listViewRowTextSelected: {
    color: 'white'
  },
  picker: {
    width: 320,
    margin: -20,
  },
})

export default PickerModal
