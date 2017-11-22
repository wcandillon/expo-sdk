import { NativeModules } from 'react-native';

const BarCodeScannerManager = NativeModules.ExponentBarCodeScannerModule;

let BarCodeScannerImplementation;
if (BarCodeScannerManager) {
  BarCodeScannerImplementation = require('./OldBarCodeScanner').default;
} else {
  BarCodeScannerImplementation = require('./CameraBasedBarCodeScanner').default;
}

export default BarCodeScannerImplementation;
