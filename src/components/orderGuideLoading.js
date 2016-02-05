import React from 'react-native';
import Colors from '../utilities/colors';

const {
  ActivityIndicatorIOS,
  Dimensions,
  ProgressViewIOS,
  StyleSheet,
  View,
  Text,
} = React;

class OrderGuideLoading extends React.Component {
  render() {
    const {actualProducts, totalProducts} = this.props;
    const progress = Math.floor(((actualProducts/totalProducts)*100))
    return (
      <View style={styles.container}>
        <View style={styles.placementContainer} />
        <View style={styles.progressContainer}>
          <View style={styles.progressRow}>
            <ProgressViewIOS
              progressTintColor={Colors.lightBlue}
              style={styles.progressBar}
              progress={progress/100}
              trackTintColor={Colors.disabled}
            />
            <Text style={styles.progressText}>Loading products: {progress}%</Text>
          </View>
        </View>
        <View style={styles.placementContainer} />
      </View>
    )
  }
}

const window = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  placementContainer: {
    flex: 1,
  },
  progressContainer: {
    marginTop: -50,
  },
  progressRow: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  progressBar: {
    flex: 1,
    width: window.width * .85,
  },
  progressText: {
    fontFamily: 'OpenSans',
    fontSize: 15,
    color: Colors.lightGrey,
  },
  activity: {
    flex: 1,
    justifyContent: 'center',
  },
})

export default OrderGuideLoading
