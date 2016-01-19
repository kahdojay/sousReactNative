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
    const {text, uri, id} = this.props;
    return (
      <View style={styles.slide}>
        {text ?
          <View style={styles.slideTextContainer}>
            <Text style={styles.slideText}>{text}</Text>
          </View>
        : null }
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
      showLastSlideButton: false,
    }
  }

  getSlides(slides) {
    if(!slides || slides.length === 0){
      return null
    }
    return slides.map((slide) => {
      return (
        <Slide key={slide.key} id={slide.key} text={slide.text} uri={slide.uri} />
      )
    })
  }

  processSlide(e, state) {
    const slideState = Object.assign({}, state)
    this.setState({
      slideIndex: slideState.index,
    }, () => {
      const {slides, slidesConfig} = this.props.settingsConfig.onboardingSettings
      const {lastSlideButton} = slidesConfig
      if(slideState.index === (slides.length - 1)){
        setTimeout(() => {
          this.setState({
            showLastSlideButton: true,
          })
        }, lastSlideButton.loadDelay || 0)
      }
    })
  }

  render() {
    const {settingsConfig} = this.props
    if((settingsConfig['onboardingSettings'] && settingsConfig['onboardingSettings']['slides'] && settingsConfig['onboardingSettings']['slides'].length > 0) !== true){
      return (
        <View style={styles.errorTextContainer}>
          <Loading />
        </View>
      )
    }
    const {onboardingSettings} = settingsConfig
    const {slides, slidesConfig} = onboardingSettings
    const {lastSlideButton} = slidesConfig
    const {slideIndex} = this.state
    const swiperSlides = this.getSlides(slides)
    let btnBkgColor = Colors.gold

    if(lastSlideButton['bkgColor']) {
      btnBkgColor = lastSlideButton.bkgColor
    }

    let slideButton = null
    if(this.state.showLastSlideButton === true){
      slideButton = (
        <TouchableHighlight
          underlayColor={btnBkgColor}
          onPress={() => {
            this.props.onNavToFeed()
          }}
          style={styles.lastSlideButton}
        >
          <Text style={[styles.lastSlideButtonText, {backgroundColor: btnBkgColor}]}>
            {lastSlideButton.label || 'Let\'s Get Started!'}
          </Text>
        </TouchableHighlight>
      )
    }

    return (
      <View style={styles.container}>
        <Swiper
          autoplay={(slidesConfig.autoplay === true ? true : false)}
          loop={(slidesConfig.loop === true ? true : false)}
          style={styles.swiperContainer}
          height={((heightDivisions*4.5)-1)}
          onMomentumScrollEnd={::this.processSlide}
          index={slideIndex}
          showsPagination={false}
          paginationStyle={styles.swiperPagination}
        >
          {swiperSlides}
        </Swiper>
        <View style={styles.bottomContainer}>
          {slideButton}
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
    justifyContent: 'flex-start',
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
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  slideImage: {
    width: window.width,
    height: window.height,
    resizeMode: 'cover',
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
