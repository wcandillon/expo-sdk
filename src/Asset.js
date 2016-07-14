'use strict';

import {
  NativeModules,
  PixelRatio,
  Platform,
} from 'react-native';

import AssetRegistry from 'react-native/Libraries/Image/AssetRegistry';
import AssetSourceResolver from  'react-native/Libraries/Image/AssetSourceResolver';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';

import { manifest } from './Constants';

// Return { uri, hash } for an asset's file, picking the correct scale, based on
// its React Native metadata. If the asset isn't an image just picks the first
// file.
const pickScale = (meta) => {
  // This logic is based on that in AssetSourceResolver.js, we just do it with
  // our own tweaks for Exponent

  const scale = meta.scales.length > 1 ?
                AssetSourceResolver.pickScale(meta.scales, PixelRatio.get()) :
                1;
  const index = meta.scales.findIndex(s => s === scale);
  const hash = meta.fileHashes[index] || meta.fileHashes[0];

  if (manifest.xde) {
    // Development server URI is pieced together
    const suffix = scale === 1 ? '' : '@' + scale + 'x';
    return {
      uri: manifest.bundleUrl.match(/^https?:\/\/.*?\//)[0] +
           meta.httpServerLocation.replace(/^\/?/, '') +
           '/' + meta.name + suffix + '.' + meta.type +
           '?platform=' + Platform.OS + '&hash=' + meta.hash,
      hash,
    };
  }

  // CDN URI is based directly on the hash
  return {
    uri: 'https://d1wp6m56sqw74a.cloudfront.net/~assets/' + hash,
    hash,
  };
};

export default class Asset {
  static byModule = {};

  constructor({ name, type, hash, uri, width, height }) {
    this.name = name;
    this.type = type;
    this.hash = hash;
    this.uri = uri;
    if (width) {
      this.width = width;
    }
    if (height) {
      this.height = height;
    }

    this.preloading = false;
    this.preloaded = false;
    this.preloadPromises = [];
  }

  static fromModule(moduleId) {
    if (Asset.byModule[moduleId]) {
      return Asset.byModule[moduleId];
    }

    // TODO: Make React Native's AssetRegistry save moduleId so we don't have to
    //       do this here.
    const meta = AssetRegistry.getAssetByID(moduleId);
    meta.moduleId = moduleId;
    const { uri, hash } = pickScale(meta);

    const asset = new Asset({
      name: meta.name,
      type: meta.type,
      hash,
      uri,
      width: meta.width,
      height: meta.height,
    });
    Asset.byModule[moduleId] = asset;
    return asset;
  }

  async preloadAsync() {
    if (this.preloaded) {
      return;
    }
    if (this.preloading) {
      await new Promise((resolve, reject) =>
        this.preloadPromises.push({ resolve, reject }));
      return;
    }
    this.preloading = true;

    try {
      const { uri } = await NativeModules.ExponentFileSystem.downloadAsync(
        this.uri, this.hash, {});
      this.uri = uri;
      this.preloaded = true;
      this.preloadPromises.forEach(({ resolve }) => resolve());
    } catch (e) {
      this.preloadPromises.forEach(({ reject }) => reject(e));
    } finally {
      this.preloading = false;
      this.preloadPromises = [];
    }
  }
}

// Override React Native's asset resolution for `Image` components
resolveAssetSource.setCustomSourceTransformer((resolver) =>
  resolver.fromSource(resolver.asset.moduleId ?
                      Asset.fromModule(resolver.asset.moduleId).uri :
                      pickScale(resolver.asset).uri));

