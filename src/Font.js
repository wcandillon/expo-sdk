'use strict';

import {
  NativeModules,
  Platform,
} from 'react-native';

import UUID from 'uuid-js';

const map = {};

// The platform-specific part of loading code: load a font and return the style props
const loadNativeAsync = Platform.select({
  async ios(uri) {
    return {
      fontFamily: await NativeModules.EXFontLoader.loadFontAsync(uri),
    };
  },

  async android(uri) {
    const detected = await NativeModules.ExponentFontLoader.loadFontWithFamilyNameAsync(
      UUID.create().toString(),
      uri,
    );

    const fontStyle = ['regular', 'bold', 'italic', 'bold-italic'][detected.fontStyle];
    if (fontStyle) {
      console.log(`[Exponent.Font] Font at '${uri}' was detected to have style '${fontStyle}'.`);
    } else {
      throw new Error(`Style of font at '${uri}' couldn't be detected`);
    }

    return {
      fontFamily: detected.fontFamily,
      fontStyle,
    };
  },
});

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
      style: await loadNativeAsync(uri),
    };
  } catch (e) {
    delete map[name];
    throw e;
  }
}

export function style(name) {
  return map[name] ? map[name].style : {};
}

