// @flow

import { NativeModules, NativeEventEmitter } from 'react-native';
import UUIDjs from 'uuid-js';

const { ExponentFileSystem: FS } = NativeModules;

const normalizeEndingSlash = p => p.replace(/\/*$/, '') + '/';

FS.documentDirectory = normalizeEndingSlash(FS.documentDirectory);
FS.cacheDirectory = normalizeEndingSlash(FS.cacheDirectory);

export const documentDirectory = FS.documentDirectory;
export const cacheDirectory = FS.cacheDirectory;

export function getInfoAsync(fileUri, options = {}) {
  return FS.getInfoAsync(fileUri, options);
}

export function readAsStringAsync(fileUri) {
  return FS.readAsStringAsync(fileUri, {});
}

export function writeAsStringAsync(fileUri, contents) {
  return FS.writeAsStringAsync(fileUri, contents, {});
}

export function deleteAsync(fileUri, options = {}) {
  return FS.deleteAsync(fileUri, options);
}

export function moveAsync(options) {
  return FS.moveAsync(options);
}

export function copyAsync(options) {
  return FS.copyAsync(options);
}

export function makeDirectoryAsync(fileUri, options = {}) {
  return FS.makeDirectoryAsync(fileUri, options);
}

export function readDirectoryAsync(fileUri) {
  return FS.readDirectoryAsync(fileUri, {});
}

export function downloadAsync(uri, fileUri, options = {}) {
  return FS.downloadAsync(uri, fileUri, options);
}

export function createDownloadResumable(
  url,
  fileUri,
  options = {},
  callback = null,
  resumeData = null
) {
  return new DownloadResumable(url, fileUri, options, callback, resumeData);
}

type DownloadProgressCallback = (data: DownloadProgressData) => any;
type DownloadProgressData = {
  totalBytesWritten: number,
  totalBytesExpectedToWrite: number,
};

export class DownloadResumable {
  _uuid: string;
  _url: string;
  _fileUri: string;
  _options: object;
  _resumeData: string;
  _callBack: ?DownloadProgressCallback;
  _subscription: ?Function;
  _emitter: NativeEventEmitter;

  constructor(url, fileUri, options = {}, callback, resumeData) {
    this._uuid = UUIDjs.create(4).toString();
    this._url = url;
    this._fileUri = fileUri;
    this._options = options;
    this._resumeData = resumeData;
    this._callBack = callback;
    this._subscription = null;
    this._emitter = new NativeEventEmitter(FS);
  }

  async downloadAsync() {
    this._addSubscription();
    return await FS.downloadResumableStartAsync(
      this._url,
      this._fileUri,
      this._uuid,
      this._options,
      this._resumeData
    );
  }

  async pauseAsync() {
    const pauseResult = await FS.downloadResumablePauseAsync(this._uuid);
    this._resumeData = pauseResult.resumeData;
    return pauseResult;
  }

  async resumeAsync() {
    this._addSubscription();
    return await FS.downloadResumableStartAsync(
      this._url,
      this._fileUri,
      this._uuid,
      this._options,
      this._resumeData
    );
  }

  savable() {
    return {
      url: this._url,
      fileUri: this._fileUri,
      options: this._options,
      resumeData: this._resumeData,
    };
  }

  _addSubscription() {
    if (!this._subscription) {
      this._subscription = this._emitter.addListener(
        'Exponent.downloadProgress',
        ({ uuid, data }) => {
          const callback = this._callBack;
          if (callback) {
            callback(data);
          }
        }
      );
    }
  }
}
