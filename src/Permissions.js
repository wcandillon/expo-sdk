// @flow

import {
  NativeModules,
} from 'react-native';

let { ExponentPermissions: Permissions } = NativeModules;

type PermissionType = 'remoteNotifications' | 'location';
type PermissionStatus = 'undetermined' | 'granted' | 'denied';
type PermissionExpires = 'never';
type PermissionDetailsLocationIOS = {
  scope: 'whenInUse' | 'always',
};
type PermissionResponse = {
  status: PermissionStatus,
  expires: PermissionExpires,
  ios?: PermissionDetailsLocationIOS,
  android?: any,
};

export async function getAsync(type: PermissionType):Promise<PermissionResponse> {
  return Permissions.getAsync(type);
}

export async function askAsync(type: PermissionType):Promise<PermissionResponse> {
  return Permissions.askAsync(type);
}

export const REMOTE_NOTIFICATIONS = 'remoteNotifications';
export const LOCATION = 'location';
