import express from 'express';
import { MongoClient } from 'mongodb';
import path from 'path';
import cors from 'cors';
import process from 'process';

const publicURL = 'http://kindasmallurl.fun/';
const mongoURL = process.env.MONGO_URI ? process.env.MONGO_URI : 'mongodb://localhost:27017/kindasmallurl';
const PORT = process.env.PORT ? process.env.PORT : 3000;
const app = express();

const findUrl = (db, url, cb) => (
  db.collection('urls').find({ number: parseInt(url, 10) }).toArray()
    .then((item) => {
      cb(item[0]);
    })
);

const countEntries = (db, cb) => {
  db.collection('urls').find().count()
    .then((count) => {
      cb({ count });
    });
};

const findEntries = (db, cb) => {
  db.collection('urls').find().toArray()
    .then((items) => {
      cb(items);
    });
};

const insertUrl = (db, url, cb) => {
  countEntries(db, (response) => {
    db.collection('urls').insertMany([{
      number: response.count + 1,
      originalUrl: url,
    }], (err, result) => {
      cb(result);
    });
  });
};


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../static/index.html'));
});

app.get('/url/:tinyUrl', (req, res) => {
  MongoClient.connect(mongoURL, (err, db) => {
    if (err === null) {
      findUrl(db, req.params.tinyUrl, (url) => {
        if (url) {
          res.redirect(`http://${url.originalUrl}`);
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

app.get('/new/:url', (req, res) => {
  MongoClient.connect(mongoURL, (err, db) => {
    if (err === null) {
      insertUrl(db, req.params.url, (result) => {
        const { number, originalUrl } = result.ops[0];
        res.send({
          shortendUrl: `${publicURL}url/${number}`,
          originalUrl,
        });
        db.close();
      });
    } else {
      res.send(err);
      db.close();
    }
  });
});

app.options('*', cors());

app.get('/size', (req, res) => {
  MongoClient.connect(mongoURL, (err, db) => {
    if (err === null) {
      countEntries(db, (result) => {
        res.send(result);
      });
      db.close();
    } else {
      res.send(err);
      db.close();
    }
  });
});

app.get('/all', (req, res) => {
  MongoClient.connect(mongoURL, (err, db) => {
    findEntries(db, (entries) => {
      res.send(entries);
      db.close();
    });
  });
});

app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});
