import React from 'react-native';
import Colors from '../../utilities/colors';
import Sizes from '../../utilities/sizes';
import KeyboardSpacer from 'react-native-keyboard-spacer';

const {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
  ScrollView,
} = React;

class GenericModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      animated: true,
      modalVisible: false,
      transparent: true,
      text: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      modalVisible: nextProps.modalVisible,
    })
  }

  getButton(buttonConfig) {
    if(buttonConfig.hasOwnProperty('disabled') === false){
      buttonConfig.disabled = false
    }
    let buttonTextColor = Colors.lightBlue
    if(buttonConfig.disabled === true){
      buttonTextColor = Colors.disabled
    }
    return (
      <TouchableHighlight
        onPress={() => {
          if(buttonConfig.disabled === false){
            buttonConfig.onPress()
          }
        }}
        style={styles.option}
        underlayColor='transparent'
      >
        <Text style={[styles.buttonText, { color: buttonTextColor }]}>{buttonConfig.text}</Text>
      </TouchableHighlight>
    )
  }

  render() {

    let modalHeader = null
    let leftButton = null
    let rightButton = null
    let buttonSeparator = null
    let modalSubHeader = null

    if(this.props.hasOwnProperty('modalSubHeaderText') === true){
      modalSubHeader = (
        <Text style={styles.modalSubHeaderText}>
          {this.props.modalSubHeaderText}
        </Text>
      )
    }

    if(this.props.hasOwnProperty('modalHeaderText') === true){
      modalHeader = (
        <View style={styles.modalHeader}>
          <Text style={styles.modalHeaderText}>
            {this.props.modalHeaderText}
          </Text>
          {modalSubHeader}
        </View>
      )
    }

    if(this.props.hasOwnProperty('modalHeader') === true){
      modalHeader = (
        <View style={styles.modalHeader}>
          {this.props.modalHeader}
        </View>
      )
    }

    if(this.props.hasOwnProperty('leftButton') === true){
      leftButton = this.getButton(this.props.leftButton)
    }
    if(this.props.hasOwnProperty('rightButton') === true){
      rightButton = this.getButton(this.props.rightButton)
      buttonSeparator = (
        <View style={styles.verticalSeparator} />
      )
    }

    return (
      <Modal
        animated={true}
        transparent={true}
        visible={this.state.modalVisible}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            this.props.onHideModal()
          }}
          style={styles.modalWrapper}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                // console.log('do nothing')
              }}
            >
              <View style={styles.modalInnerContainer}>
                {modalHeader}
                <View style={styles.messageContainer}>
                  {this.props.children}
                </View>
                <View style={styles.buttonRow}>
                  {leftButton}
                  {buttonSeparator}
                  {rightButton}
                </View>
              </View>
            </TouchableOpacity>
            <KeyboardSpacer />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
};

const window = Dimensions.get('window');
const modalContainerWidth = (window.width - (Sizes.modalOuterMargin*2))

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
  },
  modalInnerContainer: {
    borderRadius: Sizes.modalInnerBorderRadius,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  modalHeader: {
    width: modalContainerWidth,
    alignItems: 'center',
    padding: 15,
    borderBottomColor: Colors.separatorColor,
    borderBottomWidth: 1,
    borderTopLeftRadius: Sizes.modalInnerBorderRadius,
    borderTopRightRadius: Sizes.modalInnerBorderRadius,
  },
  modalHeaderText: {
    flex: 1,
    fontFamily: 'OpenSans',
    textAlign: 'center',
    fontSize: 20,
    color: Colors.darkGrey,
  },
  modalSubHeaderText: {
    flex: 1,
    fontFamily: 'OpenSans',
    textAlign: 'center',
    fontSize: 12,
    color: Colors.darkGrey,
  },
  messageContainer: {
    flex: 1,
    margin: 5,
    width: modalContainerWidth,
    padding: 10,
  },
  buttonRow: {
    width: modalContainerWidth,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: Colors.separatorColor,
    borderTopWidth: 1,
    borderBottomLeftRadius: Sizes.modalInnerBorderRadius,
    borderBottomRightRadius: Sizes.modalInnerBorderRadius,
  },
  option: {
    flex: 1,
  },
  buttonText: {
    flex: 1,
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center',
    color: Colors.lightBlue,
    flexWrap: 'nowrap',
  },
  separator: {
    height: 0,
    borderBottomColor: Colors.separatorColor,
    borderBottomWidth: 1,
  },
  verticalSeparator: {
    width: 1,
    backgroundColor: Colors.separatorColor,
    height: 40,
  },
});

export default GenericModal
