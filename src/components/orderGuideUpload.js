import React from 'react-native';
import _ from 'lodash';
import { Icon, } from 'react-native-icons';
import Colors from '../utilities/colors';
import EmailUtils from '../utilities/email';

const {
  Dimensions,
  StyleSheet,
  View,
  Text,
  Image,
  Modal,
  NativeModules,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  ActivityIndicatorIOS,
} = React;

const { UIImagePickerManager } = NativeModules;

class OrderGuideUpload extends React.Component {
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
      title: 'Select Order Guide Images',
      maxWidth: 1024,
      maxHeight: 1024,
      quality: .75,
    };

    UIImagePickerManager.showImagePicker(options, (didCancel, response) => {
      // console.log('Response = ', response);

      if (didCancel) {
        const selectedPhotos = this.state.selectedPhotos.slice(0, (this.state.selectedPhotos.length-1))
        this.setState({
          selectedPhotos: selectedPhotos,
        })
      } else {
        // const source = {uri: response.uri.replace('file://', ''), isStatic: true};
        const source = {
          data: response.data,
          isStatic: true,
          // uri: 'data:image/jpeg;base64,' + response.data,
          uri: response.uri,
        };
        let selectedPhotos = this.state.selectedPhotos.slice(0, (this.state.selectedPhotos.length-1))
        selectedPhotos.push(source)
        this.setState({
          selectedPhotos: selectedPhotos,
        })
      }
    });
  }

  render() {

    const modal = (
      <Modal
        animated={true}
        transparent={true}
        visible={this.state.showAddEmailAddress}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            this.setState({
              showAddEmailAddress: false,
            })
          }}
          style={{flex: 1,}}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalInnerContainer}>
              <View style={styles.sendEmail}>
                <View style={styles.infoField}>
                  <TextInput
                    style={styles.input}
                    value={this.state.emailAddress}
                    onChange={(e) => {
                      this.setState({
                        inputError: false,
                        emailAddress: e.nativeEvent.text
                      })
                    }}
                    placeholder={"Your Email Address"}
                  />
                </View>
                { this.state.inputError === true ?
                  <View style={styles.inputErrorContainer}>
                    <Text style={styles.inputErrorText}>Please enter a valid email address.</Text>
                  </View>
                : <View style={styles.inputErrorContainer} /> }
              </View>
              <View style={[styles.separator, {marginTop: 10}]} />
              <TouchableHighlight
                onPress={() => {
                  const emailValid = EmailUtils.validateEmailAddress(this.state.emailAddress)
                  if(emailValid === true){
                    if(this.state.selectedPhotos.length > 0){
                      this.setState({
                        showAddEmailAddress: false,
                      }, () => {
                        this.props.onUploadOrderGuide(this.state.emailAddress, this.state.selectedPhotos)
                      })
                    }
                  } else {
                    this.setState({
                      inputError: true
                    })
                  }
                }}
                underlayColor='transparent'
              >
                <Text style={styles.modalButtonText}>Send</Text>
              </TouchableHighlight>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    )

    const selectedPhotos = _.map(this.state.selectedPhotos, (source, idx) => {
      let image = (
        <View style={[styles.itemContainer, {borderWidth: 1, borderColor: Colors.disabled,}]}>
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
          <View style={styles.itemContainer}>
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

    let uploadButtonUnderlayColor = Colors.light
    let uploadButtonStyle = {}
    let uploadButtonTextStyle = {}
    if(this.state.selectedPhotos.length === 0){
      uploadButtonUnderlayColor = Colors.disabled
      uploadButtonStyle = {backgroundColor: Colors.disabled}
      uploadButtonTextStyle = {color: Colors.darkGrey}
    }

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
                <Icon name='material|plus' size={40} color={Colors.lightBlue} style={{width: 50, height: 50,}} />
                <Text style={{color: Colors.lightBlue}}>Add</Text>
              </View>
            </TouchableHighlight>
          </View>
        </ScrollView>
        <TouchableHighlight
          underlayColor={uploadButtonUnderlayColor}
          onPress={() => {
            if(this.state.selectedPhotos.length > 0){
              if(this.state.emailAddress !== '' && this.state.emailAddress !== null){
                this.props.onUploadOrderGuide(this.state.emailAddress, this.state.selectedPhotos)
              } else {
                this.setState({
                  showAddEmailAddress: true
                })
              }
            }
          }}
          style={[styles.uploadButton, uploadButtonStyle]}
        >
          <Text style={[styles.uploadButtonText, uploadButtonTextStyle]}>Upload Order Guide</Text>
        </TouchableHighlight>
        {modal}
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
    height: 150,
    width: 125,
    margin: 15,
    alignItems: 'center',
  },
  addButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.lightBlue,
    padding: 25,
    width: 125,
    height: 150,
    alignItems: 'center',
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
  uploadButton: {
    borderTopColor: Colors.separatorColor,
    borderTopWidth: 1,
    backgroundColor: 'white',
  },
  uploadButtonText: {
    color: Colors.lightBlue,
    textAlign: 'center',
    padding: 10,
    paddingBottom: 12,
    fontFamily: 'OpenSans',
    fontSize: 16,
    fontWeight: 'bold',
  },

  sendEmail: {
    flex: 1,
    paddingBottom: 10,
  },
  infoField: {
    height: 45,
    paddingLeft: 5,
    paddingTop: 15,
    flexDirection: 'row',
  },
  inputErrorContainer: {
    height: 10,
  },
  inputErrorText: {
    color: Colors.red,
    alignSelf: 'center'
  },
  input: {
    flex: 1,
    padding: 4,
    marginRight: 5,
    marginBottom: 5,
    fontSize: 14,
    borderRadius: 8,
    color: '#333',
    fontWeight: 'bold',
    fontFamily: 'OpenSans',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalInnerContainer: {
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 20,
  },
  modalButtonText: {
    textAlign: 'center',
    color: Colors.lightBlue,
    paddingTop: 15,
  },
  separator: {
    height: 0,
    borderBottomColor: Colors.separatorColor,
    borderBottomWidth: 1,
  },
})

export default OrderGuideUpload
