import React from 'react-native'
import _ from 'lodash'
import { Icon } from 'react-native-icons'
import AddForm from './addForm'
import PurveyorIndexRow from './purveyorIndexRow';
import { navbarIconColor } from '../utilities/colors'

const {
  ActivityIndicatorIOS,
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableHighlight,
  PropTypes,
} = React;

class PurveyorIndex extends React.Component {
  render() {
    let self = this
    const { purveyors, products, session } = this.props

    let purveyorsList = _.map(_.sortBy(purveyors, 'name'), (purveyor) => {
        if (purveyor.deleted === false) {
          return (
            <PurveyorIndexRow
              key={purveyor.id}
              purveyor={purveyor}
              onPress={() => {
                this.props.onNavToPurveyor(purveyor)
              }}
            />
          )
        }
      },
      this // without this it breaks
    )

    return (
      <View style={styles.container}>
      {/*
        <AddForm
          placeholder="Add purveyor..."
          onSubmit={this.props.onAddPurveyor}
        />
        */}
        {/* * /}<TouchableHighlight
          underlayColor='#eee'
          onPress={this.props.onCreateProduct}
          style={styles.createButton}
        >
          <Text style={styles.createButtonText}>Create New Product...</Text>
        </TouchableHighlight>{/* */}
        <TouchableHighlight
          underlayColor='#eee'
          onPress={this.props.onNavigateToCategoryIndex}
          style={styles.createButton}
        >
          <Text style={styles.createButtonText}>Order by Category</Text>
        </TouchableHighlight>
        <View style={styles.separator} />
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
  createButton: {
  },
  createButtonText: {
    color: navbarIconColor,
    textAlign: 'center',
    padding: 5,
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
