import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Expo from 'expo';
import firebase from 'firebase';
import moment from 'moment';
import CircleImage from './CircleImage';
const { width } = Dimensions.get('window');

class ProfileDetail extends Component {
  static navigationOptions = {
    headerVisible: true,
  }

  constructor(props) {
    super(props);
    this.state = {
      latitude: undefined,
      longitude: undefined,
    }
  }

  componentWillMount() {
    const { uid } = this.props.navigation.state.params.user;
    firebase.database().ref('geoData').child(uid)
      .once('value', snap => {
        const location = snap.val();
        console.log('fucking location is ', location.l);
        this.setState({ latitude: location.l[0],  longitude: location.l[1]});
      });

  }
  render() {
    const { id, first_name, gender, birthday } = this.props.navigation.state.params.user;
    const { latitude, longitude } = this.state;
    const profileBday = moment(birthday, 'MM/DD/YYYY');
    const age = moment().diff(profileBday, 'years');
    return (
      <View style={styles.picContainer}>
        <CircleImage fbID={id} size={100} />
        <Text>{first_name} {gender} {age} </Text>
        <Expo.MapView
          style={{width: width * 0.7, height: 200}}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Expo.MapView.Marker
            coordinate={{
              latitude,
              longitude,
            }}
          />
        </Expo.MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  picContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default ProfileDetail;

