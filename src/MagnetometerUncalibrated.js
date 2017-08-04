/* @flow */

import { NativeModules } from 'react-native';
import createSensorWrapper from './lib/createSensorWrapper';

const { ExponentMagnetometerUncalibrated } = NativeModules;

export default createSensorWrapper(
  ExponentMagnetometerUncalibrated,
  'magnetometerUncalibratedDidUpdate'
);
