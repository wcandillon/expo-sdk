// @flow
import { NativeModules } from 'react-native';

const { ExponentErrorRecovery } = NativeModules;

export default {
  setRecoveryProps(props: { any: any }): void {
    return ExponentErrorRecovery.setRecoveryProps(props);
  },
};
