'use strict';

import {
  NativeModules,
} from 'react-native';

const sessionId = NativeModules.ExponentConstants.sessionId;

const loaded = {};

function nativeName(name) {
  return NativeModules.ExponentConstants.sessionId + '-' + name;
}

export async function loadAsync(nameOrMap, uri) {
  if (typeof nameOrMap === 'object') {
    await Promise.all(Object.keys(nameOrMap).map((name) =>
      loadAsync(name, nameOrMap[name])));
    return;
  }

  await NativeModules.ExponentFontLoader.loadAsync(nativeName(nameOrMap), uri);
  loaded[nameOrMap] = true;
}

export function style(name) {
  if (!loaded[name]) {
    console.warn(`[Exponent.Font] No font '${name}', or it hasn't been loaded yet`);
  }
  return {
    fontFamily: 'ExponentFont-' + nativeName(name),
  };
}

