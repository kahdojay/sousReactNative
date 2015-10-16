import React from 'react-native'
import _ from 'lodash'
import { Icon } from 'react-native-icons'
import AddForm from './addForm'
import { mainBackgroundColor } from '../utilities/colors'
import PurveyorIndexRow from './purveyorIndexRow';

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

    let purveyorsList = _.map(_.filter(purveyors.data, (purveyor) =>
      {return purveyor.teamId === session.teamId}),
        function(purveyor, idx) {
          if (purveyor.deleted === false) {
            return (
              <PurveyorIndexRow
                key={idx}
                purveyor={purveyor}
                onPress={() => {
                  self.props.navigator.push({
                    name: 'PurveyorView',
                    purveyorId: purveyor.id,
                    navigationBar: self.props.navBar
                  })
                }}
              />
            )
          }
    })

    return (
      <View style={styles.container}>
        <AddForm
          placeholder="Add purveyor..."
          onSubmit={this.props.onAddPurveyor}
        />
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
});

PurveyorIndex.propTypes = {
  onAddPurveyor: React.PropTypes.func,
  navigator: React.PropTypes.object.isRequired,
  purveyors: React.PropTypes.object,
};

module.exports = PurveyorIndex;
