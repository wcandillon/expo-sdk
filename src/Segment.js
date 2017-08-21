// @flow
import { NativeModules, Platform } from 'react-native';

const { Segment } = NativeModules.ExponentSegment;

export default {
  initialize(options: { androidWriteKey?: string, iosWriteKey?: string }) {
    if (Platform.OS === 'android') {
      return Segment.initializeAndroid(options.androidWriteKey);
    } else if (Platform.OS === 'ios') {
      return Segment.initializeIOS(options.androidWriteKey);
    } else {
      throw new Error(`Unable to initialize Segment on \`${Platform.OS}\``);
    }
  },

  initializeIOS(writeKey: string) {
    console.warn(
      '`Segment.initializeIOS(writeKey)` is deprecated, use `Segment.initialize({androidWriteKey, iosWriteKey})` instead.'
    );
    if (Platform.OS !== 'ios') {
      throw new Error(
        `Expo.Segment.initializeIOS() should only be called on iOS, not \`${Platform.OS}\``
      );
    }

    return Segment.initializeIOS(writeKey);
  },

  initializeAndroid(writeKey: string) {
    console.warn(
      '`Segment.initializeAndroid(writeKey)` is deprecated, use `Segment.initialize({androidWriteKey, iosWriteKey})` instead.'
    );
    if (Platform.OS !== 'android') {
      throw new Error(
        `Expo.Segment.initializeAndroid() should only be called on Android, not \`${Platform.OS}\``
      );
    }

    return Segment.initializeAndroid(writeKey);
  },

  identify(userId: string) {
    return Segment.identify(userId);
  },

  identifyWithTraits(userId: string, traits: { [string]: any }) {
    return Segment.identifyWithTraits(userId, traits);
  },

  reset() {
    return Segment.reset();
  },

  track(event: string) {
    return Segment.track((event: string));
  },

  trackWithProperties(event: string, properties: { [string]: any }) {
    return Segment.trackWithProperties(event, properties);
  },

  screen(screenName: string) {
    return Segment.screen(screenName);
  },

  screenWithProperties(event: string, properties: string) {
    return Segment.screenWithProperties(event, properties);
  },

  flush() {
    return Segment.flush();
  },
};
