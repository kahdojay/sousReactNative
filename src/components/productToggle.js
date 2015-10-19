var React = require('react-native');
import CheckBox from 'react-native-checkbox'
import { Icon } from 'react-native-icons'
var {
  Modal,
  StyleSheet,
  SwitchIOS,
  Text,
  TouchableHighlight,
  View,
} = React;

// exports.displayName = (undefined: ?string);
// exports.framework = 'React';
// exports.title = '<Modal>';
// exports.description = 'Component for presenting modal views.';

var Button = React.createClass({
  getInitialState() {
    return {
      active: false,
    };
  },

  _onHighlight() {
    this.setState({active: true});
  },

  _onUnhighlight() {
    this.setState({active: false});
  },

  render() {
    var colorStyle = {
      color: this.state.active ? '#fff' : '#000',
    };
    return (
      <TouchableHighlight
        onHideUnderlay={this._onUnhighlight}
        onPress={this.props.onPress}
        onShowUnderlay={this._onHighlight}
        style={[styles.button, this.props.style]}
        underlayColor="#a9d9d4">
          <View>{this.props.children}</View>
      </TouchableHighlight>
    );
  }
});

var ModalExample = React.createClass({
  getInitialState() {
    return {
      animated: true,
      modalVisible: false,
      transparent: true,
    };
  },

  _setModalVisible(visible) {
    this.setState({modalVisible: visible});
  },

  render() {
    var modalBackgroundStyle = {
      backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : '#f5fcff',
    };
    var innerContainerTransparentStyle = this.state.transparent
      ? {backgroundColor: '#fff', padding: 20}
      : null;

    // if multiple purveyors, show the modal button
      // on purveyor select, toggle cart product, passing in purveyorId
    // if single purveyor, show the checkbox

    let checkbox =  <CheckBox
                      label=''
                      onChange={this.props.onToggleCartProduct}
                      checked={this.state.added}
                    />
    let purveyorSelectButton = <Button onPress={this._setModalVisible.bind(this, true)}>
                                  <Icon 
                                    name='fontawesome|ellipsis-h' 
                                    size={30} 
                                    color='black' 
                                    style={styles.icon}
                                  />
                                </Button>

    return (
      <View>
        <Modal
          animated={true}
          transparent={true}
          visible={this.state.modalVisible}>
          <View style={[styles.container, modalBackgroundStyle]}>
            <View style={[styles.innerContainer, innerContainerTransparentStyle]}>
              <Text>This modal was presented {this.state.animated ? 'with' : 'without'} animation.</Text>
              <Button
                onPress={this._setModalVisible.bind(this, false)}
                style={styles.modalButton}>
                <Text>Close</Text>
              </Button>
            </View>
          </View>
        </Modal>
        {this.props.purveyors.length > 1 ? purveyorSelectButton : checkbox}
        
        
      </View>
    );
  },
});

export default ModalExample

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  innerContainer: {
    borderRadius: 10,
  },
  row: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    marginBottom: 20,
  },
  rowTitle: {
    flex: 1,
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 5,
    flex: 1,
    height: 44,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  buttonText: {
    fontSize: 18,
    margin: 5,
    textAlign: 'center',
  },
  modalButton: {
    marginTop: 10,
  },
  icon: {
    width: 40,
    height: 40,
  },
});