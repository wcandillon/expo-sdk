/**
 * @providesModule Exponent
 */
'use strict';

import {
  NativeModules,
} from 'react-native';

export const Constants = NativeModules.ExponentConstants;
export const Contacts = NativeModules.ExponentContacts;
export const FileSystem = NativeModules.ExponentFileSystem;
export const Location = NativeModules.ExponentLocation;
export const Crypto = NativeModules.ExponentCrypto;
export const ImagePicker = NativeModules.UIImagePickerManager;
export const Facebook = NativeModules.ExponentFacebook;
export const Fabric = NativeModules.ExponentFabric;
export const ImageCropper = NativeModules.ExponentImageCropper;

export default {
  Constants,
  Contacts,
  FileSystem,
  Location,
  Crypto,
  ImagePicker,
  Facebook,
  Fabric,
  ImageCropper,
};

