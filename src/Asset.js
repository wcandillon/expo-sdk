import AssetRegistry from 'AssetRegistry';
import AssetSourceResolver from 'AssetSourceResolver';
import PixelRatio from 'PixelRatio';
import resolveAssetSource from 'resolveAssetSource';

// Construct the CDN uri for an asset, picking the correct scale if it's an
// image
const getURI = (asset) => {
  const scale = AssetSourceResolver.pickScale(asset.scales, PixelRatio.get());
  const index = asset.scales.findIndex(s => s === scale);
  return 'https://d1wp6m56sqw74a.cloudfront.net/~assets/' +
         (asset.fileHashes[index] || asset.fileHashes[0]);
};

// Override react-natives asset resolution for `Image` components
resolveAssetSource.setCustomSourceTransformer((resolver) => {
  return resolver.fromSource(getURI(resolver.asset));
});

export function fromRequire(id) {
  const asset = AssetRegistry.getAssetByID(id);
  return {
    uri: getURI(asset),
    width: asset.width,
    height: asset.height,
    name: asset.name,
    type: asset.type,
  };
}

