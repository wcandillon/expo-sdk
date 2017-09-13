import { NativeModules } from 'react-native';

exports.initialize = function() {
  if (!NativeModules.TPSStripeManager) {
    console.warn(
      `We temporarily moved the Expo Payments API to ExpoKit. Please see the SDK 20 release notes for more information: https://blog.expo.io/expo-sdk-v20-0-0-is-now-available-79f84232a9d1`
    );
  }
};

if (NativeModules.TPSStripeManager) {
  module.exports = NativeModules.TPSStripeManager;
}
