import React from 'react-native';
import { Icon } from 'react-native-icons';
import Colors from '../utilities/colors';

const {
  View,
  Text,
  TouchableHighlight,
  PropTypes,
  StyleSheet,
} = React;

class PurveyorFormRightCheckbox extends React.Component {
  constructor(props) {
    console.log('PFRC')
    super(props)
    this.state = {
      iconFont: this.props.iconFont || 'material|check',
    }
  }

  render() {
    return (
      <TouchableHighlight
        underlayColor='transparent'
        style={{justifyContent: 'center',}}
        onPress={()=> {
          if (this.props.submitReady) {
            this.props.onProcessPurveyor();
          } else {
            // trigger error: Please fill out all the fields below
          }
        }}
      >
        <Icon
          name='material|square-o'
          size={40}
          color={this.props.submitReady ? Colors.green : '#ccc'}
          style={styles.iconOutline}
        >
          <Icon
            color={this.props.submitReady ? Colors.green : '#ccc'}
            name={this.state.iconFont}
            size={25}
            style={styles.icon}
          />
        </Icon>
      </TouchableHighlight>
    );
  }
}

let styles = StyleSheet.create({
  iconOutline: {
    flexDirection: 'column',
    width: 50,
    height: 50,
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    flex: 1,
    width: 15,
    height: 15,
  },
})

export default PurveyorFormRightCheckbox;
