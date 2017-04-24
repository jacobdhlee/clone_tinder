import React, { Component } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Expo from 'expo';
import * as firebase from 'firebase';
import GeoFire from 'geofire';
import Card from '../common/Card';
import filter from '../modules/filter';
import SubButton from '../common/SubButton';

class Home extends Component {
  static navigationOptions = {
    headerVisible: false,
  }
  constructor(props) {
    super(props);
    this.state = {
      profileIndex: 0,
      profiles: [],
      user: this.props.navigation.state.params.user,
    };

    // this.scrollViewStack = this.scrollViewStack.bind(this);
    this.cardStack = this.cardStack.bind(this);
    this.updateUserLocation = this.updateUserLocation.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.getUser = this.getUser.bind(this);
    this.related = this.related.bind(this);
    this.getSwiped = this.getSwiped.bind(this);
  }

  componentWillMount() {
    const { uid, distance } = this.state.user;
    this.updateUserLocation(uid);
    firebase.database().ref('users').child(uid).on('value', snap => {
      const user = snap.val();
      this.setState({
        user,
        profiles:[],
        profileIndex:0,
      });
      this.getProfile(user.uid, user.distance);
    });
  }

  async updateUserLocation(uid) {
    const { Permissions, Location } = Expo;
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({enableHighAccuracy: false});
      // const { latitude, longitude } = location.coords
      const latitude = 37.39239; //demo
      const longitude = -122.09072; //demo

      const geoFireRef = new GeoFire(firebase.database().ref('geoData'));
      geoFireRef.set(uid, [latitude, longitude]);
    } else {
      console.log('Permissions dinied');
    }
  }

  getUser(uid) {
    return firebase.database().ref('users').child(uid).once('value');
  }

  async getProfile(uid, distance) {
    const geoFireRef = new GeoFire(firebase.database().ref('geoData'));
    const userLocation = await geoFireRef.get(uid);
    const swipedProfile = await this.getSwiped(uid);
    const geoQuery = geoFireRef.query({
      center: userLocation,
      radius: distance, //km
    });
    geoQuery.on('key_entered', async (key, location, distance) => {
      const user = await this.getUser(key);
      const profiles = [...this.state.profiles, user.val()];
      const filtered = filter(profiles, this.state.user, swipedProfile);
      this.setState({ profiles: filtered });
    });
  }

  related(userUid, status, profileUid) {
    let relationUpdate = {};
    relationUpdate[`${userUid}/liked/${profileUid}`] = status;
    relationUpdate[`${profileUid}/likedBack/${userUid}`] = status;
    firebase.database().ref('relationships').update(relationUpdate);
  }

  getSwiped(uid) {
    return firebase.database().ref('relationships').child(uid).child('liked')
      .once('value')
      .then(snap => snap.val() || {});
  }

  cardStack(swipeRight, profileUid) {
    const { profileIndex } = this.state;
    const userUid = this.state.user.uid;
    this.setState({ profileIndex: profileIndex + 1 });
    if (swipeRight) {
      this.related(userUid, true, profileUid);
    } else {
      this.related(userUid, false, profileUid);
    }
  }

  render() {
    const { profileIndex, profiles } = this.state;
    const eachProfile = profiles.slice(profileIndex, profileIndex + 3).reverse().map((prof, i) => {
      return (
        <Card
          key={prof.id}
          profile={prof}
          onSwipeOff={this.cardStack}
        />
      );
    });
    
    return (
      <View style={styles.container} >
        <View style={{flex: 8}}>
          {eachProfile}
        </View>
        <View style={styles.buttonContainer}>
          <SubButton
            onPress={() => this.cardStack(false, profiles[profileIndex].uid)}
            name={'thumbs-o-down'}
            type={'font-awesome'}
            color={'green'}
            addStyle={styles.addStyle}
          />
          <SubButton
            onPress={() => this.props.navigation.navigate('Info', { user: profiles[profileIndex] } )}
            name={'info'}
            type={'font-awesome'}
            color={'darkgrey'}
          />
          <SubButton
            onPress={() => this.cardStack(true, profiles[profileIndex].uid)}
            name={'heart'}
            type={'font-awesome'}
            color={'red'} 
            addStyle={styles.addStyle}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flex: 2,
    flexDirection: 'row',
    top: 0,
    alignItems:'flex-end',
    justifyContent:'center',
    marginBottom: 5,
  },
  addStyle: {
    height: 85,
    width: 85,
    marginHorizontal: 5,
    marginBottom: 10,
    borderRadius: 85 / 2,
  }
});


export default Home;
