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

class InvoicesUploadRightButton extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let uploadButton = null
    if(this.props.uploadReady === true){
      uploadButton = (
        <TouchableHighlight
          underlayColor='white'
          onPress={this.props.onUploadInvoices}
        >
          <Text style={styles.navText}>Upload</Text>
        </TouchableHighlight>
      )
    }
    return (
      <View style={styles.container}>
        {uploadButton}
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  navText: {
    textAlign: 'center',
    marginTop: 12,
    marginRight: 12,
    color: Colors.lightBlue
  },
})

InvoicesUploadRightButton.propTypes = {
};

export default InvoicesUploadRightButton
