// @flow

import {
  DeviceEventEmitter,
  NativeModules,
} from 'react-native';

import {
  EventEmitter,
  EventSubscription,
} from 'fbemitter';

type Notification = {
  origin: 'selected' | 'received',
  data: any,
}

let _emitter;
let _initialNotification;

function _maybeInitEmitter() {
  if (!_emitter) {
    _emitter = new EventEmitter();
    DeviceEventEmitter.addListener('Exponent.notification', _emitNotification);
  }
}

function _emitNotification(notification) {
  if (typeof notification === 'string') {
    notification = JSON.parse(notification);
  }

  /* Don't mutate the original notification */
  notification = {...notification};

  if (typeof notification.data === 'string') {
    notification.data = JSON.parse(notification.data);
  }

  _emitter.emit('notification', notification);
}

export default {
  /* Only used internally to initialize the notification from top level props */
  _setInitialNotification(notification: Notification) {
    _initialNotification = notification;
  },

  /* Re-export, we can add flow here if we want as well */
  getExponentPushTokenAsync: NativeModules.ExponentNotifications.getExponentPushTokenAsync,

  /* Primary public api */
  addListener(listener: Function): EventSubscription {
    _maybeInitEmitter();

    if (_initialNotification) {
      let initialNotification = _initialNotification;
      _initialNotification = null;
      setTimeout(() => {
        _emitNotification(initialNotification);
      }, 0);
    }

    return _emitter.addListener('notification', listener);
  },
};
