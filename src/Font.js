'use strict';

import {
  NativeModules,
} from 'react-native';

const map = {};

export async function loadAsync(name, { uri }) {
  if (map[name]) {
    if (map[name].uri === uri) {
      return;
    }
    throw new Error("Different font already loaded for ${name}");
  }

  map[name] = {
    loading: true,
    style: {},
  };

  try {
    map[name] = {
      uri,
      style: {
        fontFamily: await NativeModules.EXFontLoader.loadFontAsync(uri),
      },
    };
  } catch (e) {
    delete map[name];
    throw e;
  }
}

export function style(name) {
  return map[name] ? map[name].style : {};
}

