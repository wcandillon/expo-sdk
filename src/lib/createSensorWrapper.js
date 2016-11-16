import { NativeEventEmitter } from 'react-native';

export default function createSensorWrapper(NativeSensorModule, eventName) {
  const SensorEventEmitter = new NativeEventEmitter(NativeSensorModule);

  class SensorWrapper {
    addListener(listener) {
      return SensorEventEmitter.addListener(eventName, listener);
    }

    removeAllListeners() {
      return SensorEventEmitter.removeAllListeners(eventName);
    }

    removeSubscription(subscription) {
      return SensorEventEmitter.removeSubscription(subscription);
    }

    setUpdateInterval(intervalMs) {
      NativeSensorModule.setUpdateInterval(intervalMs);
    }
  }

  return new SensorWrapper;
}
