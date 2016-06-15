'use strict';

import {
  DeviceEventEmitter,
  NativeModules,
} from 'react-native';

export const getCurrentPositionAsync = NativeModules.ExponentLocation.getCurrentPositionAsync;

let nextWatchId = 0;
let watchCallbacks = {};

let deviceEventSubscription;

export async function watchPositionAsync(options, callback) {
  if (!deviceEventSubscription) {
    deviceEventSubscription = DeviceEventEmitter.addListener(
      'Exponent.locationChanged',
      ({ watchId, location }) => {
        const callback = watchCallbacks[watchId];
        if (callback) {
          callback(location);
        } else {
          NativeModules.ExponentLocation.removeWatchAsync(watchId);
        }
      },
    );
  }

  const watchId = nextWatchId++; // XXX: thread safe?
  watchCallbacks[watchId] = callback;
  await NativeModules.ExponentLocation.watchPositionImplAsync(
    watchId,
    options,
  );
  return {
    remove() {
      NativeModules.ExponentLocation.removeWatchAsync(watchId);
      delete watchCallbacks[watchId];
    },
  };
}

