var { Icon, } = require('react-native-icons');
const React = require('react-native');

const {
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
} = React;

class BackBtn extends React.Component {
  render() {
    return (
      <TouchableHighlight
        style={styles.button}
        underlayColor="transparent"
        onPress={() => {
          if(this.props.callback){
            this.props.callback()
          }
          this.props.navigator.pop();
        }}>
        <Icon name='material|chevron-left' size={40} color='white' style={styles.iconBack} />
      </TouchableHighlight>
    );
  }
};

BackBtn.propTypes = {

};

const styles = StyleSheet.create({
  buttonText: {
    color: '#fff'
  },
  iconBack: {
    width: 45,
    height: 45,
    // marginTop: -15,
  }
});


module.exports = {
  BackBtn
};
