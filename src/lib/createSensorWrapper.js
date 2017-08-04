/* @flow */

import { Platform, NativeEventEmitter } from 'react-native';

type Result = {
  x: number,
  y: number,
  z: number,
};

type Listener = Result => void;

type Subscription = {
  remove: Function,
};

export default function createSensorWrapper(
  NativeSensorModule: any,
  eventName: string
) {
  const SensorEventEmitter = new NativeEventEmitter(NativeSensorModule);

  class SensorWrapper {
    hasListeners() {
      return this.getListenerCount() > 0;
    }

    getListenerCount() {
      return SensorEventEmitter.listeners(eventName).length;
    }

    addListener(listener: Listener) {
      if (Platform.OS === 'android') {
        if (!this.hasListeners()) {
          NativeSensorModule.startObserving();
        }
      }

      let emitterSubscription = SensorEventEmitter.addListener(
        eventName,
        listener
      );

      emitterSubscription.remove = () => {
        return this.removeSubscription(emitterSubscription);
      };

      return emitterSubscription;
    }

    removeAllListeners() {
      if (Platform.OS === 'android') {
        NativeSensorModule.stopObserving();
      }

      return SensorEventEmitter.removeAllListeners(eventName);
    }

    removeSubscription(subscription: Subscription) {
      if (Platform.OS === 'android') {
        if (this.getListenerCount() === 1) {
          NativeSensorModule.stopObserving();
        }
      }

      return SensorEventEmitter.removeSubscription(subscription);
    }

    setUpdateInterval(intervalMs: number) {
      NativeSensorModule.setUpdateInterval(intervalMs);
    }
  }

  return new SensorWrapper();
}
