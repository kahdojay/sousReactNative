import React from 'react-native';
import ScreenUtils from '../../utilities/screen';
const {
  Image
} = React;

class ResponsiveImage extends React.Component {
  render() {
    const width = Math.ceil(this.props.initWidth * ScreenUtils.scale);
    const height = Math.ceil(this.props.initHeight * ScreenUtils.scale);
    return (
      <Image
        style={[{width: width, height: height}, this.props.style]}
        source={this.props.source}
      />
    )
  }
}

export default ResponsiveImage
