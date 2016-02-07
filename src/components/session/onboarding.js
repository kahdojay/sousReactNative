import React from 'react-native';
import Swiper from 'react-native-swiper';
import Colors from '../../utilities/colors';
import Loading from '../loading';
import ResponsiveImage from '../image/responsiveImage';

const {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

const window = Dimensions.get('window');
const buttonHeight = 60;
const slideHeight = window.height - buttonHeight - 20;

class Slide extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {id, config} = this.props;
    let uri = this.props.uri;
    let slideBackgroundColor = 'transparent'

    if(config.hasOwnProperty('backgroundColor') === true && config.backgroundColor){
      slideBackgroundColor = config.backgroundColor
    }

    uri = uri.replace('{resizeMode}', 'cover/')

    return (
      <View style={styles.slide}>
        <View style={[styles.slideImageContainer, {backgroundColor: slideBackgroundColor}]}>
          <ResponsiveImage
            source={{uri: uri}}
            initWidth={window.width}
            initHeight={slideHeight}
            style={styles.slideImage}
          />
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
        <Slide key={slide.key} id={slide.key} text={slide.text} uri={slide.uri} config={slide} />
      )
    })
  }

  processSlide(e, state) {
    const slideState = Object.assign({}, state)
    this.setState({
      slideIndex: slideState.index,
    }, () => {
      const {slides, slidesConfig} = this.props.settingsConfig.onboardingSettings
      const {slideButton} = slidesConfig
      if(slideState.index === (slides.length - 1)){
        this.setState({
          showLastSlideButton: true,
        })
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
    let btnBackgroundColor = Colors.gold
    let textColor = 'white'
    let buttonText = 'Next'

    if(lastSlideButton['backgroundColor']) {
      btnBackgroundColor = lastSlideButton.backgroundColor
    }

    if(lastSlideButton['textColor']) {
      textColor = lastSlideButton.textColor
    }

    if(this.state.slideIndex === (slides.length - 1)){
      if(lastSlideButton['label']){
        buttonText = lastSlideButton.label
      } else {
        buttonText = 'Let\'s Get Started!'
      }
    }

    return (
      <View style={styles.container}>
        <Swiper
          autoplay={(slidesConfig.autoplay === true ? true : false)}
          loop={(slidesConfig.loop === true ? true : false)}
          style={styles.swiperContainer}
          height={slideHeight}
          onMomentumScrollEnd={::this.processSlide}
          index={slideIndex}
          showsPagination={false}
        >
          {swiperSlides}
        </Swiper>
        <View style={styles.bottomContainer}>
          <TouchableHighlight
            underlayColor={btnBackgroundColor}
            onPress={() => {
              if(this.state.slideIndex === (slides.length - 1)){
                this.props.onNavToFeed()
              } else {
                this.setState({
                  slideIndex: (this.state.slideIndex+1),
                })
              }
            }}
            style={styles.slideButton}
          >
            <Text style={[styles.slideButtonText, {backgroundColor: btnBackgroundColor, color: textColor}]}>
              {buttonText}
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  swiperContainer: {

  },
  slide: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
  },
  slideImageContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  slideImage: {
    resizeMode: 'cover',
    backgroundColor: 'transparent',
  },
  bottomContainer: {
    backgroundColor: 'transparent',
  },
  slideButton: {
    backgroundColor: Colors.gold,
    height: buttonHeight,
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.separatorColor,
  },
  slideButtonText: {
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
