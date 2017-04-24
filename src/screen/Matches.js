import React, { Component } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { List, ListItem } from 'react-native-elements';
import * as firebase from 'firebase';
import _ from 'lodash';

class Matches extends Component {
  static navigationOptions = {
    title: 'Chat',
    headerVisible: true,
  }

  constructor(props) {
    super(props);
    this.state = {
      user: this.props.navigation.state.params.user,
      match: [],
    };
    this.getMatches = this.getMatches.bind(this);
    this.getOverlap = this.getOverlap.bind(this);
    this.getUser = this.getUser.bind(this);
  }

  componentWillMount() {
    this.getMatches();
  }

  getOverlap(liked, likedBack) {
    const likedTrue = _.pickBy(liked, value => value)
    const likedBackTrue = _.pickBy(likedBack, value => value)
    return _.intersection(_.keys(likedTrue), _.keys(likedBackTrue))
  }

  getUser(uid) {
    return firebase.database().ref('users').child(uid).once('value')
      .then(snap => snap.val());
  }

  getMatches() {
    const { uid } = this.state.user;
    firebase.database().ref('relationships').child(uid)
      .on('value', snap => {
        const relations = snap.val() || [];
        const allMatches = this.getOverlap(relations.liked, relations.likedBack);
        const matchData = _.map(allMatches, (profile) => this.getUser(profile));
        Promise.all(matchData).then((data) => this.setState({match: data}));
      });
  }

  render() {
    const { match } = this.state;
    return (
      <View style={styles.container}>
        <List containerStyle={{marginBottom: 20}}>
          {
            match.map((list, i) => (
              <ListItem
                roundAvatar
                avatar={{uri: `https://graph.facebook.com/${list.id}/picture?height=500`}}
                key={i}
                title={list.first_name}
                onPress={() => this.props.navigation.navigate('Chat', {profile: list, user: this.state.user})}
              />
            ))
          }
        </List>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Matches;

