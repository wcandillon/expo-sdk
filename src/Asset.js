'use strict';

import {
  PixelRatio,
  Platform,
} from 'react-native';

import AssetRegistry from 'react-native/Libraries/Image/AssetRegistry';
import AssetSourceResolver from  'react-native/Libraries/Image/AssetSourceResolver';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';

import { manifest } from './Constants';

// Construct the CDN URI for an asset from its React Native metadata, picking
// the correct scale if it's an image
const getURI = (asset) => {
  // This logic is based on that in AssetSourceResolver.js, we just do it with
  // our own tweaks for Exponent

  const scale = asset.scales.length > 1 ?
                AssetSourceResolver.pickScale(asset.scales, PixelRatio.get()) :
                1;

  if (manifest.xde) {
    // Development server URI is pieced together
    const suffix = scale === 1 ? '' : '@' + scale + 'x';
    return manifest.bundleUrl.match(/^https?:\/\/.*?\//)[0] +
           asset.httpServerLocation.replace(/^\/?/, '') +
           '/' + asset.name + suffix + '.' + asset.type +
           '?platform=' + Platform.OS + '&hash=' + asset.hash;
  }

  // CDN URI is based directly on the hash
  const index = asset.scales.findIndex(s => s === scale);
  return 'https://d1wp6m56sqw74a.cloudfront.net/~assets/' +
         (asset.fileHashes[index] || asset.fileHashes[0]);
};

// Override React Native's asset resolution for `Image` components
resolveAssetSource.setCustomSourceTransformer((resolver) =>
  resolver.fromSource(getURI(resolver.asset)));

export function fromModule(id) {
  const asset = AssetRegistry.getAssetByID(id);
  return {
    uri: getURI(asset),
    width: asset.width,
    height: asset.height,
    name: asset.name,
    type: asset.type,
  };
}

