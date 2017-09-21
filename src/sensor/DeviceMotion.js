import { NativeModules, Platform } from 'react-native';
import ThreeAxisSensor from './ThreeAxisSensor';

const { ExponentDeviceMotion } = NativeModules;

type Measurement = {
  acceleration: {
    x: number,
    y: number,
    z: number,
  },
  accelerationIncludingGravity: {
    x: number,
    y: number,
    z: number,
  },
  rotation: {
    alpha: number,
    beta: number,
    gamma: number,
  },
  rotationRate: {
    alpha: number,
    beta: number,
    gamma: number,
  },
  orientation: number,
};

type Listener = Measurement => void;

type Subscription = {
  remove: () => void,
};

class ComplexSensor extends ThreeAxisSensor {
  Gravity = this._nativeModule.Gravity;

  addListener(listener: Listener): Subscription {
    if (!this.hasListeners()) {
      this._nativeModule.startObserving();
    }
    let subscription = this._nativeEmitter.addListener(
      this._nativeEventName,
      listener
    );
    subscription.remove = () => this.removeSubscription(subscription);
    return subscription;
  }
}

export const Gravity = ComplexSensor.Gravity;

export default new ComplexSensor(ExponentDeviceMotion, 'deviceMotionDidUpdate');
