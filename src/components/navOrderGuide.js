import React from 'react-native'
import Colors from '../utilities/colors'

const {
  Image,
  PropTypes,
  SegmentedControlIOS,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

class NavOrderGuide extends React.Component {
  render() {
    return (
      <View>
        <Text style={styles.headerText}>
          Order Guide
        </Text>
        <SegmentedControlIOS
          tintColor={Colors.lightBlue}
          style={styles.segmentedControl}
          values={['Category', 'Purveyor']}
          selectedIndex={this.props.selectedIndex}
          onChange={() => {
            this.props.onChange()
          }}
        />
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    paddingTop: 0,
  },
  headerText: {
    alignSelf: 'center',
    fontWeight: 'bold',
    marginBottom: 2
  },
  segmentedControl: {
    fontWeight: 'bold',
    width: 180,
    height: 32,
    marginBottom: 5
  }
});

NavOrderGuide.propTypes = {
};

export default NavOrderGuide
