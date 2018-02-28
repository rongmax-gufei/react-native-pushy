'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commands = exports.choosePackage = exports.listPackage = undefined;

let listPackage = exports.listPackage = function () {
  var _ref = _asyncToGenerator(function* (appId) {
    var _ref2 = yield get(`/app/${appId}/package/list?limit=1000`);

    const data = _ref2.data;

    for (const pkg of data) {
      const version = pkg.version;

      let versionInfo = '';
      if (version) {
        versionInfo = ` - ${version.id} ${version.hash.slice(0, 8)} ${version.name}`;
      } else {
        versionInfo = ' (newest)';
      }
      console.log(`${pkg.id}) ${pkg.name}(${pkg.status})${versionInfo}`);
    }
    console.log(`\nTotal ${data.length} packages.`);
    return data;
  });

  return function listPackage(_x) {
    return _ref.apply(this, arguments);
  };
}();

let choosePackage = exports.choosePackage = function () {
  var _ref3 = _asyncToGenerator(function* (appId) {
    const list = yield listPackage(appId);

    while (true) {
      const id = yield (0, _utils.question)('Enter packageId:');
      const app = list.find(function (v) {
        return v.id === (id | 0);
      });
      if (app) {
        return app;
      }
    }
  });

  return function choosePackage(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

var _utils = require('./utils');

var _app = require('./app');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Created by tdzl2003 on 4/2/16.
 */

var _require = require('./api');

const get = _require.get,
      post = _require.post,
      uploadFile = _require.uploadFile;
const commands = exports.commands = {
  uploadIpa: function () {
    var _ref4 = _asyncToGenerator(function* (_ref5) {
      let args = _ref5.args;

      const fn = args[0];
      if (!fn) {
        throw new Error('Usage: pushy uploadIpa <ipaFile>');
      }
      const name = yield (0, _utils.getIPAVersion)(fn);

      var _ref6 = yield (0, _app.getSelectedApp)('ios');

      const appId = _ref6.appId;

      var _ref7 = yield uploadFile(fn);

      const hash = _ref7.hash;

      var _ref8 = yield post(`/app/${appId}/package/create`, {
        name,
        hash
      });

      const id = _ref8.id;

      console.log(`Ipa uploaded: ${id}`);
    });

    return function uploadIpa(_x3) {
      return _ref4.apply(this, arguments);
    };
  }(),
  uploadApk: function () {
    var _ref9 = _asyncToGenerator(function* (_ref10) {
      let args = _ref10.args;

      const fn = args[0];
      if (!fn) {
        throw new Error('Usage: pushy uploadApk <apkFile>');
      }
      const name = yield (0, _utils.getApkVersion)(fn);

      var _ref11 = yield (0, _app.getSelectedApp)('android');

      const appId = _ref11.appId;

      var _ref12 = yield uploadFile(fn);

      const hash = _ref12.hash;

      var _ref13 = yield post(`/app/${appId}/package/create`, {
        name,
        hash
      });

      const id = _ref13.id;

      console.log(`Apk uploaded: ${id}`);
    });

    return function uploadApk(_x4) {
      return _ref9.apply(this, arguments);
    };
  }(),
  packages: function () {
    var _ref14 = _asyncToGenerator(function* (_ref15) {
      let options = _ref15.options;

      const platform = (0, _app.checkPlatform)(options.platform || (yield (0, _utils.question)('Platform(ios/android):')));

      var _ref16 = yield (0, _app.getSelectedApp)(platform);

      const appId = _ref16.appId;

      yield listPackage(appId);
    });

    return function packages(_x5) {
      return _ref14.apply(this, arguments);
    };
  }()
};