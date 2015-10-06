const React = require('react-native');

const NAV_BAR_HEIGHT = 60;
const STATUS_BAR_HEIGHT = 20;
const NAV_HEIGHT = NAV_BAR_HEIGHT + STATUS_BAR_HEIGHT;

const NavigationBarStyles = React.StyleSheet.create({
  navBarContainer: {
    height: NAV_HEIGHT,
    backgroundColor: 'white',
    paddingBottom: 5,
    borderBottomColor: 'rgba(0, 0, 0, 0.5)',
    borderBottomWidth: 1 / React.PixelRatio.get(),
    flexDirection: 'column',
  },
  navBar: {
    height: NAV_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  customTitle: {
    position: 'absolute',
    alignItems: 'center',
    bottom: 5,
    left: 0,
    right: 0,
  },
  navBarText: {
    marginVertical: 10,
    flex: 2,
  },
  navBarTitleText: {
    color: '#373e4d',
    fontWeight: '500',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 15,
  },
  navBarLeftButton: {
    paddingLeft: 10,
    marginVertical: 20,
  },
  navBarRightButton: {
    marginVertical: 20,
    paddingRight: 10,
  },
  navBarButtonText: {
    color: '#5890ff',
  },
});

export default {
  NavigationBarStyles
}
