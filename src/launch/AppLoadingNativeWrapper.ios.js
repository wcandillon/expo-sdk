// @flow

import React from 'react';
import { NativeModules, requireNativeComponent } from 'react-native';

export default class AppLoading extends React.Component<{}> {
  componentWillUnmount() {
    NativeModules.ExponentAppLoadingManager.finishedAsync();
  }

  render() {
    return <NativeAppLoading />;
  }
}

const NativeAppLoading = requireNativeComponent('ExponentAppLoading', null);
