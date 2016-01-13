import React from 'react-native';
import _ from 'lodash';
import AddForm from './addForm';
import PurveyorIndexRow from './purveyorIndexRow';
import Colors from '../utilities/colors';

const {
  ActivityIndicatorIOS,
  Image,
  PropTypes,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  SegmentedControlIOS,
  View,
} = React;

class PurveyorIndex extends React.Component {
  render() {
    const { purveyors, products, session } = this.props

    let purveyorsList = _.map(_.sortBy(purveyors, 'name'), (purveyor) => {
        if (purveyor.deleted === false) {
          return (
            <PurveyorIndexRow
              key={purveyor.id}
              purveyor={purveyor}
              onPress={() => {
                this.props.onNavToPurveyor(purveyor.id)
              }}
            />
          )
        }
      },
      this // without this it breaks
    )

    return (
      <View style={styles.container}>
        <View style={styles.segmentedControlContainer}>
          <SegmentedControlIOS
            tintColor={Colors.lightBlue}
            style={styles.segmentedControl}
            values={this.props.segmentationList}
            selectedIndex={this.props.selectedSegmentationIndex}
            onChange={this.props.onSegmentationChange}
          />
        </View>
        <ScrollView
          automaticallyAdjustContentInsets={false}
          keyboardShouldPersistTaps={false}
          style={styles.purveyorsContainer}
        >
          {purveyorsList}
        </ScrollView>
        <TouchableHighlight
          underlayColor='#eee'
          onPress={this.props.onCreateProduct}
          style={styles.createButton}
        >
          <Text style={styles.createButtonText}>Create New Product</Text>
        </TouchableHighlight>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBackgroundColor,
  },
  purveyorsContainer: {
    paddingVertical: 5,
  },
  segmentedControlContainer: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 5,
    paddingLeft: 5,
    borderBottomColor: Colors.separatorColor,
    borderBottomWidth: 1,
  },
  segmentedControl: {
    fontWeight: 'bold',
    height: 36,
    fontFamily: 'OpenSans',
  },
  createButton: {
    borderTopColor: Colors.separatorColor,
    borderTopWidth: 1,
    backgroundColor: 'white',
  },
  createButtonText: {
    color: Colors.lightBlue,
    textAlign: 'center',
    padding: 10,
    fontFamily: 'OpenSans',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

PurveyorIndex.propTypes = {
  onAddPurveyor: React.PropTypes.func,
  purveyors: React.PropTypes.object,
};

module.exports = PurveyorIndex;
