/* @flow */

import { EventEmitter, EventSubscription } from 'fbemitter';
import { DeviceEventEmitter, NativeModules } from 'react-native';

const { ExponentUtil } = NativeModules;

let _emitter;

function _maybeInitEmitter() {
  if (!_emitter) {
    _emitter = new EventEmitter();
    DeviceEventEmitter.addListener(
      'Exponent.newVersionAvailable',
      _emitNewVersionAvailable
    );
  }
}

function _emitNewVersionAvailable(newVersionEvent) {
  if (typeof newVersionEvent === 'string') {
    newVersionEvent = JSON.parse(newVersionEvent);
  }

  _emitter.emit('newVersionAvailable', newVersionEvent);
}

ExponentUtil.addNewVersionListenerExperimental = function(
  listener: Function
): EventSubscription {
  _maybeInitEmitter();

  return _emitter.addListener('newVersionAvailable', listener);
};

export default ExponentUtil;
