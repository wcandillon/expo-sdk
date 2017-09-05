import { NativeModules } from 'react-native';
import * as SecureStore from '../SecureStore';

it(`sets values`, async () => {
  const testKey = 'key-test_0.0';
  const testValue = 'value `~!@#$%^&*();:\'"-_.,<>';
  const options = { keychainService: 'test' };
  await SecureStore.setItemAsync(testKey, testValue, options);

  expect(
    NativeModules.ExponentSecureStore.setValueWithKeyAsync
  ).toHaveBeenCalledTimes(1);
  expect(
    NativeModules.ExponentSecureStore.setValueWithKeyAsync
  ).toHaveBeenCalledWith(testValue, testKey, options);
});

it(`provides default options when setting values`, async () => {
  await SecureStore.setItemAsync('key', 'value');
  expect(
    NativeModules.ExponentSecureStore.setValueWithKeyAsync
  ).toHaveBeenCalledWith('value', 'key', {});
});

it(`gets values`, async () => {
  NativeModules.ExponentSecureStore.getValueWithKeyAsync.mockImplementation(
    async () => 'value'
  );

  const options = { keychainService: 'test' };
  const result = await SecureStore.getItemAsync('key', options);
  expect(result).toBe('value');
  expect(
    NativeModules.ExponentSecureStore.getValueWithKeyAsync
  ).toHaveBeenCalledWith('key', options);
});

it(`deletes values`, async () => {
  const options = { keychainService: 'test' };
  await SecureStore.deleteItemAsync('key', options);
  expect(
    NativeModules.ExponentSecureStore.deleteValueWithKeyAsync
  ).toHaveBeenCalledWith('key', options);
});

it(`checks for invalid keys`, async () => {
  NativeModules.ExponentSecureStore.getValueWithKeyAsync.mockImplementation(
    async () => `unexpected value`
  );

  await expect(SecureStore.getItemAsync(null)).rejects.toMatchSnapshot();
  await expect(SecureStore.getItemAsync(true)).rejects.toMatchSnapshot();
  await expect(SecureStore.getItemAsync({})).rejects.toMatchSnapshot();
  await expect(SecureStore.getItemAsync(() => {})).rejects.toMatchSnapshot();
  await expect(SecureStore.getItemAsync('@')).rejects.toMatchSnapshot();

  expect(
    NativeModules.ExponentSecureStore.getValueWithKeyAsync
  ).not.toHaveBeenCalled();
});

it(`checks for invalid values`, async () => {
  await expect(SecureStore.setItemAsync('key', null)).rejects.toMatchSnapshot();
  await expect(SecureStore.setItemAsync('key', true)).rejects.toMatchSnapshot();
  await expect(SecureStore.setItemAsync('key', {})).rejects.toMatchSnapshot();
  await expect(
    SecureStore.setItemAsync('key', () => {})
  ).rejects.toMatchSnapshot();

  expect(
    NativeModules.ExponentSecureStore.setValueWithKeyAsync
  ).not.toHaveBeenCalled();
});

it(`exports legacy methods`, async () => {
  expect(SecureStore.setValueWithKeyAsync).toBeDefined();
  expect(SecureStore.getValueWithKeyAsync).toBeDefined();
  expect(SecureStore.deleteValueWithKeyAsync).toBeDefined();
});
