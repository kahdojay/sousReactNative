import { Icon } from 'react-native-icons';
import React from 'react-native';
import { mainBackgroundColor } from '../utilities/colors';

const {
  View,
  Text,
  TextInput,
  PropTypes,
  TouchableHighlight,
  StyleSheet,
} = React;

class ProfileView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: ''
    }
  }

  render() {
    return (
   		<View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.avatar}>
            <Text>avatar</Text>
          </View>
          <TextInput
            style={styles.nameInput}
            placeholder='Name'
            value={this.name}
            onChangeText={(name) => {
              this.setState({name})
            }}
          />
        </View>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mainBackgroundColor,
  },
  wrapper: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 200,
    height: 200,
    backgroundColor: 'yellow',
  },
  nameInput: {
    backgroundColor: 'white',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
})

ProfileView.propTypes = {
};

export default ProfileView