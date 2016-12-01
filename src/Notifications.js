// @flow

import {
  DeviceEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';

import {
  EventEmitter,
  EventSubscription,
} from 'fbemitter';

type Notification = {
  origin: 'selected' | 'received';
  data: any;
  remote: boolean;
}

type LocalNotification = {
  title: string;
  body?: string;
  data?: any;
  silent?: boolean;
  count?: number;

  // This are Android specific, not supported
  // on iOS. We should consider renaming them.
  icon?: string;
  color?: string;
  priority?: string;
  sticky?: boolean;
  vibrate?: Array<number>;
  link?: string;
}

// Android assigns unique number to each notification natively.
// Since that's not supported on iOS, we generate an unique string.
type LocalNotificationId = string | number;

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
  notification = { ...notification };

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

  /* Shows a notification instantly */
  presentLocalNotification(notification: LocalNotification): Promise<LocalNotificationId> {
    return NativeModules.ExponentNotifications.presentLocalNotification(notification);
  },

  /* Schedule a notification at a later date */
  async scheduleLocalNotification(
    notification: LocalNotification,
    opts: {
      time?: Date;
      repeat?: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
    }
  ): Promise<LocalNotificationId> {
    return NativeModules.ExponentNotifications.scheduleLocalNotification(notification, opts);
  },

  /* Dismiss currently shown notification with ID (Android only) */
  async dismissNotification(notificationId: LocalNotificationId): Promise<void> {
    if (Platform.OS === 'android') {
      return NativeModules.ExponentNotifications.dismissNotification(notificationId);
    } else {
      return Promise.reject('Dismissing notifications is not supported on iOS');
    }
  },

  /* Dismiss all currently shown notifications (Android only) */
  async dismissAllNotifications(): Promise<void> {
    if (Platform.OS === 'android') {
      return NativeModules.ExponentNotifications.dismissAllNotifications();
    } else {
      return Promise.reject('Dismissing notifications is not supported on iOS');
    }
  },

  /* Cancel scheduled notification notification with ID */
  async cancelScheduledNotification(notificationId: LocalNotificationId): Promise<void> {
    return NativeModules.ExponentNotifications.cancelScheduledNotification(notificationId);
  },

  /* Cancel all scheduled notifications */
  async cancelAllScheduledNotifications(): Promise<void> {
    return NativeModules.ExponentNotifications.cancelAllScheduledNotifications();
  },

  /* Primary public api */
  addListener(listener: Function): EventSubscription {
    _maybeInitEmitter();

    if (_initialNotification) {
      const initialNotification = _initialNotification;
      _initialNotification = null;
      setTimeout(() => {
        _emitNotification(initialNotification);
      }, 0);
    }

    return _emitter.addListener('notification', listener);
  },
};
