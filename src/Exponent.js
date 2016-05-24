/**
 * @providesModule Exponent
 */
'use strict';

import {
  NativeModules,
} from 'react-native';

export const Constants = NativeModules.ExponentConstants;
export const Contacts = NativeModules.ExponentContacts;
export const Crypto = NativeModules.ExponentCrypto;
export const Fabric = NativeModules.ExponentFabric;
export const Facebook = NativeModules.ExponentFacebook;
export const FileSystem = NativeModules.ExponentFileSystem;
export const ImageCropper = NativeModules.ExponentImageCropper;
export const ImagePicker = NativeModules.UIImagePickerManager;
export const Location = NativeModules.ExponentLocation;
export const Notifications = NativeModules.ExponentNotifications;

export default {
  Contacts,
  Crypto,
  Fabric,
  Facebook,
  FileSystem,
  ImageCropper,
  ImagePicker,
  Location,
  Notifications,
};

