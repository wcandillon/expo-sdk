/* @flow */

import { NativeModules } from 'react-native';
import createSensorWrapper from './lib/createSensorWrapper';

const { ExponentMagnetometer } = NativeModules;

export default createSensorWrapper(
  ExponentMagnetometer,
  'magnetometerDidUpdate'
);
