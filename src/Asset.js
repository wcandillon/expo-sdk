import resolveAssetSource from 'resolveAssetSource';
import PixelRatio from 'PixelRatio';
import AssetSourceResolver from 'AssetSourceResolver';

// Return the hash for the correct scale of an image asset
const imgFileHash = (asset) => {
  const scale = AssetSourceResolver.pickScale(asset.scales, PixelRatio.get());
  const index = asset.scales.findIndex(s => s === scale);
  return asset.fileHashes[index] || asset.fileHashes[0];
};

// Construct the CDN uri for an asset file identified by its hash
const uriForHash = (hash) =>
  'https://d1wp6m56sqw74a.cloudfront.net/~assets/' + hash;

// Override react-natives asset resolution for `Image` components
resolveAssetSource.setCustomSourceTransformer((resolver) => {
  const uri = uriForHash(imgFileHash(resolver.asset));
  const source = resolver.fromSource(uri);
  //const source = resolver.defaultAsset();
  console.log('source', source);
  return resolver.fromSource(uri);
});

