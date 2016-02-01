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
const invoiceHeight = window.height-20

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

//==========================

class OrderInvoices extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  getInvoices(invoices) {
    if(!invoices || invoices.length === 0){
      return null
    }
    return invoices.map((invoice) => {
      return (
        <Invoice key={invoice.id} id={invoice.id} uri={invoice.imageUrl} config={invoice} />
      )
    })
  }

  render() {
    const {order} = this.props
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
        >
          {swiperInvoices}
        </Swiper>
        <View style={styles.bottomContainer}>
          <TouchableHighlight
            underlayColor='transparent'
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
  container: {
    height: invoiceHeight,
  },
  swiperContainer: {
    flex: 1,
  },
  swiperPagination: {
    bottom: -30,
  },
  invoice: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
  },
  invoiceImageContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  invoiceImage: {
    width: window.width,
    height: invoiceHeight,
    resizeMode: 'cover',
    backgroundColor: 'transparent',
  },
  bottomContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: Colors.separatorColor,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  invoiceButton: {
    height: 36,
    justifyContent: 'center',
    backgroundColor: Colors.gold,
  },
  invoiceButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'OpenSans',
    fontSize: 16,
  },
  errorTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 12,
    textAlign: 'center',
    padding: 15,
    color: Colors.red,
  },
})

export default OrderInvoices;
