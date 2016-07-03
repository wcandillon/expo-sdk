// @flow

import {
  NativeModules,
} from 'react-native';

type FontUriMap = { [name: string]: string };

const sessionId = NativeModules.ExponentConstants.sessionId;
const loaded = {};

function nativeName(name) {
  return `${sessionId}-${name}`;
}

export async function loadAsync(nameOrMap: string & FontUriMap, uri: string) {
  if (typeof nameOrMap === 'object') {
    const names = Object.keys(nameOrMap);
    await Promise.all(names.map(name => loadAsync(name, nameOrMap[name])));
    return;
  }

  await NativeModules.ExponentFontLoader.loadAsync(nativeName(nameOrMap), uri);
  loaded[nameOrMap] = true;
}

export function style(name: string) {
  if (!loaded[name]) {
    console.warn(`[Exponent.Font] No font '${name}', or it hasn't been loaded yet`);
  }
  return {
    fontFamily: `ExponentFont-${nativeName(name)}`,
  };
}

