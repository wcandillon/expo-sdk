import { Linking, Platform } from 'react-native';
import { EventEmitter } from 'fbemitter';

const allOriginalObjectProperties = new Map();

export function mockProperty(object, property, mockValue) {
  // Save a reference to the original property value
  if (!allOriginalObjectProperties.has(object)) {
    allOriginalObjectProperties.set(object, new Map());
  }
  allOriginalObjectProperties.get(object).set(property, object[property]);

  object[property] = mockValue;
}

export function unmockProperty(object, property) {
  let objectProperties = allOriginalObjectProperties.get(object);
  if (!objectProperties || !objectProperties.has(property)) {
    return;
  }

  object[property] = objectProperties.get(property);

  // Clean up the reference
  objectProperties.delete(property);
  if (!objectProperties.size) {
    allOriginalObjectProperties.delete(object);
  }
}

export function unmockAllProperties() {
  for (let [object, objectProperties] of allOriginalObjectProperties) {
    for (let [property, originalValue] of objectProperties) {
      object[property] = originalValue;
    }
  }
  allOriginalObjectProperties.clear();
}

export function mockPlatformIOS() {
  mockProperty(Platform, 'OS', 'ios');
}

export function mockPlatformAndroid() {
  mockProperty(Platform, 'OS', 'android');
}

export function describeCrossPlatform(message, tests) {
  describe(`  ${message}`, () => {
    beforeEach(mockPlatformIOS);
    tests();
    afterAll(() => {
      unmockProperty(Platform, 'OS');
    });
  });
  describe(`🤖  ${message}`, () => {
    beforeEach(mockPlatformAndroid);
    tests();
    afterAll(() => {
      unmockProperty(Platform, 'OS');
    });
  });
}

export function mockLinking() {
  let emitter = new EventEmitter();
  let subscriptions = {};

  mockProperty(
    Linking,
    'addEventListener',
    jest.fn((type, cb) => {
      let subscription = emitter.addListener(type, cb);
      subscriptions[type] = subscriptions[type] || new Map();
      subscriptions[type].set(cb, subscription);
    })
  );

  mockProperty(
    Linking,
    'removeEventListener',
    jest.fn((type, cb) => {
      subscriptions[type].delete(cb);
    })
  );

  return (type, data) => {
    emitter.emit(type, data);
  };
}
