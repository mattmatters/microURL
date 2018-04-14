const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
const cors = require('cors');
const process = require('process');

const PUBLIC_URL = process.env.PUBLIC_URL || 'http://kindasmallurl.fun/';
const MONGO_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/kindasmallurl';
const PORT = process.env.PORT || 3000;

const app = express();
app.use('/static', express.static('static'));

// Db Wrapper
const connectDb = () => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(MONGO_URL, (err, db) => {
      return err ? reject(err) : resolve(db);
    });
  });
};

const findUrl = (db, url) => {
  const lookupVal = { number: url };

  return new Promise((resolve, reject) => {
    db.collection('urls')
      .find({ number: url })
      .toArray()
      .then(item => resolve(item[0]))
      .catch(err => reject(err));
  });
};

const insertUrl = (db, url) => {
  const insertVal = {
    number: randomString(80),
    originalUrl: url.replace(/http(s)?\:\/\//, ''),
  };

  return new Promise((resolve, reject) => {
    db.collection('urls').insertMany([insertVal], (err, result) => {
      err ? reject(err) : resolve(result);
    });
  });
};

// Util
const randomString = (len, bits = 36) => {
  let outStr = '';
  let newStr;

  while (outStr.length < len) {
    newStr = Math.random()
      .toString(bits)
      .slice(2);
    outStr += newStr.slice(0, Math.min(newStr.length, len - outStr.length));
  }
  return outStr;
};

// For local testing
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../static/index.html'));
});

// The real api calls
// @TODO Change to 404 error for unfound url
app.get('/url/:tinyUrl', async (req, res) => {
  const db = await connectDb();
  const url = await findUrl(db, req.params.tinyUrl);

  url ? res.redirect(`http://${url.originalUrl}`) : res.send('No url on database');
  db.close();

  return;
});

app.get('/new/:url', async (req, res) => {
  const db = await connectDb();
  const result = await insertUrl(db, req.params.url);
  const { number, originalUrl } = result.ops[0];
  res.send({
    shortendUrl: `${PUBLIC_URL}url/${number}`,
    originalUrl: req.params.url,
  });
  db.close();
});


// Config
app.options('*', cors());

app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});
