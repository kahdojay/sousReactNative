const React = require('react-native');
const Dimensions = require('Dimensions');
const {
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TouchableHighlight,
  Component,
} = React;

const window = Dimensions.get('window');
const uri = 'http://pickaface.net/includes/themes/clean/img/slide2.png';

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    marginTop: 20,
    width: window.width,
    height: window.height,
    backgroundColor: '#aaa',
    flexDirection: 'column',
  },
  avatarContainer: {
    marginTop: -20,
    width: 214,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#777',

  },
  avatar: {
    width: 75,
    height: 75,
    marginTop: 10,
    borderRadius: 34,
    marginBottom: 5,
  },
  name: {
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  editProfile: {
    fontFamily: 'OpenSans',
    textAlign: 'center',
    color: 'white',
    marginBottom: 4,
  },
  item: {
    fontSize: 14,
    fontWeight: '300',
    paddingTop: 5,
  },
  separator: {
    height: 1,
    borderColor: '#eee',
    borderWidth: 1,
  },
  inviteContainer: {
    flex: 1,
    width: 214,
    flexDirection: 'column',
    alignItems: 'center',
  },
  saveButton: {
    marginTop: 5,
    backgroundColor: 'white',
    padding: 10,
    width: 150,
    borderRadius: 7,
  },
  saveText:{
    fontSize: 14,
    fontWeight: 'bold',
    color: 'blue',
    textAlign: 'center',
  },
  teamText: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'OpenSans',
  },
  teamItems: {
    borderLeftWidth: 1,
    borderLeftColor: '#bbb',
    marginLeft: 15,
    marginTop: 20,
  },
  teamItemText: {
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
    marginBottom: 10,
  }
});

module.exports = class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: true
    }
  }
  componentDidMount(){
    setTimeout(()=> {
      this.setState({ready: true});
    }, 2000)
  }
  render() {
    console.log("MENU", this.props);
    var menu = <ScrollView style={styles.menu}>
                <View style={styles.avatarContainer}>
                  <Image
                    style={styles.avatar}
                    source={{ uri: this.props.session.imageUrl }}/>
                  <Text style={styles.name}>{this.props.session.firstName} {this.props.session.lastName}</Text>
                  <TouchableHighlight>
                    <Text style={styles.editProfile}>Edit Profile</Text>
                  </TouchableHighlight>
                </View>
                <View style={styles.separator} />
                <View style={styles.inviteContainer}>
                  <Text style={styles.teamText}>Notepad</Text>
                  <TouchableHighlight style={styles.saveButton}>
                    <Text style={styles.saveText}>Invite to Notepad</Text>
                  </TouchableHighlight>
                </View>
                <View style={styles.teamItems}>
                  <Text style={styles.teamItemText}>Prep List</Text>
                  <Text style={styles.teamItemText}>Recipe Book</Text>
                  <Text style={styles.teamItemText}>Order Guide</Text>
                </View>
              </ScrollView>
    var content = this.state.ready ? menu : <View></View>
    return (
      <View>
        {content}
      </View>
    );
  }
}
