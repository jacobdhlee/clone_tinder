import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
import moment from 'moment';
import SubButton from '../common/SubButton';

const { width, height } = Dimensions.get('window');

class Card extends Component {

  componentWillMount() {
    this.pan = new Animated.ValueXY();
    this.cardPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([
        null,
        {dx: this.pan.x, dy: this.pan.y},
      ]),

      onPanResponderRelease: (e, {dx}) => {
        const absDx = Math.abs(dx)
        const direction = absDx / dx;
        const swipeRight = direction > 0
        if(absDx > 150) {
          Animated.decay(this.pan, {
              verocity: { x: 3 * direction, y: 0},
              deceleration: 0.995,
          }).start(this.props.onSwipeOff(swipeRight, this.props.profile.uid));
        } else {
          Animated.spring(this.pan, {
            toValue: {x:0, y:0},
            friction: 3,
            }).start();
          }
      },
    });
  }

  render() {
    const { birthday, first_name, id, interestGender } = this.props.profile;
    const fbImage = `https://graph.facebook.com/${id}/picture?height=500`;
    const profileBday = moment(birthday, 'MM/DD/YYYY');
    const profileAge = moment().diff(profileBday, 'years');
    const rotateCard = this.pan.x.interpolate({
      inputRange: [-200, 0, 200],
      outputRange: ['20deg', '0deg', '-20deg'],
    });

    const animatedStyle = {
      transform: [
        {translateX: this.pan.x},
        {translateY: this.pan.y},
        {rotate: rotateCard},
      ],
    };

    return (
      <View>
        <Animated.View
          {...this.cardPanResponder.panHandlers}
          style={[styles.card, animatedStyle]}
        >
          <Image
            style={{flex: 1}}
            source={{uri: fbImage}}
          />
          <View style={{margin: 20}}>
            <Text style={{fontSize: 20}}>{first_name} {profileAge} {interestGender}</Text>
          </View>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: width - 20,
    height: height * 0.6,
    top: (height * 0.3) / 2,
    overflow: 'hidden',
    backgroundColor: 'white',
    margin: 10,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 8,
  },
});

export default Card