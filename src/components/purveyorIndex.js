import React from 'react-native'
import _ from 'lodash'
import { Icon } from 'react-native-icons'
import AddForm from './addForm'
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
        <TouchableHighlight
          underlayColor='#eee'
          onPress={this.props.onCreateProduct}
          style={styles.createButton}
        >
          <Text style={styles.createButtonText}>Create New Product</Text>
        </TouchableHighlight>
        <SegmentedControlIOS
          tintColor={Colors.lightBlue}
          style={styles.segmentedControl}
          values={this.props.segmentationList}
          selectedIndex={this.props.selectedSegmentationIndex}
          onChange={this.props.onSegmentationChange}
        />
        <ScrollView
          automaticallyAdjustContentInsets={false}
          keyboardShouldPersistTaps={false}
        >
          {purveyorsList}
        </ScrollView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  separator: {
    height: 5,
    borderBottomColor: '#bbb',
    borderBottomWidth: 1,
  },
  scrollView: {
    backgroundColor: '#f7f7f7',
    height: 500,
    paddingLeft: 20,
    paddingRight: 0,
    marginTop: 0,
    paddingTop: 0
  },
  segmentedControl: {
    fontWeight: 'bold',
    height: 36
  },
  createButton: {
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
