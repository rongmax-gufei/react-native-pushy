'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commands = exports.chooseApp = exports.listApp = exports.getSelectedApp = undefined;

let getSelectedApp = exports.getSelectedApp = function () {
  var _ref = _asyncToGenerator(function* (platform) {
    checkPlatform(platform);

    if (!(yield fs.exists('update.json'))) {
      throw new Error(`App not selected. run 'pushy selectApp --platform ${platform}' first!`);
    }
    const updateInfo = JSON.parse((yield fs.readFile('update.json', 'utf8')));
    if (!updateInfo[platform]) {
      throw new Error(`App not selected. run 'pushy selectApp --platform ${platform}' first!`);
    }
    return updateInfo[platform];
  });

  return function getSelectedApp(_x) {
    return _ref.apply(this, arguments);
  };
}();

let listApp = exports.listApp = function () {
  var _ref2 = _asyncToGenerator(function* (platform) {
    var _ref3 = yield get('/app/list');

    const data = _ref3.data;

    const list = platform ? data.filter(function (v) {
      return v.platform === platform;
    }) : data;
    for (const app of list) {
      console.log(`${app.id}) ${app.name}(${app.platform})`);
    }
    if (platform) {
      console.log(`\nTotal ${list.length} ${platform} apps`);
    } else {
      console.log(`\nTotal ${list.length} apps`);
    }
    return list;
  });

  return function listApp(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

let chooseApp = exports.chooseApp = function () {
  var _ref4 = _asyncToGenerator(function* (platform) {
    const list = yield listApp(platform);

    while (true) {
      const id = yield (0, _utils.question)('Enter appId:');
      const app = list.find(function (v) {
        return v.id === (id | 0);
      });
      if (app) {
        return app;
      }
    }
  });

  return function chooseApp(_x3) {
    return _ref4.apply(this, arguments);
  };
}();

exports.checkPlatform = checkPlatform;

var _utils = require('./utils');

var _fsPromise = require('fs-promise');

var fs = _interopRequireWildcard(_fsPromise);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * Created by tdzl2003 on 2/13/16.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */

var _require = require('./api');

const post = _require.post,
      get = _require.get,
      doDelete = _require.doDelete;


const validPlatforms = {
  ios: 1,
  android: 1
};

function checkPlatform(platform) {
  if (!validPlatforms[platform]) {
    throw new Error(`Invalid platform '${platform}'`);
  }
  return platform;
}

const commands = exports.commands = {
  createApp: function () {
    var _ref5 = _asyncToGenerator(function* (_ref6) {
      let options = _ref6.options;

      const name = options.name || (yield (0, _utils.question)('App Name:'));
      const downloadUrl = options.downloadUrl;

      const platform = checkPlatform(options.platform || (yield (0, _utils.question)('Platform(ios/android):')));

      var _ref7 = yield post('/app/create', { name, platform });

      const id = _ref7.id;

      console.log(`Created app ${id}`);
      yield this.selectApp({
        args: [id],
        options: { platform, downloadUrl }
      });
    });

    return function createApp(_x4) {
      return _ref5.apply(this, arguments);
    };
  }(),
  deleteApp: function () {
    var _ref8 = _asyncToGenerator(function* (_ref9) {
      let args = _ref9.args,
          options = _ref9.options;
      const platform = options.platform;

      const id = args[0] || chooseApp(platform);
      if (!id) {
        console.log('Canceled');
      }
      yield doDelete(`/app/${id}`);
      console.log('Ok.');
    });

    return function deleteApp(_x5) {
      return _ref8.apply(this, arguments);
    };
  }(),
  apps: function () {
    var _ref10 = _asyncToGenerator(function* (_ref11) {
      let options = _ref11.options;
      const platform = options.platform;

      listApp(platform);
    });

    return function apps(_x6) {
      return _ref10.apply(this, arguments);
    };
  }(),
  selectApp: function () {
    var _ref12 = _asyncToGenerator(function* (_ref13) {
      let args = _ref13.args,
          options = _ref13.options;

      const platform = checkPlatform(options.platform || (yield (0, _utils.question)('Platform(ios/android):')));
      const id = args[0] || (yield chooseApp(platform)).id;

      let updateInfo = {};
      if (yield fs.exists('update.json')) {
        try {
          updateInfo = JSON.parse((yield fs.readFile('update.json', 'utf8')));
        } catch (e) {
          console.error('Failed to parse file `update.json`. Try to remove it manually.');
          throw e;
        }
      }

      var _ref14 = yield get(`/app/${id}`);

      const appKey = _ref14.appKey;

      updateInfo[platform] = {
        appId: id,
        appKey
      };
      yield fs.writeFile('update.json', JSON.stringify(updateInfo, null, 4), 'utf8');
    });

    return function selectApp(_x7) {
      return _ref12.apply(this, arguments);
    };
  }()
};