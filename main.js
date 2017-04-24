import Expo from 'expo';
import React from 'react';
import { MainStack }  from './src/Router';

const Root = () => {
  return (
    <MainStack />
  );
};

Expo.registerRootComponent(Root);
