'use strict';

var _utils = require('./utils');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * Created by tdzl2003 on 2/13/16.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */

var _require = require('./api');

const post = _require.post,
      get = _require.get,
      replaceSession = _require.replaceSession,
      saveSession = _require.saveSession,
      closeSession = _require.closeSession;

const crypto = require('crypto');

function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

exports.commands = {
  login: function () {
    var _ref = _asyncToGenerator(function* (_ref2) {
      let args = _ref2.args;

      const email = args[0] || (yield (0, _utils.question)('email:'));
      const pwd = args[1] || (yield (0, _utils.question)('password:', true));

      var _ref3 = yield post('/user/login', {
        email,
        pwd: md5(pwd)
      });

      const token = _ref3.token,
            info = _ref3.info;

      replaceSession({ token });
      yield saveSession();
      console.log(`Welcome, ${info.name}.`);
    });

    return function login(_x) {
      return _ref.apply(this, arguments);
    };
  }(),
  logout: function () {
    var _ref4 = _asyncToGenerator(function* () {
      yield closeSession();
      console.log('Logged out.');
    });

    return function logout() {
      return _ref4.apply(this, arguments);
    };
  }(),
  me: function () {
    var _ref5 = _asyncToGenerator(function* () {
      const me = yield get('/user/me');
      for (const k in me) {
        if (k !== 'ok') {
          console.log(`${k}: ${me[k]}`);
        }
      }
    });

    return function me() {
      return _ref5.apply(this, arguments);
    };
  }()
};