const mockNativeModules = require('NativeModules');
Object.defineProperty(mockNativeModules, 'ExponentNotifications', {
  enumerable: true,
  get: () => ({
    getExponentPushTokenAsync: jest.fn(),
  }),
});

jest.doMock('NativeModules', () => mockNativeModules);
