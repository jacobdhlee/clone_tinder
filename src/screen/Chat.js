import React, { Component } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import firebase from 'firebase';
import _ from 'lodash';
import { GiftedChat } from 'react-native-gifted-chat';


class Chat extends Component {
  static navigationOptions = ({navigation}) => ({
    headerVisible: true,
    title: navigation.state.params.profile.first_name,
  });

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      id: 0,
    }
    this.onSend = this.onSend.bind(this);
    this.chatMessages = this.chatMessages.bind(this);
  }

  componentWillMount() {
    const { profile, user } = this.props.navigation.state.params;
    console.log('fucking profile ', profile)
    this.chatID = user.uid > profile.uid ? ( profile.uid + '-' + user.uid ) : ( user.uid + '-' + profile.uid )
    this.chatMessages();
  }

  chatMessages() {
    firebase.database().ref('messages').child(this.chatID).on('value', snap => {
      let messages = _.map(snap.val(), message => message).reverse();
      this.setState({ messages });
    });
  }

  onSend(message) {
    const { profile, user } = this.props.navigation.state.params;
    const textBackFile = ['Hi', 'Fart', 'Fuck you', 'Haha', 'Bye', 'Whatever', '!!!'];
    let textIndex = Math.floor(textBackFile.length * Math.random());
    firebase.database().ref('messages').child(this.chatID)
      .push({
        ...message[0],
        createAt: new Date().getTime(),
      });

      setTimeout(() => {
        firebase.database().ref('messages').child(this.chatID)
          .push({
            _id: this.state.id,
            createAt: new Date().getTime(),
            text: textBackFile[textIndex],
            user: {
              _id: profile.uid,
              avatar: `https://graph.facebook.com/${profile.id}/picture?height=80`
            },
          });
      }, 500);
      this.setState({id: this.state.id + 1});
  }

  render() {
    const {uid, id} = this.props.navigation.state.params.user;
    const avatar = `https://graph.facebook.com/${id}/picture?height=80`;
    return (
      <View style={styles.container}>
        <GiftedChat
          messages={this.state.messages}
          user={{_id: uid, avatar}}
          onSend={this.onSend}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;

