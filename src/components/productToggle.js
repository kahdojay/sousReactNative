import React from 'react-native';
import _ from 'lodash';
import { Icon } from 'react-native-icons';
import Colors from '../utilities/colors';

const {
  Modal,
  StyleSheet,
  SwitchIOS,
  Text,
  TouchableHighlight,
  View,
} = React;

class TouchableWrapper extends React.Component {
  render() {
    const underlayColor = this.props.hasOwnProperty('underlayColor') === true ? this.props.underlayColor : '#eee'
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        style={[styles.button, this.props.style]}
        underlayColor={underlayColor}
      >
        <View>
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


    if(this.props.availablePurveyors.length > 1){
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
        const purveyorName = purveyor ? purveyor.name : '';
        let selectedIcon = (
          <View />
        )
        // console.log(this.props.currentlySelectedPurveyorId, purveyorId)
        if(this.props.added === true && purveyorId === this.props.currentlySelectedPurveyorId){
          selectedIcon = (
            <Icon name='fontawesome|check' size={14} color={Colors.green} style={styles.icon}/>
          )
        }
        return (
          <TouchableWrapper
            key={idx}
            style={styles.modalButton}
            onPress={this._handlePurveyorSelect.bind(this, purveyorId)}
          >
            <View style={{flexDirection: 'row'}}>
              {selectedIcon}
              <Text>{purveyorName}</Text>
            </View>
          </TouchableWrapper>
        )
      })

      modal = (
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
    marginBottom: 10,
  },
  button: {
    flex: 1,
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
  icon: {
    width: 16,
    height: 16,
    marginRight: 5
  },
});

export default ProductToggle
