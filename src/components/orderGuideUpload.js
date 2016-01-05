import React from 'react-native';
import _ from 'lodash';
import { Icon, } from 'react-native-icons';
import Colors from '../utilities/colors';

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
    }
  }

  showActionSheet(){
    var options = {
      title: 'Select Order Guide Images',
      maxWidth: 2048,
      maxHeight: 2048,
      noData: true,
      quality: 1,
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
        console.log(source.uri)
        image = (
          <View style={styles.itemContainer}>
            <Image source={{uri: source.uri}} style={{height: 150, width: 125,}} />
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
      <ScrollView
        automaticallyAdjustContentInsets={false}
        ref="scrollView"
        style={styles.container}
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
  }
})

export default OrderGuideUpload
