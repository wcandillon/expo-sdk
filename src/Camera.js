import React, { PropTypes } from 'react';
import {
  NativeModules,
  requireNativeComponent,
  ViewPropTypes,
  Platform,
} from 'react-native';

const CameraManager =
  NativeModules.ExponentCameraManager || NativeModules.ExponentCameraModule;

function convertNativeProps(props) {
  const newProps = { ...props };
  if (typeof props.flashMode === 'string') {
    newProps.flashMode = Camera.Constants.FlashMode[props.flashMode];
  }

  if (typeof props.type === 'string') {
    newProps.type = Camera.Constants.Type[props.type];
  }

  if (typeof props.autoFocus === 'string') {
    newProps.autoFocus = Camera.Constants.AutoFocus[props.autoFocus];
  }

  if (typeof props.whiteBalance === 'string') {
    newProps.whiteBalance = Camera.Constants.WhiteBalance[props.whiteBalance];
  }

  newProps.onCameraReadyNative = this._nativeOnCameraReady;

  if (Platform.OS === 'ios') {
    delete newProps.ratio;
  }

  return newProps;
}

export default class Camera extends React.Component {
  static Constants = {
    Type: CameraManager.Type,
    FlashMode: CameraManager.FlashMode,
    AutoFocus: CameraManager.AutoFocus,
    WhiteBalance: CameraManager.WhiteBalance,
  };

  static propTypes = {
    ...ViewPropTypes,
    onCameraReady: PropTypes.func,
    flashMode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ratio: PropTypes.string,
    autoFocus: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
      PropTypes.number,
    ]),
    focusDepth: PropTypes.number,
    zoom: PropTypes.number,
    whiteBalance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  static defaultProps = {
    type: CameraManager.Type.back,
    flashMode: CameraManager.FlashMode.off,
    autoFocus: CameraManager.AutoFocus.on,
    focusDepth: 0,
    ratio: '4:3',
    zoom: 0,
    whiteBalance: CameraManager.WhiteBalance.auto,
  };

  takePicture = async function() {
    return await CameraManager.takePicture();
  };

  getSupportedRatios = async function() {
    if (Platform.OS === 'android') {
      return await CameraManager.getSupportedRatios();
    } else {
      Promise.reject('Ratio is not supported on iOS');
    }
  };

  _nativeOnCameraReady() {
    if (this.props.onCameraReady) {
      this.props.onCameraReady();
    }
  }

  render() {
    const nativeProps = convertNativeProps(this.props);

    return <ExponentCamera {...nativeProps} />;
  }
}

export const Constants = Camera.Constants;

const ExponentCamera = requireNativeComponent('ExponentCamera', Camera, {
  nativeOnly: {
    onCameraReadyNative: true,
  },
});
