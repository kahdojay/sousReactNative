import React from 'react-native';
import Swiper from 'react-native-swiper';
import Colors from '../utilities/colors';

const {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

const window = Dimensions.get('window');
const invoiceHeight = window.height-86

class Invoice extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {uri, id, config} = this.props;
    let invoiceBackgroundColor = 'transparent'

    return (
      <View style={styles.invoice}>
        <View style={styles.invoiceImageContainer}>
          <Image source={{uri: uri}} style={[styles.invoiceImage, {backgroundColor: invoiceBackgroundColor}]} />
        </View>
      </View>
    )
  }
}

class OrderInvoiceView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      order: this.props.order,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      order: nextProps.order,
    })
  }

  getInvoices(invoices) {
    if(!invoices || invoices.length === 0){
      return null
    }
    return invoices.map((invoice) => {
      let imageUrl = invoice.imageUrl
      if(imageUrl.indexOf('file://') !== -1){
        imageUrl = imageUrl.replace('file://', '')
      }
      return (
        <Invoice key={invoice.id} id={invoice.id} uri={imageUrl} config={invoice} />
      )
    })
  }

  render() {
    const {order} = this.state
    if(order.hasOwnProperty('invoices') === false){
      return (
        <View style={styles.unavailableTextContainer}>
          <Text style={styles.unavailableText}>Order invoices unavailable.</Text>
        </View>
      )
    }
    const swiperInvoices = this.getInvoices(order.invoices)

    return (
      <View style={styles.container}>
        <Swiper
          autoplay={false}
          loop={true}
          style={styles.swiperContainer}
          height={invoiceHeight}
          showsPagination={true}
          paginationStyle={styles.swiperPagination}
          dot={(
            <View style={styles.dot} />
          )}
          activeDot={(
            <View style={styles.dotActive} />
          )}
        >
          {swiperInvoices}
        </Swiper>
        <View style={styles.bottomContainer}>
          <TouchableHighlight
            underlayColor='white'
            onPress={() => {
              this.props.onNavtoUploadInvoices(order.id)
            }}
            style={styles.invoiceButton}
          >
            <Text style={[styles.invoiceButtonText]}>
              Upload Invoice(s)
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({

})

export default OrderInvoiceView;
