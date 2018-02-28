'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commands = undefined;

let showVersion = function () {
  var _ref = _asyncToGenerator(function* (appId, offset) {
    var _ref2 = yield get(`/app/${appId}/version/list`);

    const data = _ref2.data,
          count = _ref2.count;

    console.log(`Offset ${offset}`);
    for (const version of data) {
      let packageInfo = version.packages.slice(0, 3).map(function (v) {
        return v.name;
      }).join(', ');
      const count = version.packages.length;
      if (count > 3) {
        packageInfo += `...and ${count - 3} more`;
      }
      if (count === 0) {
        packageInfo = `(no package)`;
      } else {
        packageInfo = `[${packageInfo}]`;
      }
      console.log(`${version.id}) ${version.hash.slice(0, 8)} ${version.name} ${packageInfo}`);
    }
    return data;
  });

  return function showVersion(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

let listVersions = function () {
  var _ref3 = _asyncToGenerator(function* (appId) {
    let offset = 0;
    while (true) {
      yield showVersion(appId, offset);
      const cmd = yield (0, _utils.question)('page Up/page Down/Begin/Quit(U/D/B/Q)');
      switch (cmd.toLowerCase()) {
        case 'u':
          offset = Math.max(0, offset - 10);break;
        case 'd':
          offset += 10;break;
        case 'b':
          offset = 0;break;
        case 'q':
          return;
      }
    }
  });

  return function listVersions(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

let chooseVersion = function () {
  var _ref4 = _asyncToGenerator(function* (appId) {
    let offset = 0;
    while (true) {
      const data = yield showVersion(appId, offset);
      const cmd = yield (0, _utils.question)('Enter versionId or page Up/page Down/Begin(U/D/B)');
      switch (cmd.toLowerCase()) {
        case 'U':
          offset = Math.max(0, offset - 10);break;
        case 'D':
          offset += 10;break;
        case 'B':
          offset = 0;break;
        default:
          {
            const v = data.find(function (v) {
              return v.id === (cmd | 0);
            });
            if (v) {
              return v;
            }
          }
      }
    }
  });

  return function chooseVersion(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

var _utils = require('./utils');

var _app = require('./app');

var _package = require('./package');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Created by tdzl2003 on 4/2/16.
 */

var _require = require('./api');

const get = _require.get,
      post = _require.post,
      put = _require.put,
      uploadFile = _require.uploadFile;
const commands = exports.commands = {
  publish: function () {
    var _ref5 = _asyncToGenerator(function* (_ref6) {
      let args = _ref6.args,
          options = _ref6.options;

      const fn = args[0];
      const name = options.name,
            description = options.description,
            metaInfo = options.metaInfo;


      if (!fn) {
        throw new Error('Usage: pushy publish <ppkFile> --platform ios|android');
      }

      const platform = (0, _app.checkPlatform)(options.platform || (yield (0, _utils.question)('Platform(ios/android):')));

      var _ref7 = yield (0, _app.getSelectedApp)(platform);

      const appId = _ref7.appId;

      var _ref8 = yield uploadFile(fn);

      const hash = _ref8.hash;

      var _ref9 = yield post(`/app/${appId}/version/create`, {
        name: name || (yield (0, _utils.question)('Enter version name:')) || '(未命名)',
        hash,
        description: description || (yield (0, _utils.question)('Enter description:')),
        metaInfo: metaInfo || (yield (0, _utils.question)('Enter meta info:'))
      });

      const id = _ref9.id;

      console.log(`Version published: ${id}`);

      const v = yield (0, _utils.question)('Would you like to bind packages to this version?(Y/N)');
      if (v.toLowerCase() === 'y') {
        yield this.update({ args: [], options: { versionId: id, platform } });
      }
    });

    return function publish(_x5) {
      return _ref5.apply(this, arguments);
    };
  }(),
  versions: function () {
    var _ref10 = _asyncToGenerator(function* (_ref11) {
      let options = _ref11.options;

      const platform = (0, _app.checkPlatform)(options.platform || (yield (0, _utils.question)('Platform(ios/android):')));

      var _ref12 = yield (0, _app.getSelectedApp)(platform);

      const appId = _ref12.appId;

      yield listVersions(appId);
    });

    return function versions(_x6) {
      return _ref10.apply(this, arguments);
    };
  }(),
  update: function () {
    var _ref13 = _asyncToGenerator(function* (_ref14) {
      let args = _ref14.args,
          options = _ref14.options;

      const platform = (0, _app.checkPlatform)(options.platform || (yield (0, _utils.question)('Platform(ios/android):')));

      var _ref15 = yield (0, _app.getSelectedApp)(platform);

      const appId = _ref15.appId;

      const versionId = options.versionId || (yield chooseVersion(appId)).id;
      const pkgId = options.packageId || (yield (0, _package.choosePackage)(appId)).id;
      yield put(`/app/${appId}/package/${pkgId}`, {
        versionId
      });
      console.log('Ok.');
    });

    return function update(_x7) {
      return _ref13.apply(this, arguments);
    };
  }()
};