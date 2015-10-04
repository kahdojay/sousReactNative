const React = require('react-native');
const PrepTab = require('./prepTab');

const {
    StyleSheet,
    TabBarIOS,
    TabBarItemIOS,
    View,
} = React;

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'tabOne',
    };
  }
  setTab(tabId){
    this.setState({selectedTab: tabId})
  }

  render() {
    return (
      <TabBarIOS
        tintColor="white"
        barTintColor="black"
        translucent={false}
        >
        <TabBarIOS.Item
          title="Prep"
          selected={this.state.selectedTab === 'tabOne'}
          onPress={() => this.setTab('tabOne') }>
          <PrepTab />
        </TabBarIOS.Item>

        <TabBarIOS.Item
          title="Feed"
          selected={this.state.selectedTab === 'tabTwo'}
          onPress={() => this.setTab('tabTwo') }>
          <View />
        </TabBarIOS.Item>

        <TabBarIOS.Item
          title="Order"
          selected={this.state.selectedTab === 'tabThree'}
          onPress={() => this.setTab('tabThree') }>
          <View />
        </TabBarIOS.Item>
      </TabBarIOS>

    );
  }
};

module.exports = App