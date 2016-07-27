// @flow

import {
  NativeModules,
} from 'react-native';

let { ExponentPermissions: Permissions } = NativeModules;

export async function getAsync(type: string) {
  return Permissions.getAsync(type);
}

export async function askAsync(type: string) {
  return Permissions.askAsync(type);
}

export const REMOTE_NOTIFICATIONS = 'remoteNotifications';
export const LOCATION = 'location';
