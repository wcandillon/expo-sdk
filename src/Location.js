// @flow

import {
  DeviceEventEmitter,
  NativeModules,
} from 'react-native';

type LocationOptions = {
  enableHighAccuracy: ?bool,
  timeInterval: ?number,
  distanceInterval: ?number,
}

type LocationData = {
  coords: {
    latitude: number,
    longitude: number,
    altitude: number,
    accuracy: number,
    heading: number,
    speed: number,
  },
  timestamp: number,
}

type LocationCallback = (data: LocationData) => any;

let nextWatchId = 0;
let watchCallbacks: { [watchId: number]: LocationCallback } = {};
let deviceEventSubscription: ?Function;

export function getCurrentPositionAsync(options: LocationOptions) {
  return new Promise(async (resolve, reject) => {
    let done = false;
    let subscription;
    subscription = await watchPositionAsync(options, (location) => {
      if (!done) {
        resolve(location);
        done = true;
      }
      if (subscription) {
        subscription.remove();
      }
    });
    if (done) {
      subscription.remove();
    }
  });
}

export async function watchPositionAsync(options: LocationOptions, callback: LocationCallback) {
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
  await NativeModules.ExponentLocation.watchPositionImplAsync(watchId, options);

  let removed = false;
  return {
    remove() {
      if (!removed) {
        NativeModules.ExponentLocation.removeWatchAsync(watchId);
        delete watchCallbacks[watchId];
        removed = true;
      }
    },
  };
}

