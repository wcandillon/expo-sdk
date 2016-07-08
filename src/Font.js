// @flow

import {
  NativeModules,
} from 'react-native';

import { fromRequire } from './Asset';

const sessionId = NativeModules.ExponentConstants.sessionId;
const loaded = {};
const loading = {};
const onLoadPromises = {};

function nativeName(name) {
  return `${sessionId}-${name}`;
}

type FontUriMap = { [name: string]: string };

export function isLoaded(name:string) {
  return !!loaded[name];
}

export async function loadAsync(nameOrMap: string & FontUriMap, uriOrAssetModule: string | number) {
  if (typeof nameOrMap === 'object') {
    const names = Object.keys(nameOrMap);
    await Promise.all(names.map(name => loadAsync(name, nameOrMap[name])));
    return;
  }

  let name = nameOrMap;

  if (loaded[name]) {
    return;
  } else if (loading[name]) {
    await new Promise(resolve => { onLoadPromises[name].push(resolve); });
  } else {
    loading[name] = true;
    onLoadPromises[name] = [];

    let uri;
    if (typeof uriOrAssetModule === 'string') {
      uri = uriOrAssetModule;
    } else {
      uri = fromRequire(uriOrAssetModule).uri;
    }

    await NativeModules.ExponentFontLoader.loadAsync(nativeName(name), uri);
    loaded[name] = true;
    delete loading[name];

    if (onLoadPromises[name]) {
      onLoadPromises[name].forEach(resolve => resolve());
      delete onLoadPromises[name];
    }
  }
}

export function style(name: string, options:{ignoreWarning: bool} = {ignoreWarning: false}) {
  if (!loaded[name] && !options.ignoreWarning) {
    console.warn(`[Exponent.Font] No font '${name}', or it hasn't been loaded yet`);
  }
  return {
    fontFamily: `ExponentFont-${nativeName(name)}`,
  };
}

