import React from 'react-native';
import Swiper from 'react-native-swiper';
import Colors from '../../utilities/colors';
import Loading from '../loading';

const {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

const window = Dimensions.get('window');
const heightDivisions = ((window.height-20)/5);

class Slide extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {text, uri} = this.props;
    return (
      <View style={styles.slide}>
        <View style={styles.slideTextContainer}>
          <Text style={styles.slideText}>{text}</Text>
        </View>
        <View style={styles.slideImageContainer}>
          <Image source={{uri: uri}} style={styles.slideImage} />
        </View>
      </View>
    )
  }
}

//==========================

class Onboarding extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      slideIndex: 0,
    }
  }

  getSlides(slides) {
    if(!slides || slides.length === 0){
      return null
    }
    return slides.map((slide) => {
      return (
        <Slide key={slide.key} text={slide.text} uri={slide.uri} />
      )
    })
  }

  processSlide(e, state) {
    const slideState = Object.assign({}, state)
    this.setState({
      slideIndex: slideState.index,
    })
  }

  render() {
    const {settingsConfig} = this.props
    if((settingsConfig && settingsConfig['slides'] && settingsConfig['slides'].length > 0) === false){
      return (
        <View style={styles.errorTextContainer}>
          <Loading />
        </View>
      )
    }
    const {onboardingSettings} = settingsConfig
    const {slides, slidesConfig} = onboardingSettings
    const {slideIndex} = this.state
    const swiperSlides = this.getSlides(slides)

    let lastSlideButton = null
    if(this.state.slideIndex === (slides.length - 1)){
      lastSlideButton = (
        <TouchableHighlight
          underlayColor={Colors.gold}
          onPress={() => {
            this.props.onNavToFeed()
          }}
          style={styles.lastSlideButton}
        >
          <Text style={styles.lastSlideButtonText}>
            {slidesConfig.lastSlideButtonText || 'Let\'s Get Started!'}
          </Text>
        </TouchableHighlight>
      )
    }

    return (
      <View style={styles.container}>
        <Swiper
          loop={false}
          style={styles.swiperContainer}
          height={(heightDivisions*4)}
          onMomentumScrollEnd={::this.processSlide}
          index={slideIndex}
          paginationStyle={styles.swiperPagination}
        >
          {swiperSlides}
        </Swiper>
        <View style={styles.bottomContainer}>
          {lastSlideButton}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: (heightDivisions*5),
  },
  swiperContainer: {
    flex: 1,
  },
  swiperPagination: {
    bottom: -(heightDivisions/3),
  },
  slide: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  slideTextContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.separatorColor,
    justifyContent: 'center',
    height: heightDivisions,
  },
  slideText: {
    fontSize: 18,
    fontFamily: 'OpenSans',
    textAlign: 'center',
    color: Colors.blue,
  },
  slideImageContainer: {
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  slideImage: {
    backgroundColor: 'teal',
  },
  bottomContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: Colors.separatorColor,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  lastSlideButton: {
    height: (heightDivisions/2),
    justifyContent: 'center',
    backgroundColor: Colors.gold,
  },
  lastSlideButtonText: {
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

export default Onboarding;
