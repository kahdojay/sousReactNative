import React from 'react-native';
import _ from 'lodash';
import { Icon, } from 'react-native-icons';
import Colors from '../utilities/colors';
import Sizes from '../utilities/sizes';

const {
  Dimensions,
  StyleSheet,
  View,
  Text,
  Image,
  NativeModules,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  ActivityIndicatorIOS,
} = React;

const { UIImagePickerManager } = NativeModules;

class OrderInvoiceUpload extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inputError: false,
      emailAddress: this.props.emailAddress,
      selectedPhotos: [],
      showAddEmailAddress: false,
    }
  }

  showActionSheet(){
    var options = {
      title: 'Select Invoice Images',
      maxWidth: 1024,
      maxHeight: 1024,
      quality: .75,
    };

    UIImagePickerManager.showImagePicker(options, (didCancel, response) => {
      // console.log('Response = ', response);

      let selectedPhotos = this.state.selectedPhotos.slice(0, (this.state.selectedPhotos.length-1))
      if (!didCancel) {
        // const source = {uri: response.uri.replace('file://', ''), isStatic: true};
        const source = {
          data: response.data,
          isStatic: true,
          // uri: 'data:image/jpeg;base64,' + response.data,
          uri: response.uri,
        };
        selectedPhotos.push(source)
      }
      this.setState({
        selectedPhotos: selectedPhotos,
      }, () => {
        this.props.onAddInvoices(this.state.selectedPhotos)
      })
    });
  }

  render() {

    const selectedPhotos = _.map(this.state.selectedPhotos, (source, idx) => {
      let image = (
        <View key={`loading-${idx}`} style={[styles.itemContainer, {borderWidth: 1, borderColor: Colors.disabled,}]}>
          <ActivityIndicatorIOS
            animating={true}
            color={Colors.disabled}
            style={{margin: 55}}
            size={'large'}
          />
        </View>
      )
      if(source.hasOwnProperty('uri') === true){
        image = (
          <View key={`image-${idx}`} style={styles.itemContainer}>
            <Image source={{uri: source.uri.replace('file://', ''), isStatic: source.isStatic}} style={{height: 150, width: 125,}} />
            <TouchableHighlight
              underlayColor='transparent'
              onPress={() => {
                const selectedPhotos = [
                  ...this.state.selectedPhotos.slice(0, idx),
                  ...this.state.selectedPhotos.slice(idx+1),
                ]
                this.setState({
                  selectedPhotos: selectedPhotos,
                })
              }}
              style={styles.imageDelete}
            >
              <Icon name='material|close' size={20} color={'white'} style={styles.deleteIcon} />
            </TouchableHighlight>
          </View>
        )
      }
      return image
    })

    return (
      <View style={styles.container}>
        <ScrollView
          automaticallyAdjustContentInsets={false}
          ref="scrollView"
          style={{}}
        >
          <View style={styles.uploadArea}>
            {selectedPhotos}
            <TouchableHighlight
              underlayColor='transparent'
              onPress={() => {
                let selectedPhotos = this.state.selectedPhotos
                selectedPhotos.push({loading: true})
                this.setState({
                  selectedPhotos: selectedPhotos,
                })
                this.showActionSheet()
              }}
              style={styles.itemContainer}
            >
              <View style={styles.addButton}>
                <Icon name='material|camera' size={40} color={Colors.lightBlue} style={{width: 50, height: 50,}} />
                <Text style={{color: Colors.lightBlue}}>Add</Text>
              </View>
            </TouchableHighlight>
          </View>
        </ScrollView>
      </View>
    );
  }
};

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBackgroundColor,
  },
  headerText: {
    fontSize: 18,
    alignSelf: 'center',
    textAlign: 'center',
    paddingLeft: 8,
    paddingRight: 8,
    fontWeight: 'bold',
  },
  centered: {
    alignSelf: 'center',
    textAlign: 'center',
    lineHeight: 20,
  },
  boldText: {
    fontWeight: 'bold'
  },
  uploadArea: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  itemContainer: {
    alignItems: 'center',
    height: 150,
    width: 125,
    margin: 15,
  },
  addButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.lightBlue,
    padding: 25,
    width: 125,
    height: 150,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  imageDelete: {
    position: 'absolute',
    top: -11,
    right: -11,
    width: 32,
    height: 32,
  },
  deleteIcon: {
    margin: 5,
    width: 22,
    height: 22,
    backgroundColor: Colors.red,
    borderRadius: 11,
  },
  sendEmail: {
    flex: 1,
    paddingTop: 10,
  },
  infoField: {
    borderBottomColor: Colors.inputUnderline,
    borderBottomWidth: 1,
  },
  inputErrorContainer: {
    flex: 1,
  },
  inputErrorText: {
    color: Colors.red,
    alignSelf: 'center',
  },
  input: {
    flex: 1,
    padding: 4,
    fontSize: Sizes.inputFieldFontSize,
    color: Colors.inputTextColor,
    fontFamily: 'OpenSans',
    textAlign: 'center',
    height: Sizes.inputFieldHeight,
  },
})

export default OrderInvoiceUpload
