import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Expo from 'expo';
import firebase from 'firebase';
import { NavigationActions } from 'react-navigation';

import config from '../../config/config';
import FacebookButton from '../common/FacebookButton';

class Login extends Component {
  constructor() {
    super();

    this.state = {
      loading: false,
    };

    this.loginFacebook = this.loginFacebook.bind(this);
    this.getAuthenticate = this.getAuthenticate.bind(this);
    this.createUser = this.createUser.bind(this);
    this.navigateHome = this.navigateHome.bind(this);
  }

  componentWillMount() {
    // firebase.auth().signOut();
    firebase.auth().onAuthStateChanged((auth) => {
      if (auth) {
        this.firebaseRef = firebase.database().ref('users');
        this.firebaseRef.child(auth.uid).on('value', snap => {
          const user = snap.val();
          if (user != null) {
            this.firebaseRef.child(user.uid).off('value');
            this.navigateHome(user);
          }
        });
      }
    });
  }

  navigateHome(user) {
    this.props.navigation.navigate('HomeTab', { user });
    // const resetAction = NavigationActions.reset({
    //   index: 0,
    //   actions: [
    //     NavigationActions.navigate({
    //       routeName: 'HomeTab',
    //       params: { user },
    //     }),
    //   ],
    // });
    // this.props.navigation.dispatch(resetAction);
  }

  createUser(uid, gender, userData) {
    const defaulValue = {
      uid,
      distance: 5,
      ageRange: [18, 70],
      interestGender: 'Men',
    };
    firebase.database().ref('users').child(uid).update({...userData, ...defaulValue});
  }

  getAuthenticate(access_token) {
    const provider = firebase.auth.FacebookAuthProvider.credential(access_token);
    return firebase.auth().signInWithCredential(provider)
      .then((auth) => {
        if (auth) {
          this.firebaseRef = firebase.database().ref('users');
          this.firebaseRef.child(auth.uid).on('value', snap => {
            const user = snap.val();
            if (user !== null) {
              this.firebaseRef.child(user.uid).off('value');
              this.navigateHome(user);
            }
          });
        }
      })
      .catch((error) => {
        console.error('login error is ', error);
      });

  }

  async loginFacebook() {
    this.setState({loading: true});
    const fbId = config.facebook.id;
    const options = {
      permissions: ['public_profile', 'email', 'user_birthday'],
    };
    const field = ['id', 'first_name', 'last_name', 'gender', 'birthday'];

    try {
      const {type, token} = await Expo.Facebook.logInWithReadPermissionsAsync(fbId, options);
      if (type === 'success') {
        const response = await fetch(`https://graph.facebook.com/me?fields=${field.toString()}&access_token=${token}`);
        const userData = await response.json();
        const { uid } = await this.getAuthenticate(token);
        this.createUser(uid, userData);
        this.setState({loading: false});
      }
    } catch (e) {
      console.log('error is ', e);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.titleText}>Log in</Text>
        </View>
        <View style={styles.initialButton}>
          {this.state.loading ? <ActivityIndicator animating={this.state.loading} /> :
            (
              <View>
                <FacebookButton
                  onPress={this.loginFacebook}
                />
              </View>
            )
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  titleBox: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '600',
  },
  initialButton: {
    flex: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Login;
