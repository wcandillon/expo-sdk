'use strict';

import {
  NativeModules,
} from 'react-native';

const sessionId = NativeModules.ExponentConstants.sessionId;

const loaded = {};

function nativeName(name) {
  return NativeModules.ExponentConstants.sessionId + '-' + name;
}

export async function loadAsync(name, uri) {
  const result = await NativeModules.ExponentFontLoader.loadAsync(nativeName(name), uri);
  loaded[name] = true;
  return result;
}

export function style(name) {
  if (!loaded[name]) {
    console.warn(`[Exponent.Font] No font '${name}', or it hasn't been loaded yet`);
  }
  return {
    fontFamily: 'ExponentFont-' + nativeName(name),
  };
}

