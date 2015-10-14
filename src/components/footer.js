import React from 'react-native';
import { footerButtonIconColor, footerActiveHighlight } from '../utilities/colors';
import _ from 'lodash';
import { Icon } from 'react-native-icons';

const {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} = React;

class Footer extends React.Component {
  render() {
    let footerContainerStyle = styles.footerContainer;
    // TODO: fix the height animation to prevent FOUC
    if(this.props.ui.keyboard.visible === true){
      footerContainerStyle = [styles.footerContainer, {
        marginTop: this.props.ui.keyboard.marginBottom - 70
      }];
    }
    let applyHighlight = '';

    if (_.includes(['Signup', 'Login', 'Profile', 'InviteView'], this.props.route.name)){
      return null;
    } else if(_.includes(['StationIndex', 'StationView', 'TaskView'], this.props.route.name)){
      applyHighlight = 'Prep'
    } else if(_.includes(['Feed'], this.props.route.name)){
      applyHighlight = 'Feed'
    } else if(_.includes(['PurveyorIndex', 'PurveyorView', 'ProductView'], this.props.route.name)){
      applyHighlight = 'Order'
    }

    let prepFooterHighlight = (applyHighlight == 'Prep' ? styles.footerActiveHighlight : {});
    let feedFooterHighlight = (applyHighlight == 'Feed' ? styles.footerActiveHighlight : {});
    let orderFooterHighlight = (applyHighlight == 'Order' ? styles.footerActiveHighlight : {});

    return (
      <View style={footerContainerStyle}>
        <View style={styles.footerItem}>
          <TouchableHighlight
            underlayColor='white'
            onPress={() => {
              this.props.nav.replace({
                name: 'StationIndex',
                navigationBar: this.props.navBar
              })
            }}
            style={[styles.footerButton, prepFooterHighlight]}
          >
            <View>
              <Icon
                name='material|assignment'
                size={30}
                color={footerButtonIconColor}
                style={[styles.footerButtonIcon,prepFooterHighlight]}
              />
              <Text style={[styles.footerButtonText,prepFooterHighlight]}>
                Prep
              </Text>
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.footerItem}>
          <TouchableHighlight
            underlayColor="white"
            onPress={() => {
              this.props.nav.replace({
                name: 'Feed',
                navigationBar: this.props.navBar,
              })
            }}
            style={[styles.footerButton, feedFooterHighlight]}
          >
            <View>
              <Icon
                name='material|comments'
                size={24}
                color={footerButtonIconColor}
                style={[styles.footerButtonIcon,feedFooterHighlight]}
              />
              <Text style={[styles.footerButtonText,feedFooterHighlight]}>
                Feed
              </Text>
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.footerItem}>
          <TouchableHighlight
            underlayColor='white'
            onPress={() => {
              this.props.nav.replace({
                name: 'PurveyorIndex',
                navigationBar: this.props.navBar
              })
            }}
            style={[styles.footerButton, orderFooterHighlight]}
          >
            <View>
              <Icon
                name='material|shopping-cart'
                size={30}
                color={footerButtonIconColor}
                style={[styles.footerButtonIcon, orderFooterHighlight]}
              />
              <Text style={styles.footerButtonText}>
                Order
              </Text>
            </View>
          </TouchableHighlight>
        </View>
        {/*<View style={styles.footerItem}>
          <TouchableHighlight
            style={[styles.footerButton, styles.logoutButton]}
            onPress={this.props.onPressResetSession}
          >
            <View>
              <Icon
                name='material|bus'
                size={30}
                color='#fff'
                style={[styles.footerButtonIcon]}
              />
              <Text style={[styles.footerButtonText,styles.logoutButtonText]}>
                Reset
              </Text>
            </View>
          </TouchableHighlight>
        </View>*/}
      </View>
    );
  }
};

let styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  scene: {
    flex: 1
  },
  nav: {
    backgroundColor: '#1825AD',
    justifyContent: 'space-between',
    margin: 0,
    alignItems: 'center'
  },
  navSignUp: {
    justifyContent: 'center',
  },
  logo: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'OpenSans'
  },
  logoImage: {
    width: 45,
    height: 45,
    alignItems: 'center'
  },
  iconFace: {
    width: 70,
    height: 70,
  },
  profileBtn: {
    flex: 1,
    alignItems: 'flex-end',
  },
  signup: {
    marginRight: 5,
    right: 10,
    position: 'absolute',
    top: 27
  },
  header: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'OpenSans'
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 27,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'OpenSans'
  },
  footerContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#979797'
  },
  footerItem: {
    flex: 1
  },
  footerButton: {
    padding: 5
  },
  footerButtonIcon: {
    width: 25,
    height: 25,
    alignSelf: 'center'
  },
  footerButtonText: {
    alignSelf: 'center',
    color: footerButtonIconColor
  },
  footerActiveHighlight: {
    backgroundColor: footerActiveHighlight,
  },
  logoutButton: {
    backgroundColor: 'pink'
  },
  logoutButtonText: {
    color: '#fff'
  },
  leftBtn: {
    flex: 1,
  },
})

module.exports = Footer;
