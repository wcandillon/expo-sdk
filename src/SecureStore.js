// @flow

import { NativeModules } from 'react-native';

const { ExponentSecureStore } = NativeModules;

export type SecureStoreOptions = {
  keychainService?: string,
  keychainAccessible?: string,
};

export async function deleteItemAsync(
  key: string,
  options: SecureStoreOptions = {}
): Promise<void> {
  _ensureValidKey(key);
  await ExponentSecureStore.deleteValueWithKeyAsync(key, options);
}

export async function getItemAsync(
  key: string,
  options: SecureStoreOptions = {}
): Promise<?string> {
  _ensureValidKey(key);
  return await ExponentSecureStore.getValueWithKeyAsync(key, options);
}

export async function setItemAsync(
  key: string,
  value: string,
  options: SecureStoreOptions = {}
): Promise<void> {
  _ensureValidKey(key);
  if (!_isValidValue(value)) {
    throw new Error(
      `Invalid value provided to SecureStore. Values must be strings; consider JSON-encoding your values if they are serializable.`
    );
  }
  await ExponentSecureStore.setValueWithKeyAsync(value, key, options);
}

function _ensureValidKey(key: string) {
  if (!_isValidKey(key)) {
    throw new Error(
      `Invalid key provided to SecureStore. Keys must not be empty and contain only alphanumeric characters, ".", "-", and "_".`
    );
  }
}

function _isValidKey(key: string) {
  return typeof key === 'string' && /^[\w.-]+$/.test(key);
}

function _isValidValue(value: string) {
  return typeof value === 'string';
}

// Legacy aliases (remove in SDK 22)
export const getValueWithKeyAsync = function getValueWithKeyAsync(
  key: string,
  options: SecureStoreOptions = {}
) {
  console.warn(
    `SecureStore.getValueWithKeyAsync is deprecated and will be removed in SDK 22. Use SecureStore.setItemAsync(key, value, options) instead.`
  );
  return getItemAsync(key, options);
};
export const setValueWithKeyAsync = function setValueWithKeyAsync(
  value: string,
  key: string,
  options: SecureStoreOptions = {}
) {
  console.warn(
    `SecureStore.setValueWithKeyAsync is deprecated and will be removed in SDK 22. Use SecureStore.setItemAsync(key, options) instead.`
  );
  return setItemAsync(key, value, options);
};
export const deleteValueWithKeyAsync = function deleteValueWithKeyAsync(
  key: string,
  options: SecureStoreOptions = {}
) {
  console.warn(
    `SecureStore.deleteValueWithKeyAsync is deprecated and will be removed in SDK 22. Use SecureStore.deleteItemAsync(key, options) instead.`
  );
  return deleteItemAsync(key, options);
};;
