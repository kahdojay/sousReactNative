const React = require('react-native');
const PrepTab = require('./prepTab');
const FeedTab = require('./feedTab');
const OrderTab = require('./orderTab');

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
          <FeedTab />
        </TabBarIOS.Item>

        <TabBarIOS.Item
          title="Order"
          selected={this.state.selectedTab === 'tabThree'}
          onPress={() => this.setTab('tabThree') }>
          <OrderTab />
        </TabBarIOS.Item>
      </TabBarIOS>

    );
  }
};

module.exports = App