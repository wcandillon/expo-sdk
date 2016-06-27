'use strict';

import {
  NativeModules,
} from 'react-native';

export async function getContactsAsync(fields = []) {
  return await NativeModules.ExponentContacts.getContactsAsync(fields);
}

export const PHONE_NUMBER = 'phone_number';
export const EMAIL = 'email';

