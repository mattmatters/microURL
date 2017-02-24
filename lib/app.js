'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongodb = require('mongodb');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var publicURL = 'http://poop.com/';
var mongoURL = 'mongodb://localhost:27017/microURL';
var LOCAL_PORT = 3000;
var app = (0, _express2.default)();

var findUrl = function findUrl(db, url, cb) {
  return db.collection('urls').find({ index: parseInt(url, 10) }).toArray().then(function (item) {
    cb(item[0]);
  });
};

var countEntries = function countEntries(db, cb) {
  db.collection('urls').find().count().then(function (count) {
    cb({ count: count });
  });
};

var findEntries = function findEntries(db, cb) {
  db.collection('urls').find().toArray().then(function (items) {
    cb(items);
  });
};

var insertUrl = function insertUrl(db, url, cb) {
  countEntries(db, function (response) {
    db.collection('urls').insertMany([{
      number: response.count + 1,
      originalUrl: url
    }], function (err, result) {
      cb(result);
    });
  });
};

app.get('/', function (req, res) {
  res.sendFile(_path2.default.join(__dirname, '../static/index.html'));
});

app.get('/url/:tinyUrl', function (req, res) {
  _mongodb.MongoClient.connect(mongoURL, function (err, db) {
    if (err === null) {
      findUrl(db, req.params.tinyUrl, function (url) {
        if (url) {
          res.redirect('http://' + url.originalUrl);
        } else {
          res.send('No url on database');
        }
        db.close();
      });
    } else {
      res.send(err);
      db.close();
    }
  });
});

app.get('/new/:url', function (req, res) {
  _mongodb.MongoClient.connect(mongoURL, function (err, db) {
    console.log('new request');
    if (err === null) {
      insertUrl(db, req.params.url, function (result) {
        var _result$ops$ = result.ops[0],
            number = _result$ops$.number,
            originalUrl = _result$ops$.originalUrl;

        res.send({
          shortendUrl: publicURL.concat(number),
          originalUrl: originalUrl
        });
        db.close();
      });
    } else {
      res.send(err);
      db.close();
    }
  });
});

app.options('*', (0, _cors2.default)());

app.get('/size', function (req, res) {
  _mongodb.MongoClient.connect(mongoURL, function (err, db) {
    if (err === null) {
      countEntries(db, function (result) {
        res.send(result);
      });
      db.close();
    } else {
      res.send(err);
      db.close();
    }
  });
});

app.get('/all', function (req, res) {
  _mongodb.MongoClient.connect(mongoURL, function (err, db) {
    findEntries(db, function (entries) {
      res.send(entries);
      db.close();
    });
  });
});

app.listen(LOCAL_PORT, function () {
  console.log('app is listening on port ' + LOCAL_PORT);
});