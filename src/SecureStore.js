import { NativeModules } from 'react-native';

const { ExponentSecureStore } = NativeModules;

type SecureStoreOptions = {
  keychainService?: string,
  keychainAccessible?: string,
};

function _keyIsValid(tstString) {
  return tstString.match(/^[\w\.\-]+$/);
}

function _valueIsValid(tstString) {
  return tstString.match(/^\S*$/);
}

export function deleteValueWithKeyAsync(key, options?: SecureStoreOptions) {
  if (!options || typeof options !== 'object') {
    options = {};
  }
  return new Promise(async (resolve, reject) => {
    try {
      if (!_stringIsValid(key)) {
        throw new Error('Invalid key.');
      }
      await ExponentSecureStore.deleteValueWithKeyAsync(key, options);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

export function getValueWithKeyAsync(key, options?: SecureStoreOptions) {
  if (!options || typeof options !== 'object') {
    options = {};
  }
  return new Promise(async (resolve, reject) => {
    try {
      if (!_keyIsValid(key)) {
        throw new Error(
          'Invalid key. Keys may constain alphanumeric characters, `.`, `-`, and `_`'
        );
      }
      const fetchedValue = await ExponentSecureStore.getValueWithKeyAsync(
        key,
        options
      );
      resolve(fetchedValue);
    } catch (e) {
      reject(e);
    }
  });
}

export function setValueWithKeyAsync(value, key, options?: SecureStoreOptions) {
  if (!options || typeof options !== 'object') {
    options = {};
  }
  return new Promise(async (resolve, reject) => {
    try {
      if (!_keyIsValid(key)) {
        throw new Error(
          'Invalid key. Keys may constain alphanumeric characters, `.`, `-`, and `_`'
        );
      }

      if (!_valueIsValid(value)) {
        throw new Error('Invalid key. Keys may not contain white space.');
      }

      await ExponentSecureStore.setValueWithKeyAsync(value, key, options);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}
