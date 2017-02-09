// @flow

import {
  NativeModules,
} from 'react-native';
import Asset from './Asset';

export async function setIsEnabled(value) {
  return await NativeModules.ExponentAudio.setIsEnabled(value);
}

export class Sound {
  constructor({ source }) {
    if (typeof source === 'number') { // source is an asset module
      let asset = Asset.fromModule(source);
      this.uri = asset.localUri || asset.uri;
    } else if (source.constructor === Asset) {
      this.uri = source.localUri || source.uri;
    } else { // source is a remote URI
      this.uri = source;
    }

    this.loaded = false;
    this.key = -1;
    this.statusChangeCallback = null;
    this.userPlaybackFinishedCallback = null;
    this.statusPollingTimeoutVariable = null;
    this.statusPollingTimeoutMillis = 100;
  }

  _statusPollingLoop = () => {
    if (this.statusChangeCallback != null) {
      this.getStatus(); // Automatically calls this.statusChangeCallback.
    }
    if (this.loaded) {
      this.statusPollingTimeoutVariable = setTimeout(this._statusPollingLoop, this.pollingTimeoutMillis);
    }
  }

  _disableStatusPolling() {
    if (this.statusPollingTimeoutVariable != null) {
      clearTimeout(this.statusPollingTimeoutVariable);
      this.statusPollingTimeoutVariable = null;
    }
  }

  _enableStatusPolling() {
    this._disableStatusPolling();
    this._statusPollingLoop();
  }

  _tryCallStatusChangeCallbackForStatus(status) {
    if (this.statusChangeCallback != null) {
      this.statusChangeCallback(status);
    }
  }

  _internalPlaybackFinishedCallback = (status) => {
    this._tryCallStatusChangeCallbackForStatus(status);
    if (this.userPlaybackFinishedCallback != null) {
      this.userPlaybackFinishedCallback();
    }
    this._setInternalPlaybackFinishedCallback(); // Callbacks are only called once and then released.
  }

  _setInternalPlaybackFinishedCallback() {
    if (this.loaded) {
      NativeModules.ExponentAudio.setPlaybackFinishedCallback(this.key, this._internalPlaybackFinishedCallback);
    }
  }

  async _performOperationAndUpdateStatus(operation) {
    if (this.loaded) {
      const { status } = await operation();
      this._tryCallStatusChangeCallbackForStatus(status);
      return status;
    }
    return null;
  }

  async loadAsync() {
    if (!this.loaded) {
      try {
        const result = await NativeModules.ExponentAudio.load(this.uri);
        this.key = result.key;
        this.durationMillis = result.duration_millis;
        this.loaded = true;
        this._setInternalPlaybackFinishedCallback();
      } catch (error) {
        // Sound not created!
      }
    }
    return this;
  }

  isLoaded() {
    return this.loaded;
  }

  getDurationMillis() {
    return this.durationMillis;
  }

  setStatusChangeCallback(callback) {
    this.statusChangeCallback = callback;
    if (callback == null) {
      this._disableStatusPolling();
    } else {
      this._enableStatusPolling();
    }
  }

  setPlaybackFinishedCallback(callback) {
    this.userPlaybackFinishedCallback = callback;
  }

  setStatusPollingTimeoutMillis(value) {
    this.statusPollingTimeoutMillis = value;
  }

  async unload() {
    if (this.loaded) {
      this.loaded = false;
      this._disableStatusPolling();
      this.userPlaybackFinishedCallback = null;
      this.statusChangeCallback = null;
      await NativeModules.ExponentAudio.unload(this.key);
    }
  }

  async play() {
    return this._performOperationAndUpdateStatus(() => NativeModules.ExponentAudio.play(this.key));
  }

  async pause() {
    return this._performOperationAndUpdateStatus(() => NativeModules.ExponentAudio.pause(this.key));
  }

  async stop() {
    return this._performOperationAndUpdateStatus(() => NativeModules.ExponentAudio.stop(this.key));
  }

  async setPosition(millis) {
    return this._performOperationAndUpdateStatus(() => NativeModules.ExponentAudio.setPosition(this.key, millis));
  }

  async setVolume(value) {
    return this._performOperationAndUpdateStatus(() => NativeModules.ExponentAudio.setVolume(this.key, value));
  }

  async setIsMuted(value) {
    return this._performOperationAndUpdateStatus(() => NativeModules.ExponentAudio.setIsMuted(this.key, value));
  }

  async setIsLooping(value) {
    return this._performOperationAndUpdateStatus(() => NativeModules.ExponentAudio.setIsLooping(this.key, value));
  }

  async getStatus() {
    return this._performOperationAndUpdateStatus(() => NativeModules.ExponentAudio.getStatus(this.key));
  }
}
