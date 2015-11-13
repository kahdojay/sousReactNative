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

    let purveyorsList = _.map(_.filter(purveyors.data, (purveyor) => {
        //TODO add teamId s to purveyors and filter
        // return purveyor.teamId === session.teamId
        return true;
      }),
      function(purveyor, idx) {
        if (purveyor.deleted === false) {
          return (
            <PurveyorIndexRow
              key={idx}
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
        <TouchableHighlight
          underlayColor='#eee'
          onPress={this.props.onNavigateToCategoryIndex}
          style={styles.createButton}
        >
          <Text style={styles.createButtonText}>Order by Category</Text>
        </TouchableHighlight>
        <ScrollView keyboardShouldPersistTaps={false} >
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
  scrollView: {
    backgroundColor: '#f7f7f7',
    height: 500,
    paddingLeft: 20,
    paddingRight: 0,
    marginTop: 0,
    paddingTop: 0
  },
  createButton: {
    padding: 5,
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
