// @flow

import {
  NativeModules,
} from 'react-native';

type FieldType = 'phone_number' | 'email';

export async function getContactsAsync(fields: FieldType[] = []) {
  return await NativeModules.ExponentContacts.getContactsAsync(fields);
}

export const PHONE_NUMBER = 'phone_number';
export const EMAIL = 'email';
