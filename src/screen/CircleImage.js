import React, { Component } from 'react';
import {
  Image,
  PixelRatio,
} from 'react-native';

class CircleImage extends Component {
  render() {
    const { fbID, size } = this.props;
    const imageSize = PixelRatio.getPixelSizeForLayoutSize(size);
    const fbImage = `https://graph.facebook.com/${fbID}/picture?height=${imageSize}`;
    return (
      <Image
        source={{uri: fbImage}}
        style={{width: size, height: size, borderRadius: (size / 2)}}
      />
    );
  }
}

export default CircleImage;
