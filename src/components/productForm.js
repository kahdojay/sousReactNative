import React from 'react-native';
import Dimensions from 'Dimensions';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';
import _ from 'lodash';

const {
  Modal,
  PickerIOS,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} = React;

class PickerFieldRow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>{this.props.field}</Text>
        <TouchableHighlight
          underlayColor='transparent'
          onPress={() => { this.props.onShowFieldPicker() }}
          style={styles.inputFieldContainer}
        >
          <Text style={styles.inputField}>
            Select {this.props.field}
          </Text>
        </TouchableHighlight>
      </View>
    )
  }
}

class ProductForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newProduct: {},
      fieldPicker: null,
      modalVisible: false,
      selectedName: '',
      selectedCategory: null,
      selectedPurveyor: null,
      selectedAmount: null,
      selectedUnits: null,
    }
  }

  showFieldPicker(field) {
    this.refs.name.blur()
    this.setState({
      modalVisible: true,
      fieldPicker: field,
    })
  }

  submitPicker() {
    this.setState({
      modalVisible: false,
      fieldPicker: null,
    })

    this.checkValidForm();
  }

  checkValidForm(){}

  // submit form?

  render() {
    let modal = (
      <Modal
        animated={true}
        transparent={true}
        visible={this.state.modalVisible}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalInnerContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>
                Select {this.state.fieldPicker}
              </Text>
            </View>
            <TouchableHighlight
              onPress={() => { this.submitPicker() }}
              underlayColor='transparent'
            >
              <Text style={styles.modalButtonText}>
                {`Update`}
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    )

    let fields = ['Purveyor', 'Category', 'Amount', 'Units'].map((field) => {
      return (
        <PickerFieldRow
          field={field}
          onShowFieldPicker={() => {
            this.showFieldPicker(field)
          }}
        />
      )
    })

    return (
      <View>
        <ScrollView
          automaticallyAdjustContentInsets={false}
          style={styles.scrollView}
        >
          <View key={'name'} style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Name</Text>
            <TextInput
              ref='name'
              style={[styles.inputField, {flex: 3}]}
              value={this.state.name}
              placeholder='Name'
              onChange={(e) => {
                this.setState({name: e.nativeEvent.text}, () => {
                  console.log('select name')
                  // this.checkValidForm();
                });
              }}
            />
          </View>
          {fields}
        </ScrollView>
        {modal}
      </View>
    );
  }
};

const window = Dimensions.get('window');

const styles = StyleSheet.create({
  scrollView: {
    // backgroundColor: 'blue',
    // backgroundColor: Colors.mainBackgroundColor,
    flex: 1,
  },
  inputContainer: {
    flex: 1,
    // marginTop: 2,
    // backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  inputTitle: {
    // // v- this with looks good on iPhone 6 plus and 4s
    // width: window.width * .54,
    flex: 1,
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
    fontSize: 14,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 8,
    color: Colors.greyText,
  },
  inputFieldContainer: {
    flex: 1,
  },
  inputField: {
    padding: 8,
    paddingTop: 10,
    paddingBottom: 10,
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'right',
  },
  pickerContainer: {
    paddingBottom: 20,
    marginBottom: 20,
  },
  picker: {
    width: 260,
    alignSelf: 'center',
    borderTopColor: Colors.separatorColor,
    borderTopWidth: 1,
    borderBottomColor: Colors.separatorColor,
    borderBottomWidth: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalInnerContainer: {
    alignItems: 'center',
    borderRadius: Sizes.modalInnerBorderRadius,
    backgroundColor: '#fff',
    padding: 20,
  },
  modalHeader: {
    width: 260,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  modalHeaderText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    color: Colors.lightBlue,
  },
  modalButtonText: {
    textAlign: 'center',
    color: Colors.lightBlue,
    paddingTop: 15,
  },
});

module.exports = ProductForm;
