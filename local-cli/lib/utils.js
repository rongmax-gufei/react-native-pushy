'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.question = question;
exports.translateOptions = translateOptions;
exports.getRNVersion = getRNVersion;
exports.getApkVersion = getApkVersion;
exports.getIPAVersion = getIPAVersion;

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _nodeApkParser = require('node-apk-parser');

var _nodeApkParser2 = _interopRequireDefault(_nodeApkParser);

var _ipaMetadata = require('ipa-metadata');

var _ipaMetadata2 = _interopRequireDefault(_ipaMetadata);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Created by tdzl2003 on 2/13/16.
 */

var read = require('read');

function question(query, password) {
  if (NO_INTERACTIVE) {
    return Promise.resolve('');
  }
  return new Promise(function (resolve, reject) {
    return read({
      prompt: query,
      silent: password,
      replace: password ? '*' : undefined
    }, function (err, result) {
      return err ? reject(err) : resolve(result);
    });
  });
}

function translateOptions(options) {
  const ret = {};
  for (let key in options) {
    const v = options[key];
    if (typeof v === 'string') {
      ret[key] = v.replace(/\$\{(\w+)\}/g, function (v, n) {
        return options[n] || process.env[n] || v;
      });
    } else {
      ret[key] = v;
    }
  }
  return ret;
}

function getRNVersion() {
  const version = JSON.parse(fs.readFileSync(path.resolve('node_modules/react-native/package.json'))).version;

  // We only care about major and minor version.
  const match = /^(\d+)\.(\d+)\./.exec(version);
  return {
    version,
    major: match[1] | 0,
    minor: match[2] | 0
  };
}

function getApkVersion(fn) {
  const reader = _nodeApkParser2.default.readFile(fn);
  const manifest = reader.readManifestSync();
  return Promise.resolve(manifest.versionName);
}

function getIPAVersion(fn) {
  return new Promise(function (resolve, reject) {
    (0, _ipaMetadata2.default)(fn, function (err, data) {
      err ? reject(err) : resolve(data.metadata.CFBundleShortVersionString);
    });
  });
}