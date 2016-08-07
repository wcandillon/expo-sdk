// @flow

import {
  NativeModules,
} from 'react-native';

// On Android we pass the manifest in JSON form so this step is necessary
let manifest;
if (NativeModules.ExponentConstants) {
  if (typeof manifest === 'string') {
    manifest = JSON.parse(NativeModules.ExponentConstants.manifest);
  } else {
    manifest = NativeModules.ExponentConstants.manifest;
  }
}

module.exports = {
  ...NativeModules.ExponentConstants,
  manifest,
};
