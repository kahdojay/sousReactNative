import React from 'react-native';
import Colors from '../../utilities/colors';
import _ from 'lodash';
import s from 'underscore.string';
import PickerModal from '../modal/pickerModal';
import FieldRow from './fieldRow';

const {
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} = React;

class CategoryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedName: null,
    }
  }

  checkValidForm(){
    let selectedName = _.trim(this.state.selectedName.replace('\u00A0',' '))
    if (selectedName !== ''){
      const categoryAttributes = {
        name: selectedName,
      }
      this.props.onProcessCategory(categoryAttributes);
    } else {
      this.props.onCategoryNotReady();
    }
  }

  // Scroll a component into view. Just pass the component ref string.
  inputFocused(refName) {
    // console.log(this.refs)
    setTimeout(() => {
      let scrollResponder = this.refs.scrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        React.findNodeHandle(this.refs[refName]),
        100, //additionalOffset
        true
      );
    }, 20);
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          ref='scrollView'
          automaticallyAdjustContentInsets={false}
          style={styles.scrollView}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Category Details</Text>
          </View>
          <View style={styles.fieldRowContainer}>
            <View style={styles.formLabelContainer}>
              <Text style={styles.formLabelText}>Name</Text>
            </View>
            <FieldRow
              key='name'
              ref='name'
              label='Name'
              placeholder='Produce'
              value={this.state.selectedName}
              onChange={(e) => {
                this.setState({
                  selectedName: e.nativeEvent.text.replace(' ','\u00A0'),
                }, () => {
                  this.checkValidForm();
                });
              }}
              onFocus={this.inputFocused.bind(this, 'name')}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lighterGrey,
  },
  scrollView: {
    flex: 1,
    padding: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    borderColor: Colors.lightGrey,
    backgroundColor: Colors.lightBlue,
    alignItems: 'center',
    borderRadius: 2,
    padding: 10,
    marginBottom: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
  },
  iconDropDown: {
    width: 10,
    height: 10,
  },
  fieldRowContainer: {
    flexDirection: 'row',
  },
  formLabelContainer: {
    flex: 1,
    justifyContent: 'center',
    height: 45,
    marginRight: 10,
  },
  formLabelText: {
    fontWeight: 'bold',
  },
  inputContainer: {
    backgroundColor: 'white',
    flex: 3.5,
  },
  inputField: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    height: 45,
    marginLeft: 10,
  },
  separator: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: Colors.separatorColor,
  },
  inputSelectContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  selectField: {
    flex: 1,
    fontFamily: 'OpenSans',
    fontSize: 14,
    marginLeft: 10,
    paddingTop: 13,
    paddingBottom: 13,
  },
});

module.exports = CategoryForm;
