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
export const Crypto = NativeModules.CryptoModule;
export const ImagePicker = NativeModules.UIImagePickerManager;
export const FacebookLogin = NativeModules.FacebookLoginModule;
export const Fabric = NativeModules.ExponentFabric;
export const ImageCropper = NativeModules.ExponentImageCropper;

export default {
  Constants,
  Contacts,
  FileSystem,
  Location,
  Crypto,
  ImagePicker,
  FacebookLogin,
  Fabric,
  ImageCropper,
};

