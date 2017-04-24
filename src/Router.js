import React from 'react';
import * as firebase from 'firebase';
import { StackNavigator, TabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import Home from './screen/Home';
import Login from './screen/Login';
import Profile from './screen/Profile';
import Matches from './screen/Matches';
import ProfileDetail from './screen/ProfileDetail';
import Chat from './screen/Chat';
import config from '../config/config';

firebase.initializeApp(config.firebase);

const HomeStack = StackNavigator({
  Home: {
    screen: Home,
  },
  Info: {
    screen: ProfileDetail,
  },
},{
  mode: 'modal',
  headerMode: 'screen',
});

const MatchStack = StackNavigator({
  Match: {
    screen: Matches,
  },
  Chat: {
    screen: Chat,
  },
}, {
  headerMode: 'screen',
});

const HomeTab = TabNavigator({
  Profile: {
    screen: Profile,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <Icon type="font-awesome" name="user-o" size={25} color={tintColor} />,
    },
  },
  Home: {
    screen: HomeStack,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <Icon name="supervisor-account" size={30} color={tintColor} />,
    },
  },
  Match: {
    screen: MatchStack,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <Icon name="chat" size={25} color={tintColor} />,
    }
  },
});

export const MainStack = StackNavigator({
  Login: {
    screen: Login,
  },
  HomeTab: {
    screen: HomeTab,
  },
}, {
  headerMode: 'none',
});
