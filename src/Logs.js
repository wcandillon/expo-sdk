'use strict';

import UUID from 'uuid-js';

import * as Constants from './Constants';
import Queue from './lib/Queue';

if (Constants.manifest && Constants.manifest.logUrl) {
  let logQueue = new Queue();
  let logCounter = 0;
  let sessionId = UUID.create().toString();
  let isSendingLogs = false;
  let groupDepth = 0;

  async function sendRemoteLogsAsync() {
    if (isSendingLogs) {
      return;
    }

    let logs = [];
    let currentLog = logQueue.dequeue();
    if (!currentLog) {
      return;
    } else {
      isSendingLogs = true;
    }

    while (currentLog) {
      logs.push(currentLog);
      currentLog = logQueue.dequeue();
    }

    try {
      await fetch(Constants.manifest.logUrl, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Connection': 'keep-alive',
          'Proxy-Connection': 'keep-alive',
          'Accept': 'application/json',
          'Device-Id': Constants.deviceId,
          'Device-Name': Constants.deviceName,
          'Session-Id': sessionId,
        },
        body: JSON.stringify(logs),
      });
    } catch (e) {}

    isSendingLogs = false;
    sendRemoteLogsAsync();
  }

  function queueRemoteLog(level, additionalFields, args) {
    logQueue.enqueue({
      count: logCounter++,
      level,
      groupDepth,
      body: args,
      ...additionalFields,
    });

    // don't block on this
    sendRemoteLogsAsync();
  }

  function replaceConsoleFunction(original, level, additionalFields) {
    return function(...args) {
      if (original) {
        original.apply(console, args);
      }

      queueRemoteLog(level, additionalFields, args);
    };
  }

  // don't use level below info. only use debug for things that
  // shouldn't be shown to the developer.
  console.log = replaceConsoleFunction(console.log, 'info');
  console.debug = replaceConsoleFunction(console.debug, 'info');
  console.info = replaceConsoleFunction(console.info, 'info');
  console.warn = replaceConsoleFunction(console.warn, 'warn');
  console.error = replaceConsoleFunction(console.error, 'error');

  // console.group
  let originalGroup = console.group;
  console.group = function(...args) {
    if (originalGroup) {
      originalGroup.apply(console, args);
    }

    queueRemoteLog('info', {}, args);
    groupDepth++;
  };

  let originalGroupCollapsed = console.groupCollapsed;
  console.groupCollapsed = function(...args) {
    if (originalGroupCollapsed) {
      originalGroupCollapsed.apply(console, args);
    }

    queueRemoteLog('info', {
      groupCollapsed: true,
    }, args);
    groupDepth++;
  };

  let originalGroupEnd = console.groupEnd;
  console.groupEnd = function(...args) {
    if (originalGroupEnd) {
      originalGroupEnd.apply(console, args);
    }

    if (groupDepth > 0) {
      groupDepth--;
    }
    queueRemoteLog('info', {
      shouldHide: true,
    }, args);
  };

  // console.assert
  let originalAssert = console.assert;
  console.assert = function(assertion, errorString) {
    if (originalAssert) {
      originalAssert.apply(console, [assertion, errorString]);
    }

    if (!assertion) {
      queueRemoteLog('error', {}, `Assertion failed: ${errorString}`);
    }
  };

  // TODO: support rest of console methods
}
