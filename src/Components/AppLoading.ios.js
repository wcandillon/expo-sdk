'use strict';

import React from 'react';
import {
  NativeModules,
} from 'react-native';

let mounted = false;

requestAnimationFrame(() => {
  setTimeout(() => {
    if (!mounted) {
      // App hasn't mounted an AppLoading component yet, just hide automatically
      NativeModules.ExponentAppLoading.hideAsync();
    }
  }, 200);
});

export default class AppLoading extends React.Component {
  componentWillMount() {
    mounted = true;
  }

  componentWillUnmount() {
    NativeModules.ExponentAppLoading.hideAsync();
  }

  render() {
    return null;
  }
}

