'use strict';

import React from 'react';
import {
  NativeModules,
  View,
} from 'react-native';

let rendered = false;

requestAnimationFrame(() => {
  setTimeout(() => {
    if (!rendered) {
      // App hasn't rendered an AppLoading yet, just hide
      NativeModules.ExponentAppLoading.hideAsync();
    }
  }, 200);
});

export default class AppLoading extends React.Component {
  componentWillUnmount() {
    NativeModules.ExponentAppLoading.hideAsync();
  }

  render() {
    rendered = true;
    return null;
  }
}

